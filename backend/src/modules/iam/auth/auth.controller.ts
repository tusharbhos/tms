import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { OtpRequestDto } from './dto/otp-request.dto';
import { OtpVerifyDto } from './dto/otp-verify.dto';
import { Public } from '../../../common/decorators/public.decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Public()
  @Post('login')
  @ApiOperation({ summary: 'Password login (loginId + password)' })
  login(@Body() dto: LoginDto, @Req() req: any) {
    return this.auth.login(dto, req.ip, req.headers['user-agent']);
  }

  @Public()
  @Post('otp/send')
  @ApiOperation({ summary: 'Send an OTP to mobile / email' })
  sendOtp(@Body() dto: OtpRequestDto) {
    return this.auth.sendOtp(dto);
  }

  @Public()
  @Post('otp/verify')
  @ApiOperation({ summary: 'Verify an OTP — returns tokens if purpose=LOGIN' })
  verifyOtp(@Body() dto: OtpVerifyDto, @Req() req: any) {
    return this.auth.verifyOtp(dto, req.ip, req.headers['user-agent']);
  }

  @UseGuards(AuthGuard('jwt-refresh'))
  @ApiBearerAuth()
  @Post('refresh')
  @ApiOperation({ summary: 'Get a new access token using the refresh token' })
  refresh(@Req() req: any) {
    return this.auth.refresh(req.user.sub);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Post('logout')
  @ApiOperation({ summary: 'Logout current session' })
  logout(@Req() req: any) {
    const token = (req.headers.authorization || '').replace(/^Bearer\s+/, '');
    return this.auth.logout(req.user.sub, token.slice(-32));
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Get('me')
  @ApiOperation({ summary: 'Get current user + privileges' })
  me(@Req() req: any) {
    return this.auth.me(req.user.sub);
  }
}
