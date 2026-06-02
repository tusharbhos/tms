import { IsString, IsNumber } from 'class-validator';
export class OtpVerifyDto {
  @IsNumber() otpId!: number;
  @IsString() code!: string;
}
