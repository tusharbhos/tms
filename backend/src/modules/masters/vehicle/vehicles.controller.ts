import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards, Res, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Public } from '../../../common/decorators/public.decorator';
import { ExcelService, ColumnDef  } from '../../../common/services/excel.service';
import { VehiclesService } from './vehicles.service';
import { CreateVehiclesSchema, CreateVehiclesDto } from './dto/create-vehicles.dto';
import { UpdateVehiclesSchema, UpdateVehiclesDto } from './dto/update-vehicles.dto';
import { FilterVehiclesSchema, FilterVehiclesDto } from './dto/filter-vehicles.dto';
import { ZodValidationPipe } from '../../../common/pipes/zod-validation.pipe';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { TenantGuard } from '../../../common/guards/tenant.guard';
import { CurrentTenant } from '../../../common/decorators/tenant.decorator';
import { CurrentUser } from '../../../common/decorators/user.decorator';

@UseGuards(JwtAuthGuard, TenantGuard)
@ApiTags('masters/vehicle')
@ApiBearerAuth()
@Controller('masters/vehicle')
export class VehiclesController {
  constructor(private readonly service: VehiclesService,
    private readonly excelService: ExcelService) {}

  @Post()
  create(
    @CurrentTenant() tenantId: number,
    @CurrentUser('id') userId: number,
    @Body(new ZodValidationPipe(CreateVehiclesSchema)) dto: CreateVehiclesDto,
  ) {
    return this.service.create(tenantId, userId, dto);
  }

  @Get()
  findAll(
    @CurrentTenant() tenantId: number,
    @Query(new ZodValidationPipe(FilterVehiclesSchema)) query: FilterVehiclesDto,
  ) {
    return this.service.findAll(tenantId, query);
  }

  @Get(':id(\\d+)')
  findOne(@CurrentTenant() tenantId: number, @Param('id') id: string) {
    return this.service.findOne(tenantId, id);
  }

  @Patch(':id(\\d+)')
  update(
    @CurrentTenant() tenantId: number,
    @CurrentUser('id') userId: number,
    @Param('id') id: string,
    @Body(new ZodValidationPipe(UpdateVehiclesSchema)) dto: UpdateVehiclesDto,
  ) {
    return this.service.update(tenantId, userId, id, dto);
  }

  @Delete(':id(\\d+)')
  remove(
    @CurrentTenant() tenantId: number,
    @CurrentUser('id') userId: number,
    @Param('id') id: string,
  ) {
    return this.service.remove(tenantId, userId, id);
  }

  // ───────── Excel import / export ─────────
  private readonly excelColumns: ColumnDef[] = [
    { key: 'companyTag', label: 'Company Tag', type: 'number' },
    { key: 'baseOfficeId', label: 'Base Office Id', type: 'number' },
    { key: 'vendorId', label: 'Vendor Id', type: 'number' },
    { key: 'rcNum', label: 'Rc Num', type: 'string' },
    { key: 'vehicleNum', label: 'Vehicle Num', type: 'string' },
    { key: 'vehicleOwnership', label: 'Vehicle Ownership', type: 'string' },
    { key: 'ownerType', label: 'Owner Type', type: 'string' },
    { key: 'bodyType', label: 'Body Type', type: 'string' },
    { key: 'make', label: 'Make', type: 'string' },
    { key: 'model', label: 'Model', type: 'string' },
    { key: 'specification', label: 'Specification', type: 'string' },
    { key: 'subSpecification', label: 'Sub Specification', type: 'string' },
    { key: 'fuelType', label: 'Fuel Type', type: 'string' },
    { key: 'gvw', label: 'Gvw', type: 'number' },
    { key: 'capacity', label: 'Capacity', type: 'number' },
    { key: 'gvwCapacityUnit', label: 'Gvw Capacity Unit', type: 'string' },
    { key: 'length', label: 'Length', type: 'number' },
    { key: 'width', label: 'Width', type: 'number' },
    { key: 'height', label: 'Height', type: 'number' },
    { key: 'lwhUnit', label: 'Lwh Unit', type: 'string' },
    { key: 'vehicleContactMobile1', label: 'Vehicle Contact Mobile1', type: 'string' },
    { key: 'vehicleContactMobile2', label: 'Vehicle Contact Mobile2', type: 'string' },
    { key: 'rtoRegExpiry', label: 'Rto Reg Expiry', type: 'date' },
    { key: 'rcUrl', label: 'Rc Url', type: 'string' },
    { key: 'insurancePolicyNum', label: 'Insurance Policy Num', type: 'string' },
    { key: 'insuranceExpiry', label: 'Insurance Expiry', type: 'date' },
    { key: 'insuranceDocUrl', label: 'Insurance Doc Url', type: 'string' },
    { key: 'fitnessCertNum', label: 'Fitness Cert Num', type: 'string' },
    { key: 'fitnessCertExpiry', label: 'Fitness Cert Expiry', type: 'date' },
    { key: 'fitnessCertUrl', label: 'Fitness Cert Url', type: 'string' },
    { key: 'permitExpiry', label: 'Permit Expiry', type: 'date' },
    { key: 'pollutionExpiry', label: 'Pollution Expiry', type: 'date' },
    { key: 'gpsDeviceId', label: 'Gps Device Id', type: 'string' },
    { key: 'manufacturingYear', label: 'Manufacturing Year', type: 'string' },
    { key: 'vehicleStatus', label: 'Vehicle Status', type: 'number' },
    { key: 'currentOfficeId', label: 'Current Office Id', type: 'number' },
    { key: 'active', label: 'Active', type: 'boolean' },
    { key: 'status', label: 'Status', type: 'string' },
    { key: 'note', label: 'Note', type: 'string' }
  ];
  private readonly excelSheetName = 'vehicles';

  @Public()
  @Get('template')
  @ApiOperation({ summary: 'Download blank Excel template' })
  async downloadTemplate(@Res() res: any) {
    const buf = await this.excelService.buildTemplate(this.excelSheetName, this.excelColumns);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="vehicles_template.xlsx"`);
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
    res.setHeader('Content-Disposition', `attachment; filename="vehicles_${Date.now()}.xlsx"`);
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
