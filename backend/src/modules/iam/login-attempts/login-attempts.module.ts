import { Module } from '@nestjs/common';
import { LoginAttemptsController } from './login-attempts.controller';
import { LoginAttemptsService } from './login-attempts.service';
import { LoginAttemptsRepository } from './login-attempts.repository';
import { DatabaseModule } from '../../../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [LoginAttemptsController],
  providers: [LoginAttemptsRepository, LoginAttemptsService],
  exports: [LoginAttemptsService],
})
export class LoginAttemptsModule {}
