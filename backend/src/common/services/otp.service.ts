import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { randomInt } from 'crypto';

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
    mobile?: string;
    email?: string;
    purpose: 'LOGIN' | 'VERIFY_MOBILE' | 'VERIFY_EMAIL' | 'RESET_PASSWORD' | 'POD_DELIVERY';
  }): Promise<{ otpId: number; expiresAt: Date }> {
    const code = String(randomInt(100000, 999999));
    const expiresAt = new Date(Date.now() + this.TTL_MIN * 60 * 1000);

    const row = await (this.prisma as any).userOtps.create({
      data: {
        userId: params.userId ?? null,
        mobile: params.mobile ?? null,
        email: params.email ?? null,
        purpose: params.purpose,
        otpCode: code,
        expiresAt,
        attempts: 0,
        isConsumed: false,
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

    return { otpId: row.id, expiresAt };
  }

  /** Verify a code. Throws on invalid/expired/too-many-attempts. */
  async verify(otpId: number, code: string): Promise<{ userId?: number; mobile?: string; email?: string; purpose: string }> {
    const row: any = await (this.prisma as any).userOtps.findUnique({ where: { id: otpId } });
    if (!row) throw new BadRequestException('Invalid OTP');
    if (row.isConsumed) throw new BadRequestException('OTP already used');
    if (row.expiresAt < new Date()) throw new BadRequestException('OTP expired');
    if (row.attempts >= this.MAX_ATTEMPTS) throw new BadRequestException('Too many attempts');

    if (row.otpCode !== code) {
      await (this.prisma as any).userOtps.update({
        where: { id: otpId }, data: { attempts: { increment: 1 } },
      });
      throw new BadRequestException('Wrong OTP');
    }

    await (this.prisma as any).userOtps.update({
      where: { id: otpId }, data: { isConsumed: true, consumedAt: new Date() },
    });

    return { userId: row.userId, mobile: row.mobile, email: row.email, purpose: row.purpose };
  }
}
