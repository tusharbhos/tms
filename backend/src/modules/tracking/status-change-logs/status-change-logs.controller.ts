import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards, Res, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Public } from '../../../common/decorators/public.decorator';
import { ExcelService, ColumnDef  } from '../../../common/services/excel.service';
import { StatusChangeLogsService } from './status-change-logs.service';
import { CreateStatusChangeLogsSchema, CreateStatusChangeLogsDto } from './dto/create-status-change-logs.dto';
import { UpdateStatusChangeLogsSchema, UpdateStatusChangeLogsDto } from './dto/update-status-change-logs.dto';
import { FilterStatusChangeLogsSchema, FilterStatusChangeLogsDto } from './dto/filter-status-change-logs.dto';
import { ZodValidationPipe } from '../../../common/pipes/zod-validation.pipe';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { TenantGuard } from '../../../common/guards/tenant.guard';
import { CurrentTenant } from '../../../common/decorators/tenant.decorator';
import { CurrentUser } from '../../../common/decorators/user.decorator';

@UseGuards(JwtAuthGuard, TenantGuard)
@ApiTags('tracking/status-change-logs')
@ApiBearerAuth()
@Controller('tracking/status-change-logs')
export class StatusChangeLogsController {
  constructor(private readonly service: StatusChangeLogsService,
    private readonly excelService: ExcelService) {}

  @Post()
  create(
    @CurrentTenant() tenantId: number,
    @CurrentUser('id') userId: number,
    @Body(new ZodValidationPipe(CreateStatusChangeLogsSchema)) dto: CreateStatusChangeLogsDto,
  ) {
    return this.service.create(tenantId, userId, dto);
  }

  @Get()
  findAll(
    @CurrentTenant() tenantId: number,
    @Query(new ZodValidationPipe(FilterStatusChangeLogsSchema)) query: FilterStatusChangeLogsDto,
  ) {
    return this.service.findAll(tenantId, query);
  }

  @Get(':id(\\d+)')
  findOne(@CurrentTenant() tenantId: number, @Param('id') id: string) {
    return this.service.findOne(tenantId, id);
  }

  // ───────── Excel import / export ─────────
  private readonly excelColumns: ColumnDef[] = [
    { key: 'entityType', label: 'Entity Type', type: 'string' },
    { key: 'entityId', label: 'Entity Id', type: 'number' },
    { key: 'entityCode', label: 'Entity Code', type: 'string' },
    { key: 'oldStatus', label: 'Old Status', type: 'string' },
    { key: 'newStatus', label: 'New Status', type: 'string' },
    { key: 'changedBy', label: 'Changed By', type: 'number' },
    { key: 'changedAt', label: 'Changed At', type: 'date' },
    { key: 'remarks', label: 'Remarks', type: 'string' },
    { key: 'systemGenerated', label: 'System Generated', type: 'boolean' },
    { key: 'triggerSource', label: 'Trigger Source', type: 'string' },
    { key: 'triggerRefId', label: 'Trigger Ref Id', type: 'number' }
  ];
  private readonly excelSheetName = 'txn_status_change_logs';

  @Public()
  @Get('template')
  @ApiOperation({ summary: 'Download blank Excel template' })
  async downloadTemplate(@Res() res: any) {
    const buf = await this.excelService.buildTemplate(this.excelSheetName, this.excelColumns);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="txn_status_change_logs_template.xlsx"`);
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
    res.setHeader('Content-Disposition', `attachment; filename="txn_status_change_logs_${Date.now()}.xlsx"`);
    res.send(buf);
  }

}
