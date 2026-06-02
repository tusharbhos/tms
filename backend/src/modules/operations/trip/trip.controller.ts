import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards, Res, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Public } from '../../../common/decorators/public.decorator';
import { ExcelService, ColumnDef  } from '../../../common/services/excel.service';
import { TripService } from './trip.service';
import { CreateTripSchema, CreateTripDto } from './dto/create-trip.dto';
import { UpdateTripSchema, UpdateTripDto } from './dto/update-trip.dto';
import { FilterTripSchema, FilterTripDto } from './dto/filter-trip.dto';
import { ZodValidationPipe } from '../../../common/pipes/zod-validation.pipe';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { TenantGuard } from '../../../common/guards/tenant.guard';
import { CurrentTenant } from '../../../common/decorators/tenant.decorator';
import { CurrentUser } from '../../../common/decorators/user.decorator';

@UseGuards(JwtAuthGuard, TenantGuard)
@ApiTags('operations/trip')
@ApiBearerAuth()
@Controller('operations/trip')
export class TripController {
  constructor(private readonly service: TripService,
    private readonly excelService: ExcelService) {}

  @Post()
  create(
    @CurrentTenant() tenantId: number,
    @CurrentUser('id') userId: number,
    @Body(new ZodValidationPipe(CreateTripSchema)) dto: CreateTripDto,
  ) {
    return this.service.create(tenantId, userId, dto);
  }

  @Get()
  findAll(
    @CurrentTenant() tenantId: number,
    @Query(new ZodValidationPipe(FilterTripSchema)) query: FilterTripDto,
  ) {
    return this.service.findAll(tenantId, query);
  }

  @Get(':id')
  findOne(@CurrentTenant() tenantId: number, @Param('id') id: string) {
    return this.service.findOne(tenantId, id);
  }

  @Patch(':id')
  update(
    @CurrentTenant() tenantId: number,
    @CurrentUser('id') userId: number,
    @Param('id') id: string,
    @Body(new ZodValidationPipe(UpdateTripSchema)) dto: UpdateTripDto,
  ) {
    return this.service.update(tenantId, userId, id, dto);
  }

  @Delete(':id')
  remove(
    @CurrentTenant() tenantId: number,
    @CurrentUser('id') userId: number,
    @Param('id') id: string,
  ) {
    return this.service.remove(tenantId, userId, id);
  }

  // ── State-machine transition endpoint ──
  @Post(':id/transition')
  transition(
    @CurrentTenant() tenantId: number,
    @CurrentUser('id') userId: number,
    @Param('id') id: string,
    @Body() body: { to: string; reasonId?: number; notes?: string },
  ) {
    return this.service.transition(tenantId, userId, id, body.to, body.reasonId, body.notes);
  }

  // ───────── Excel import / export ─────────
  private readonly excelColumns: ColumnDef[] = [
    { key: 'tripNo', label: 'Trip No', type: 'string' },
    { key: 'tripType', label: 'Trip Type', type: 'string' },
    { key: 'manifestId', label: 'Manifest Id', type: 'number' },
    { key: 'drsId', label: 'Drs Id', type: 'number' },
    { key: 'originOfficeId', label: 'Origin Office Id', type: 'number' },
    { key: 'destinationOfficeId', label: 'Destination Office Id', type: 'number' },
    { key: 'vendorId', label: 'Vendor Id', type: 'number' },
    { key: 'vehicleId', label: 'Vehicle Id', type: 'number' },
    { key: 'vehicleNo', label: 'Vehicle No', type: 'string' },
    { key: 'driverId', label: 'Driver Id', type: 'number' },
    { key: 'driverName', label: 'Driver Name', type: 'string' },
    { key: 'driverMobile', label: 'Driver Mobile', type: 'string' },
    { key: 'numLrs', label: 'Num Lrs', type: 'number' },
    { key: 'totalPackages', label: 'Total Packages', type: 'number' },
    { key: 'tripDate', label: 'Trip Date', type: 'date' },
    { key: 'tripStatus', label: 'Trip Status', type: 'string' },
    { key: 'startTime', label: 'Start Time', type: 'date' },
    { key: 'endTime', label: 'End Time', type: 'date' },
    { key: 'estimatedKm', label: 'Estimated Km', type: 'number' },
    { key: 'actualKm', label: 'Actual Km', type: 'number' },
    { key: 'meterStart', label: 'Meter Start', type: 'number' },
    { key: 'meterEnd', label: 'Meter End', type: 'number' },
    { key: 'freightCharges', label: 'Freight Charges', type: 'number' },
    { key: 'advancePaid', label: 'Advance Paid', type: 'number' },
    { key: 'fuelFilledLiters', label: 'Fuel Filled Liters', type: 'number' },
    { key: 'gpsDeviceId', label: 'Gps Device Id', type: 'string' },
    { key: 'consolidatedEwbNo', label: 'Consolidated Ewb No', type: 'string' },
    { key: 'cancelReasonId', label: 'Cancel Reason Id', type: 'number' },
    { key: 'remarks', label: 'Remarks', type: 'string' },
    { key: 'routeId', label: 'Route Id', type: 'number' },
    { key: 'plannedStartTime', label: 'Planned Start Time', type: 'date' },
    { key: 'plannedEndTime', label: 'Planned End Time', type: 'date' },
    { key: 'actualStartTime', label: 'Actual Start Time', type: 'date' },
    { key: 'actualEndTime', label: 'Actual End Time', type: 'date' },
    { key: 'delayReasonId', label: 'Delay Reason Id', type: 'number' }
  ];
  private readonly excelSheetName = 'txn_trip';

  @Public()
  @Get('template')
  @ApiOperation({ summary: 'Download blank Excel template' })
  async downloadTemplate(@Res() res: any) {
    const buf = await this.excelService.buildTemplate(this.excelSheetName, this.excelColumns);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="txn_trip_template.xlsx"`);
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
    res.setHeader('Content-Disposition', `attachment; filename="txn_trip_${Date.now()}.xlsx"`);
    res.send(buf);
  }

  @Post('import')
  @ApiOperation({ summary: 'Bulk-import rows from Excel' })
  @UseInterceptors(FileInterceptor('file'))
  async importExcel(
    @CurrentTenant() tenantId: number,
    @CurrentUser('sub') userId: number,
    @UploadedFile() file: any,
  ) {
    if (!file) throw new BadRequestException('Upload an .xlsx file as "file"');
    const parsed = await this.excelService.parseImport(file.buffer, this.excelColumns);
    if (!parsed.ok) return { ok: false, errors: parsed.errors, imported: 0 };
    let imported = 0;
    const errors: any[] = [];
    for (let i = 0; i < parsed.rows.length; i++) {
      try {
        await this.service.create(tenantId, userId, parsed.rows[i] as any);
        imported++;
      } catch (e: any) {
        errors.push({ row: i + 2, message: e.message });
      }
    }
    return { ok: errors.length === 0, imported, total: parsed.rows.length, errors };
  }
}
