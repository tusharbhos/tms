import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { randomInt } from 'crypto';
import * as bcrypt from 'bcryptjs';

/**
 * OTP service — reusable.
 * - generate(): creates a 6-digit OTP, stores in user_otps with 10-min TTL
 * - verify():   checks code, marks consumed, increments attempts
 * - send():     mocks SMS/email delivery via console.log (replace with
 *               provider call in production — see modules/integrations/sms)
 */
@Injectable()
export class OtpService {
  private readonly logger = new Logger(OtpService.name);
  private readonly TTL_MIN = 10;
  private readonly MAX_ATTEMPTS = 5;

  constructor(private readonly prisma: PrismaService) {}

  /** Generate + store + deliver an OTP. Returns the OTP id (NOT the code). */
  async generate(params: {
    userId?: number;
    tenantId?: number;
    loginId?: string;
    mobile?: string;
    email?: string;
    purpose: 'LOGIN' | 'VERIFY_MOBILE' | 'VERIFY_EMAIL' | 'RESET_PASSWORD' | 'POD_DELIVERY';
  }): Promise<{ otpId: number; expiresAt: Date }> {
    const code = String(randomInt(100000, 999999));
    const expiresAt = new Date(Date.now() + this.TTL_MIN * 60 * 1000);
    const otpHash = `${params.purpose}:${await bcrypt.hash(code, 10)}`;

    const row = await (this.prisma as any).userOtps.create({
      data: {
        userId: params.userId ?? null,
        tenantId: params.tenantId ?? null,
        loginId: params.loginId ?? null,
        otpHash,
        expiresAt,
        failedOtpLoginAttempts: 0,
        createdAt: new Date(),
      },
    });

    // MOCK delivery: replace with SMS/email gateway in production.
    if (params.mobile) {
      this.logger.log(`📱 SMS to ${params.mobile}: Your TMS OTP is ${code}. Valid ${this.TTL_MIN} min.`);
    }
    if (params.email) {
      this.logger.log(`📧 Email to ${params.email}: Your TMS OTP is ${code}. Valid ${this.TTL_MIN} min.`);
    }
    // dev convenience — always print, never in prod
    if (process.env.NODE_ENV !== 'production') {
      this.logger.warn(`🔓 DEV: OTP for ${params.mobile ?? params.email ?? 'user ' + params.userId} = ${code}`);
    }

    return { otpId: Number(row.id), expiresAt };
  }

  /** Verify a code. Throws on invalid/expired/too-many-attempts. */
  async verify(otpId: number, code: string): Promise<{ userId?: number; mobile?: string; email?: string; purpose: string }> {
    const row: any = await (this.prisma as any).userOtps.findUnique({ where: { id: BigInt(otpId) } });
    if (!row) throw new BadRequestException('Invalid OTP');
    if (row.deletedAt || !row.otpHash) throw new BadRequestException('OTP already used');
    if (row.expiresAt < new Date()) throw new BadRequestException('OTP expired');
    if (row.otpLoginBlockedTill && row.otpLoginBlockedTill > new Date()) {
      throw new BadRequestException('OTP login blocked temporarily');
    }
    if ((row.failedOtpLoginAttempts ?? 0) >= this.MAX_ATTEMPTS) throw new BadRequestException('Too many attempts');

    const separator = row.otpHash.indexOf(':');
    const purpose = separator > 0 ? row.otpHash.slice(0, separator) : 'LOGIN';
    const hash = separator > 0 ? row.otpHash.slice(separator + 1) : row.otpHash;
    const ok = await bcrypt.compare(code, hash);

    if (!ok) {
      const attempts = (row.failedOtpLoginAttempts ?? 0) + 1;
      await (this.prisma as any).userOtps.update({
        where: { id: row.id },
        data: {
          failedOtpLoginAttempts: { increment: 1 },
          otpLoginBlockedTill: attempts >= this.MAX_ATTEMPTS
            ? new Date(Date.now() + this.TTL_MIN * 60 * 1000)
            : null,
        },
      });
      throw new BadRequestException('Wrong OTP');
    }

    await (this.prisma as any).userOtps.update({
      where: { id: row.id },
      data: { otpHash: null, deletedAt: new Date() },
    });

    return { userId: row.userId, purpose };
  }
}
