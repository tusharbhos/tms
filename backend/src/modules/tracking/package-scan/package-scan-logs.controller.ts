import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards, Res, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Public } from '../../../common/decorators/public.decorator';
import { ExcelService, ColumnDef  } from '../../../common/services/excel.service';
import { PackageScanLogsService } from './package-scan-logs.service';
import { CreatePackageScanLogsSchema, CreatePackageScanLogsDto } from './dto/create-package-scan-logs.dto';
import { UpdatePackageScanLogsSchema, UpdatePackageScanLogsDto } from './dto/update-package-scan-logs.dto';
import { FilterPackageScanLogsSchema, FilterPackageScanLogsDto } from './dto/filter-package-scan-logs.dto';
import { ZodValidationPipe } from '../../../common/pipes/zod-validation.pipe';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { TenantGuard } from '../../../common/guards/tenant.guard';
import { CurrentTenant } from '../../../common/decorators/tenant.decorator';
import { CurrentUser } from '../../../common/decorators/user.decorator';

@UseGuards(JwtAuthGuard, TenantGuard)
@ApiTags('tracking/package-scan')
@ApiBearerAuth()
@Controller('tracking/package-scan')
export class PackageScanLogsController {
  constructor(private readonly service: PackageScanLogsService,
    private readonly excelService: ExcelService) {}

  @Post()
  create(
    @CurrentTenant() tenantId: number,
    @CurrentUser('id') userId: number,
    @Body(new ZodValidationPipe(CreatePackageScanLogsSchema)) dto: CreatePackageScanLogsDto,
  ) {
    return this.service.create(tenantId, userId, dto);
  }

  @Get()
  findAll(
    @CurrentTenant() tenantId: number,
    @Query(new ZodValidationPipe(FilterPackageScanLogsSchema)) query: FilterPackageScanLogsDto,
  ) {
    return this.service.findAll(tenantId, query);
  }

  @Get(':id')
  findOne(@CurrentTenant() tenantId: number, @Param('id') id: string) {
    return this.service.findOne(tenantId, id);
  }

  // ───────── Excel import / export ─────────
  private readonly excelColumns: ColumnDef[] = [
    { key: 'barcodeNo', label: 'Barcode No', type: 'string' },
    { key: 'lrId', label: 'Lr Id', type: 'number' },
    { key: 'bookingId', label: 'Booking Id', type: 'number' },
    { key: 'bookingItemId', label: 'Booking Item Id', type: 'number' },
    { key: 'scanStage', label: 'Scan Stage', type: 'string' },
    { key: 'scanResult', label: 'Scan Result', type: 'string' },
    { key: 'officeId', label: 'Office Id', type: 'number' },
    { key: 'tripId', label: 'Trip Id', type: 'number' },
    { key: 'scannedBy', label: 'Scanned By', type: 'number' },
    { key: 'scanDeviceId', label: 'Scan Device Id', type: 'string' },
    { key: 'latitude', label: 'Latitude', type: 'number' },
    { key: 'longitude', label: 'Longitude', type: 'number' },
    { key: 'scannedAt', label: 'Scanned At', type: 'date' },
    { key: 'photoUrl', label: 'Photo Url', type: 'string' },
    { key: 'remarks', label: 'Remarks', type: 'string' }
  ];
  private readonly excelSheetName = 'txn_package_scan_logs';

  @Public()
  @Get('template')
  @ApiOperation({ summary: 'Download blank Excel template' })
  async downloadTemplate(@Res() res: any) {
    const buf = await this.excelService.buildTemplate(this.excelSheetName, this.excelColumns);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="txn_package_scan_logs_template.xlsx"`);
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
    res.setHeader('Content-Disposition', `attachment; filename="txn_package_scan_logs_${Date.now()}.xlsx"`);
    res.send(buf);
  }

}
