import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards, Res, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Public } from '../../../common/decorators/public.decorator';
import { ExcelService, ColumnDef  } from '../../../common/services/excel.service';
import { ApprovalActionLogsService } from './approval-action-logs.service';
import { CreateApprovalActionLogsSchema, CreateApprovalActionLogsDto } from './dto/create-approval-action-logs.dto';
import { UpdateApprovalActionLogsSchema, UpdateApprovalActionLogsDto } from './dto/update-approval-action-logs.dto';
import { FilterApprovalActionLogsSchema, FilterApprovalActionLogsDto } from './dto/filter-approval-action-logs.dto';
import { ZodValidationPipe } from '../../../common/pipes/zod-validation.pipe';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { TenantGuard } from '../../../common/guards/tenant.guard';
import { CurrentTenant } from '../../../common/decorators/tenant.decorator';
import { CurrentUser } from '../../../common/decorators/user.decorator';

@UseGuards(JwtAuthGuard, TenantGuard)
@ApiTags('audit/approval-action-logs')
@ApiBearerAuth()
@Controller('audit/approval-action-logs')
export class ApprovalActionLogsController {
  constructor(private readonly service: ApprovalActionLogsService,
    private readonly excelService: ExcelService) {}

  @Post()
  create(
    @CurrentTenant() tenantId: number,
    @CurrentUser('id') userId: number,
    @Body(new ZodValidationPipe(CreateApprovalActionLogsSchema)) dto: CreateApprovalActionLogsDto,
  ) {
    return this.service.create(tenantId, userId, dto);
  }

  @Get()
  findAll(
    @CurrentTenant() tenantId: number,
    @Query(new ZodValidationPipe(FilterApprovalActionLogsSchema)) query: FilterApprovalActionLogsDto,
  ) {
    return this.service.findAll(tenantId, query);
  }

  @Get(':id(\\d+)')
  findOne(@CurrentTenant() tenantId: number, @Param('id') id: string) {
    return this.service.findOne(tenantId, id);
  }

  // ───────── Excel import / export ─────────
  private readonly excelColumns: ColumnDef[] = [
    { key: 'requestId', label: 'Request Id', type: 'number' },
    { key: 'stepId', label: 'Step Id', type: 'number' },
    { key: 'actionBy', label: 'Action By', type: 'number' },
    { key: 'action', label: 'Action', type: 'string' },
    { key: 'actionAt', label: 'Action At', type: 'date' },
    { key: 'remarks', label: 'Remarks', type: 'string' },
    { key: 'previousStatus', label: 'Previous Status', type: 'string' },
    { key: 'newStatus', label: 'New Status', type: 'string' },
    { key: 'ipAddress', label: 'Ip Address', type: 'string' },
    { key: 'deviceInfo', label: 'Device Info', type: 'string' }
  ];
  private readonly excelSheetName = 'approval_action_logs';

  @Public()
  @Get('template')
  @ApiOperation({ summary: 'Download blank Excel template' })
  async downloadTemplate(@Res() res: any) {
    const buf = await this.excelService.buildTemplate(this.excelSheetName, this.excelColumns);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="approval_action_logs_template.xlsx"`);
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
    res.setHeader('Content-Disposition', `attachment; filename="approval_action_logs_${Date.now()}.xlsx"`);
    res.send(buf);
  }

}
