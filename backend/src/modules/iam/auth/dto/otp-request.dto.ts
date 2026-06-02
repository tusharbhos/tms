import { IsString, IsOptional, IsIn } from 'class-validator';
export class OtpRequestDto {
  @IsOptional() @IsString() mobile?: string;
  @IsOptional() @IsString() email?: string;
  @IsIn(['LOGIN', 'VERIFY_MOBILE', 'VERIFY_EMAIL', 'RESET_PASSWORD'])
  purpose!: 'LOGIN' | 'VERIFY_MOBILE' | 'VERIFY_EMAIL' | 'RESET_PASSWORD';
}
