import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards, Res, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Public } from '../../../common/decorators/public.decorator';
import { ExcelService, ColumnDef  } from '../../../common/services/excel.service';
import { ActivityLogsService } from './activity-logs.service';
import { CreateActivityLogsSchema, CreateActivityLogsDto } from './dto/create-activity-logs.dto';
import { UpdateActivityLogsSchema, UpdateActivityLogsDto } from './dto/update-activity-logs.dto';
import { FilterActivityLogsSchema, FilterActivityLogsDto } from './dto/filter-activity-logs.dto';
import { ZodValidationPipe } from '../../../common/pipes/zod-validation.pipe';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { TenantGuard } from '../../../common/guards/tenant.guard';
import { CurrentTenant } from '../../../common/decorators/tenant.decorator';
import { CurrentUser } from '../../../common/decorators/user.decorator';

@UseGuards(JwtAuthGuard, TenantGuard)
@ApiTags('audit/activity-logs')
@ApiBearerAuth()
@Controller('audit/activity-logs')
export class ActivityLogsController {
  constructor(private readonly service: ActivityLogsService,
    private readonly excelService: ExcelService) {}

  @Post()
  create(
    @CurrentTenant() tenantId: number,
    @CurrentUser('id') userId: number,
    @Body(new ZodValidationPipe(CreateActivityLogsSchema)) dto: CreateActivityLogsDto,
  ) {
    return this.service.create(tenantId, userId, dto);
  }

  @Get()
  findAll(
    @CurrentTenant() tenantId: number,
    @Query(new ZodValidationPipe(FilterActivityLogsSchema)) query: FilterActivityLogsDto,
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
    { key: 'action', label: 'Action', type: 'string' },
    { key: 'tableName', label: 'Table Name', type: 'string' },
    { key: 'recordId', label: 'Record Id', type: 'number' },
    { key: 'oldValuesJson', label: 'Old Values Json', type: 'string' },
    { key: 'newValuesJson', label: 'New Values Json', type: 'string' },
    { key: 'ipAddress', label: 'Ip Address', type: 'string' },
    { key: 'deviceInfo', label: 'Device Info', type: 'string' },
    { key: 'browserInfo', label: 'Browser Info', type: 'string' },
    { key: 'sessionId', label: 'Session Id', type: 'string' }
  ];
  private readonly excelSheetName = 'activity_logs';

  @Public()
  @Get('template')
  @ApiOperation({ summary: 'Download blank Excel template' })
  async downloadTemplate(@Res() res: any) {
    const buf = await this.excelService.buildTemplate(this.excelSheetName, this.excelColumns);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="activity_logs_template.xlsx"`);
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
    res.setHeader('Content-Disposition', `attachment; filename="activity_logs_${Date.now()}.xlsx"`);
    res.send(buf);
  }

}
