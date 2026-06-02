import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

/**
 * Reusable password hashing service.
 * Used by user creation, password change, login verification.
 */
@Injectable()
export class PasswordService {
  private readonly rounds = 10;

  hash(plain: string): Promise<string> {
    return bcrypt.hash(plain, this.rounds);
  }

  verify(plain: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(plain, hashed);
  }

  /** Demo helper — same hash that seed.ts uses for 'demo123' */
  static demoHash(): string {
    return '$2a$10$wWQVjF2eR7HC4yHpYg.4qO6q3yY7CFWY6V0L4U/6P2hjBM/x7VGv2';
  }
}
