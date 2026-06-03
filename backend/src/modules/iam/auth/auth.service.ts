import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../../database/prisma.service';
import { PasswordService } from '../../../common/services/password.service';
import { OtpService } from '../../../common/services/otp.service';
import { AuditService } from '../../../common/services/audit.service';
import { LoginDto } from './dto/login.dto';
import { OtpRequestDto } from './dto/otp-request.dto';
import { OtpVerifyDto } from './dto/otp-verify.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly password: PasswordService,
    private readonly otp: OtpService,
    private readonly audit: AuditService,
  ) {}

  // ─── core: load user + role + privileges in one go ───
  private async loadUserWithPrivileges(loginId: string): Promise<any | null> {
    // 1. user
    const user: any = await (this.prisma as any).users.findFirst({
      where: { loginId, active: true, deletedAt: null },
    });
    if (!user) return null;

    // 2. role
    if (!user.roleId) return { ...user, privileges: [] };
    const role: any = await (this.prisma as any).role.findUnique({ where: { id: user.roleId } });

    // 3. role privileges (the join table)
    const links: any[] = await (this.prisma as any).rolePrivileges.findMany({
      where: { roleId: user.roleId },
    });

    // 4. privilege rows
    const privs: any[] = links.length
      ? await (this.prisma as any).privileges.findMany({
          where: { id: { in: links.map((l) => l.privilegeId) }, isActive: true },
        })
      : [];

    return { ...user, role, privileges: privs.map((p) => p.name) };
  }

  private signTokens(payload: any) {
    const accessToken = this.jwt.sign(payload, {
      secret: process.env.JWT_ACCESS_SECRET || 'dev-access-secret-change-me',
      expiresIn: process.env.JWT_ACCESS_TTL || '15m',
    });
    const refreshToken = this.jwt.sign(
      { sub: payload.sub, tenantId: payload.tenantId },
      {
        secret: process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret-change-me',
        expiresIn: process.env.JWT_REFRESH_TTL || '30d',
      },
    );
    return { accessToken, refreshToken };
  }

  /** Login with password — returns access + refresh tokens. */
  async login(dto: LoginDto, ip?: string, ua?: string) {
    const user = await this.loadUserWithPrivileges(dto.loginId);
    if (!user) {
      await this.recordAttempt(dto.loginId, false, ip, ua, 'USER_NOT_FOUND');
      throw new UnauthorizedException('Invalid credentials');
    }
    if (!user.passwordHash) {
      await this.recordAttempt(dto.loginId, false, ip, ua, 'NO_PASSWORD');
      throw new UnauthorizedException('Password login disabled for this user');
    }
    const ok = await this.password.verify(dto.password, user.passwordHash);
    if (!ok) {
      await this.recordAttempt(dto.loginId, false, ip, ua, 'BAD_PASSWORD');
      // bump fail counter
      await (this.prisma as any).users.update({
        where: { id: user.id },
        data: { failedLoginAttempts: { increment: 1 } },
      });
      throw new UnauthorizedException('Invalid credentials');
    }

    // success: reset fail counter, write session, audit
    await (this.prisma as any).users.update({
      where: { id: user.id },
      data: { lastLogin: new Date(), failedLoginAttempts: 0 },
    });
    await this.recordAttempt(dto.loginId, true, ip, ua);
    await this.audit.log({
      tenantId: user.tenantId, userId: user.id, action: 'LOGIN',
      entityType: 'user', entityId: String(user.id), ipAddress: ip, userAgent: ua,
    });

    const payload = {
      sub: user.id,
      tenantId: user.tenantId,
      roleId: user.roleId,
      loginId: user.loginId,
      privileges: user.privileges,
    };
    const tokens = this.signTokens(payload);

    // store session
    await (this.prisma as any).userSessions.create({
      data: {
        userId: user.id,
        tenantId: user.tenantId,
        sessionToken: tokens.accessToken.slice(-32),
        ipAddress: ip,
        userAgent: ua,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000),
        isActive: true,
        createdAt: new Date(),
      },
    }).catch(() => void 0);

    return {
      ...tokens,
      user: {
        id: user.id, loginId: user.loginId, name: user.name,
        email: user.email, mobile: user.mobile,
        tenantId: user.tenantId, roleId: user.roleId,
        roleName: user.role?.name,
        privileges: user.privileges,
      },
    };
  }

  /** Send an OTP for login / verify / reset. */
  async sendOtp(dto: OtpRequestDto) {
    if (!dto.mobile && !dto.email) {
      throw new BadRequestException('Provide mobile or email');
    }
    let user: any | null = null;
    if (dto.mobile || dto.email) {
      user = await (this.prisma as any).users.findFirst({
        where: {
          OR: [
            dto.mobile ? { mobile: dto.mobile } : undefined,
            dto.email ? { email: dto.email } : undefined,
          ].filter(Boolean) as any,
          active: true,
          deletedAt: null,
        },
      });
    }
    if (!user) {
      throw new BadRequestException('No active user found for this mobile/email');
    }
    const { otpId, expiresAt } = await this.otp.generate({
      userId: user.id,
      tenantId: user.tenantId,
      loginId: user.loginId,
      mobile: dto.mobile,
      email: dto.email,
      purpose: dto.purpose,
    });
    return { otpId, expiresAt, message: 'OTP sent. Check console in dev mode.' };
  }

  /** Verify OTP and (if LOGIN purpose) return tokens. */
  async verifyOtp(dto: OtpVerifyDto, ip?: string, ua?: string) {
    const result = await this.otp.verify(dto.otpId, dto.code);

    if (result.purpose === 'LOGIN' && result.userId) {
      const user: any = await (this.prisma as any).users.findUnique({ where: { id: result.userId } });
      if (!user) throw new UnauthorizedException('User missing');
      const full = await this.loadUserWithPrivileges(user.loginId);
      const payload = {
        sub: full.id, tenantId: full.tenantId, roleId: full.roleId,
        loginId: full.loginId, privileges: full.privileges,
      };
      const tokens = this.signTokens(payload);
      await this.audit.log({
        tenantId: full.tenantId, userId: full.id, action: 'LOGIN_OTP',
        entityType: 'user', entityId: String(full.id), ipAddress: ip, userAgent: ua,
      });
      return {
        ...tokens,
        user: {
          id: full.id, loginId: full.loginId, name: full.name,
          tenantId: full.tenantId, roleId: full.roleId,
          roleName: full.role?.name, privileges: full.privileges,
        },
      };
    }

    return { verified: true, purpose: result.purpose, message: 'OTP verified' };
  }

  /** Trade a refresh token for a fresh access token. */
  async refresh(userId: number) {
    const user: any = await (this.prisma as any).users.findUnique({ where: { id: userId } });
    if (!user || !user.active) throw new UnauthorizedException();
    const full = await this.loadUserWithPrivileges(user.loginId);
    const payload = {
      sub: full.id, tenantId: full.tenantId, roleId: full.roleId,
      loginId: full.loginId, privileges: full.privileges,
    };
    return this.signTokens(payload);
  }

  /** Log out — deactivate session row. */
  async logout(userId: number, accessTokenSuffix: string) {
    await (this.prisma as any).userSessions.updateMany({
      where: { userId, sessionToken: accessTokenSuffix, isActive: true },
      data: { isActive: false, loggedOutAt: new Date() },
    }).catch(() => void 0);
    await this.audit.log({ userId, action: 'LOGOUT', entityType: 'user', entityId: String(userId) });
    return { ok: true };
  }

  /** Get currently logged-in user (with fresh privileges). */
  async me(userId: number) {
    const user: any = await (this.prisma as any).users.findUnique({ where: { id: userId } });
    if (!user) throw new UnauthorizedException();
    const full = await this.loadUserWithPrivileges(user.loginId);
    return {
      id: full.id, loginId: full.loginId, name: full.name,
      email: full.email, mobile: full.mobile,
      tenantId: full.tenantId, roleId: full.roleId,
      roleName: full.role?.name, privileges: full.privileges,
    };
  }

  private async recordAttempt(loginId: string, success: boolean, ip?: string, ua?: string, failReason?: string) {
    try {
      await (this.prisma as any).loginAttempts.create({
        data: {
          loginId, success, ipAddress: ip, userAgent: ua,
          failReason: failReason ?? null, createdAt: new Date(),
        },
      });
    } catch { /* ignore */ }
  }
}
