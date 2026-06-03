import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards, Res, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Public } from '../../../common/decorators/public.decorator';
import { ExcelService, ColumnDef  } from '../../../common/services/excel.service';
import { SecurityEventsService } from './security-events.service';
import { CreateSecurityEventsSchema, CreateSecurityEventsDto } from './dto/create-security-events.dto';
import { UpdateSecurityEventsSchema, UpdateSecurityEventsDto } from './dto/update-security-events.dto';
import { FilterSecurityEventsSchema, FilterSecurityEventsDto } from './dto/filter-security-events.dto';
import { ZodValidationPipe } from '../../../common/pipes/zod-validation.pipe';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { TenantGuard } from '../../../common/guards/tenant.guard';
import { CurrentTenant } from '../../../common/decorators/tenant.decorator';
import { CurrentUser } from '../../../common/decorators/user.decorator';

@UseGuards(JwtAuthGuard, TenantGuard)
@ApiTags('iam/security-events')
@ApiBearerAuth()
@Controller('iam/security-events')
export class SecurityEventsController {
  constructor(private readonly service: SecurityEventsService,
    private readonly excelService: ExcelService) {}

  @Post()
  create(
    @CurrentTenant() tenantId: number,
    @CurrentUser('id') userId: number,
    @Body(new ZodValidationPipe(CreateSecurityEventsSchema)) dto: CreateSecurityEventsDto,
  ) {
    return this.service.create(tenantId, userId, dto);
  }

  @Get()
  findAll(
    @CurrentTenant() tenantId: number,
    @Query(new ZodValidationPipe(FilterSecurityEventsSchema)) query: FilterSecurityEventsDto,
  ) {
    return this.service.findAll(tenantId, query);
  }

  @Get(':id(\\d+)')
  findOne(@CurrentTenant() tenantId: number, @Param('id') id: string) {
    return this.service.findOne(tenantId, id);
  }

  // ───────── Excel import / export ─────────
  private readonly excelColumns: ColumnDef[] = [
    { key: 'userId', label: 'User Id', type: 'number' },
    { key: 'eventType', label: 'Event Type', type: 'string' },
    { key: 'severity', label: 'Severity', type: 'string' },
    { key: 'description', label: 'Description', type: 'string' },
    { key: 'ipAddress', label: 'Ip Address', type: 'string' },
    { key: 'userAgent', label: 'User Agent', type: 'string' },
    { key: 'locationCity', label: 'Location City', type: 'string' },
    { key: 'locationCountry', label: 'Location Country', type: 'string' },
    { key: 'triggeredBy', label: 'Triggered By', type: 'number' },
    { key: 'relatedLoginAttemptId', label: 'Related Login Attempt Id', type: 'number' },
    { key: 'eventAt', label: 'Event At', type: 'date' },
    { key: 'resolvedAt', label: 'Resolved At', type: 'date' },
    { key: 'resolvedBy', label: 'Resolved By', type: 'number' },
    { key: 'resolutionNotes', label: 'Resolution Notes', type: 'string' },
    { key: 'metadata', label: 'Metadata', type: 'string' }
  ];
  private readonly excelSheetName = 'security_events';

  @Public()
  @Get('template')
  @ApiOperation({ summary: 'Download blank Excel template' })
  async downloadTemplate(@Res() res: any) {
    const buf = await this.excelService.buildTemplate(this.excelSheetName, this.excelColumns);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="security_events_template.xlsx"`);
    res.send(buf);
  }

  @Get('export')
  @ApiOperation({ summary: 'Export current data as Excel' })
  async exportExcel(
    @CurrentTenant() tenantId: number,
    @Query() query: any,
    @Res() res: any,
  ) {
    const result: any = await this.service.findAll(tenantId, this.excelService.normalizeExportQuery(query));
    const rows = Array.isArray(result) ? result : (result?.data ?? result?.rows ?? []);
    const buf = await this.excelService.buildExport(this.excelSheetName, this.excelColumns, rows);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="security_events_${Date.now()}.xlsx"`);
    res.send(buf);
  }

}
