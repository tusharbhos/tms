import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards, Res, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Public } from '../../../common/decorators/public.decorator';
import { ExcelService, ColumnDef  } from '../../../common/services/excel.service';
import { TrackingEventsService } from './tracking-events.service';
import { CreateTrackingEventsSchema, CreateTrackingEventsDto } from './dto/create-tracking-events.dto';
import { UpdateTrackingEventsSchema, UpdateTrackingEventsDto } from './dto/update-tracking-events.dto';
import { FilterTrackingEventsSchema, FilterTrackingEventsDto } from './dto/filter-tracking-events.dto';
import { ZodValidationPipe } from '../../../common/pipes/zod-validation.pipe';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { TenantGuard } from '../../../common/guards/tenant.guard';
import { CurrentTenant } from '../../../common/decorators/tenant.decorator';
import { CurrentUser } from '../../../common/decorators/user.decorator';

@UseGuards(JwtAuthGuard, TenantGuard)
@ApiTags('tracking/tracking-events')
@ApiBearerAuth()
@Controller('tracking/tracking-events')
export class TrackingEventsController {
  constructor(private readonly service: TrackingEventsService,
    private readonly excelService: ExcelService) {}

  @Post()
  create(
    @CurrentTenant() tenantId: number,
    @CurrentUser('id') userId: number,
    @Body(new ZodValidationPipe(CreateTrackingEventsSchema)) dto: CreateTrackingEventsDto,
  ) {
    return this.service.create(tenantId, userId, dto);
  }

  @Get()
  findAll(
    @CurrentTenant() tenantId: number,
    @Query(new ZodValidationPipe(FilterTrackingEventsSchema)) query: FilterTrackingEventsDto,
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
    { key: 'tripId', label: 'Trip Id', type: 'number' },
    { key: 'manifestId', label: 'Manifest Id', type: 'number' },
    { key: 'statusCode', label: 'Status Code', type: 'string' },
    { key: 'statusLabel', label: 'Status Label', type: 'string' },
    { key: 'eventType', label: 'Event Type', type: 'string' },
    { key: 'eventSource', label: 'Event Source', type: 'string' },
    { key: 'visibilityToCustomer', label: 'Visibility To Customer', type: 'boolean' },
    { key: 'officeId', label: 'Office Id', type: 'number' },
    { key: 'officeName', label: 'Office Name', type: 'string' },
    { key: 'latitude', label: 'Latitude', type: 'number' },
    { key: 'longitude', label: 'Longitude', type: 'number' },
    { key: 'eventTime', label: 'Event Time', type: 'date' },
    { key: 'remarks', label: 'Remarks', type: 'string' },
    { key: 'deviceId', label: 'Device Id', type: 'string' },
    { key: 'trackingAccuracy', label: 'Tracking Accuracy', type: 'number' },
    { key: 'batteryPercentage', label: 'Battery Percentage', type: 'number' }
  ];
  private readonly excelSheetName = 'txn_tracking_events';

  @Public()
  @Get('template')
  @ApiOperation({ summary: 'Download blank Excel template' })
  async downloadTemplate(@Res() res: any) {
    const buf = await this.excelService.buildTemplate(this.excelSheetName, this.excelColumns);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="txn_tracking_events_template.xlsx"`);
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
    res.setHeader('Content-Disposition', `attachment; filename="txn_tracking_events_${Date.now()}.xlsx"`);
    res.send(buf);
  }

}
