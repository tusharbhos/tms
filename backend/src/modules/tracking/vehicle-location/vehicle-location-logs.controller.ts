import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards, Res, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Public } from '../../../common/decorators/public.decorator';
import { ExcelService, ColumnDef  } from '../../../common/services/excel.service';
import { VehicleLocationLogsService } from './vehicle-location-logs.service';
import { CreateVehicleLocationLogsSchema, CreateVehicleLocationLogsDto } from './dto/create-vehicle-location-logs.dto';
import { UpdateVehicleLocationLogsSchema, UpdateVehicleLocationLogsDto } from './dto/update-vehicle-location-logs.dto';
import { FilterVehicleLocationLogsSchema, FilterVehicleLocationLogsDto } from './dto/filter-vehicle-location-logs.dto';
import { ZodValidationPipe } from '../../../common/pipes/zod-validation.pipe';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { TenantGuard } from '../../../common/guards/tenant.guard';
import { CurrentTenant } from '../../../common/decorators/tenant.decorator';
import { CurrentUser } from '../../../common/decorators/user.decorator';

@UseGuards(JwtAuthGuard, TenantGuard)
@ApiTags('tracking/vehicle-location')
@ApiBearerAuth()
@Controller('tracking/vehicle-location')
export class VehicleLocationLogsController {
  constructor(private readonly service: VehicleLocationLogsService,
    private readonly excelService: ExcelService) {}

  @Post()
  create(
    @CurrentTenant() tenantId: number,
    @CurrentUser('id') userId: number,
    @Body(new ZodValidationPipe(CreateVehicleLocationLogsSchema)) dto: CreateVehicleLocationLogsDto,
  ) {
    return this.service.create(tenantId, userId, dto);
  }

  @Get()
  findAll(
    @CurrentTenant() tenantId: number,
    @Query(new ZodValidationPipe(FilterVehicleLocationLogsSchema)) query: FilterVehicleLocationLogsDto,
  ) {
    return this.service.findAll(tenantId, query);
  }

  @Get(':id(\\d+)')
  findOne(@CurrentTenant() tenantId: number, @Param('id') id: string) {
    return this.service.findOne(tenantId, id);
  }

  // ───────── Excel import / export ─────────
  private readonly excelColumns: ColumnDef[] = [
    { key: 'tripId', label: 'Trip Id', type: 'number' },
    { key: 'vehicleId', label: 'Vehicle Id', type: 'number' },
    { key: 'driverId', label: 'Driver Id', type: 'number' },
    { key: 'latitude', label: 'Latitude', type: 'number' },
    { key: 'longitude', label: 'Longitude', type: 'number' },
    { key: 'speedKmph', label: 'Speed Kmph', type: 'number' },
    { key: 'headingDeg', label: 'Heading Deg', type: 'number' },
    { key: 'accuracyM', label: 'Accuracy M', type: 'number' },
    { key: 'source', label: 'Source', type: 'string' },
    { key: 'loggedAt', label: 'Logged At', type: 'date' }
  ];
  private readonly excelSheetName = 'txn_vehicle_location_logs';

  @Public()
  @Get('template')
  @ApiOperation({ summary: 'Download blank Excel template' })
  async downloadTemplate(@Res() res: any) {
    const buf = await this.excelService.buildTemplate(this.excelSheetName, this.excelColumns);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="txn_vehicle_location_logs_template.xlsx"`);
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
    res.setHeader('Content-Disposition', `attachment; filename="txn_vehicle_location_logs_${Date.now()}.xlsx"`);
    res.send(buf);
  }

}
