import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards, Res, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Public } from '../../../common/decorators/public.decorator';
import { ExcelService, ColumnDef  } from '../../../common/services/excel.service';
import { LrStateLogService } from './lr-state-log.service';
import { CreateLrStateLogSchema, CreateLrStateLogDto } from './dto/create-lr-state-log.dto';
import { UpdateLrStateLogSchema, UpdateLrStateLogDto } from './dto/update-lr-state-log.dto';
import { FilterLrStateLogSchema, FilterLrStateLogDto } from './dto/filter-lr-state-log.dto';
import { ZodValidationPipe } from '../../../common/pipes/zod-validation.pipe';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { TenantGuard } from '../../../common/guards/tenant.guard';
import { CurrentTenant } from '../../../common/decorators/tenant.decorator';
import { CurrentUser } from '../../../common/decorators/user.decorator';

@UseGuards(JwtAuthGuard, TenantGuard)
@ApiTags('operations/lr-state-log')
@ApiBearerAuth()
@Controller('operations/lr-state-log')
export class LrStateLogController {
  constructor(private readonly service: LrStateLogService,
    private readonly excelService: ExcelService) {}

  @Post()
  create(
    @CurrentTenant() tenantId: number,
    @CurrentUser('id') userId: number,
    @Body(new ZodValidationPipe(CreateLrStateLogSchema)) dto: CreateLrStateLogDto,
  ) {
    return this.service.create(tenantId, userId, dto);
  }

  @Get()
  findAll(
    @CurrentTenant() tenantId: number,
    @Query(new ZodValidationPipe(FilterLrStateLogSchema)) query: FilterLrStateLogDto,
  ) {
    return this.service.findAll(tenantId, query);
  }

  @Get(':id(\\d+)')
  findOne(@CurrentTenant() tenantId: number, @Param('id') id: string) {
    return this.service.findOne(tenantId, id);
  }

  // ───────── Excel import / export ─────────
  private readonly excelColumns: ColumnDef[] = [
    { key: 'lrId', label: 'Lr Id', type: 'number' },
    { key: 'fromStatus', label: 'From Status', type: 'string' },
    { key: 'toStatus', label: 'To Status', type: 'string' },
    { key: 'changedBy', label: 'Changed By', type: 'number' },
    { key: 'changedAt', label: 'Changed At', type: 'date' },
    { key: 'remarks', label: 'Remarks', type: 'string' },
    { key: 'triggerEntity', label: 'Trigger Entity', type: 'string' },
    { key: 'triggerId', label: 'Trigger Id', type: 'number' }
  ];
  private readonly excelSheetName = 'txn_lr_state_log';

  @Public()
  @Get('template')
  @ApiOperation({ summary: 'Download blank Excel template' })
  async downloadTemplate(@Res() res: any) {
    const buf = await this.excelService.buildTemplate(this.excelSheetName, this.excelColumns);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="txn_lr_state_log_template.xlsx"`);
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
    res.setHeader('Content-Disposition', `attachment; filename="txn_lr_state_log_${Date.now()}.xlsx"`);
    res.send(buf);
  }

}
