import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

export interface JwtPayload {
  sub: number;          // user id
  tenantId: number;
  roleId: number;
  loginId: string;
  privileges: string[]; // already-loaded privilege list
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_ACCESS_SECRET || 'dev-access-secret-change-me',
    });
  }

  async validate(payload: JwtPayload) {
    // payload becomes req.user
    return payload;
  }
}
