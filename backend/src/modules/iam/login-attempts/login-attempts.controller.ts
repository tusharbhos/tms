import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards, Res, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Public } from '../../../common/decorators/public.decorator';
import { ExcelService, ColumnDef  } from '../../../common/services/excel.service';
import { LoginAttemptsService } from './login-attempts.service';
import { CreateLoginAttemptsSchema, CreateLoginAttemptsDto } from './dto/create-login-attempts.dto';
import { UpdateLoginAttemptsSchema, UpdateLoginAttemptsDto } from './dto/update-login-attempts.dto';
import { FilterLoginAttemptsSchema, FilterLoginAttemptsDto } from './dto/filter-login-attempts.dto';
import { ZodValidationPipe } from '../../../common/pipes/zod-validation.pipe';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { TenantGuard } from '../../../common/guards/tenant.guard';
import { CurrentTenant } from '../../../common/decorators/tenant.decorator';
import { CurrentUser } from '../../../common/decorators/user.decorator';

@UseGuards(JwtAuthGuard, TenantGuard)
@ApiTags('iam/login-attempts')
@ApiBearerAuth()
@Controller('iam/login-attempts')
export class LoginAttemptsController {
  constructor(private readonly service: LoginAttemptsService,
    private readonly excelService: ExcelService) {}

  @Post()
  create(
    @CurrentTenant() tenantId: number,
    @CurrentUser('id') userId: number,
    @Body(new ZodValidationPipe(CreateLoginAttemptsSchema)) dto: CreateLoginAttemptsDto,
  ) {
    return this.service.create(tenantId, userId, dto);
  }

  @Get()
  findAll(
    @CurrentTenant() tenantId: number,
    @Query(new ZodValidationPipe(FilterLoginAttemptsSchema)) query: FilterLoginAttemptsDto,
  ) {
    return this.service.findAll(tenantId, query);
  }

  @Get(':id')
  findOne(@CurrentTenant() tenantId: number, @Param('id') id: string) {
    return this.service.findOne(tenantId, id);
  }

  // ───────── Excel import / export ─────────
  private readonly excelColumns: ColumnDef[] = [
    { key: 'userId', label: 'User Id', type: 'number' },
    { key: 'loginIdentifier', label: 'Login Identifier', type: 'string' },
    { key: 'attemptedAt', label: 'Attempted At', type: 'date' },
    { key: 'ipAddress', label: 'Ip Address', type: 'string' },
    { key: 'userAgent', label: 'User Agent', type: 'string' },
    { key: 'deviceInfo', label: 'Device Info', type: 'string' },
    { key: 'loginStatus', label: 'Login Status', type: 'string' },
    { key: 'failedReason', label: 'Failed Reason', type: 'string' },
    { key: 'locationCity', label: 'Location City', type: 'string' },
    { key: 'locationCountry', label: 'Location Country', type: 'string' },
    { key: 'sessionId', label: 'Session Id', type: 'number' },
    { key: 'isSuspicious', label: 'Is Suspicious', type: 'boolean' }
  ];
  private readonly excelSheetName = 'login_attempts';

  @Public()
  @Get('template')
  @ApiOperation({ summary: 'Download blank Excel template' })
  async downloadTemplate(@Res() res: any) {
    const buf = await this.excelService.buildTemplate(this.excelSheetName, this.excelColumns);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="login_attempts_template.xlsx"`);
    res.send(buf);
  }

  @Get('export')
  @ApiOperation({ summary: 'Export current data as Excel' })
  async exportExcel(
    @CurrentTenant() tenantId: number,
    @Query() query: any,
    @Res() res: any,
  ) {
    const result: any = await this.service.findAll(tenantId, { ...query, size: 10000 });
    const rows = Array.isArray(result) ? result : (result?.data ?? result?.rows ?? []);
    const buf = await this.excelService.buildExport(this.excelSheetName, this.excelColumns, rows);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="login_attempts_${Date.now()}.xlsx"`);
    res.send(buf);
  }

}
