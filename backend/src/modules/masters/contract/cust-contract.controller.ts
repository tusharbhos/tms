import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards, Res, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Public } from '../../../common/decorators/public.decorator';
import { ExcelService, ColumnDef  } from '../../../common/services/excel.service';
import { CustContractService } from './cust-contract.service';
import { CreateCustContractSchema, CreateCustContractDto } from './dto/create-cust-contract.dto';
import { UpdateCustContractSchema, UpdateCustContractDto } from './dto/update-cust-contract.dto';
import { FilterCustContractSchema, FilterCustContractDto } from './dto/filter-cust-contract.dto';
import { ZodValidationPipe } from '../../../common/pipes/zod-validation.pipe';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { TenantGuard } from '../../../common/guards/tenant.guard';
import { CurrentTenant } from '../../../common/decorators/tenant.decorator';
import { CurrentUser } from '../../../common/decorators/user.decorator';

@UseGuards(JwtAuthGuard, TenantGuard)
@ApiTags('masters/contract')
@ApiBearerAuth()
@Controller('masters/contract')
export class CustContractController {
  constructor(private readonly service: CustContractService,
    private readonly excelService: ExcelService) {}

  @Post()
  create(
    @CurrentTenant() tenantId: number,
    @CurrentUser('id') userId: number,
    @Body(new ZodValidationPipe(CreateCustContractSchema)) dto: CreateCustContractDto,
  ) {
    return this.service.create(tenantId, userId, dto);
  }

  @Get()
  findAll(
    @CurrentTenant() tenantId: number,
    @Query(new ZodValidationPipe(FilterCustContractSchema)) query: FilterCustContractDto,
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
    @Body(new ZodValidationPipe(UpdateCustContractSchema)) dto: UpdateCustContractDto,
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

  // ───────── Excel import / export ─────────
  private readonly excelColumns: ColumnDef[] = [
    { key: 'companyTag', label: 'Company Tag', type: 'number' },
    { key: 'customerId', label: 'Customer Id', type: 'number' },
    { key: 'customerGroupId', label: 'Customer Group Id', type: 'number' },
    { key: 'ctrNum', label: 'Ctr Num', type: 'string' },
    { key: 'startDate', label: 'Start Date', type: 'date' },
    { key: 'endDate', label: 'End Date', type: 'date' },
    { key: 'paymentType', label: 'Payment Type', type: 'string' },
    { key: 'loadType', label: 'Load Type', type: 'string' },
    { key: 'distanceType', label: 'Distance Type', type: 'string' },
    { key: 'rateType', label: 'Rate Type', type: 'string' },
    { key: 'pickupDeliveryMode', label: 'Pickup Delivery Mode', type: 'string' },
    { key: 'excessWtChargeable', label: 'Excess Wt Chargeable', type: 'boolean' },
    { key: 'odaDelChargeable', label: 'Oda Del Chargeable', type: 'boolean' },
    { key: 'creditPeriod', label: 'Credit Period', type: 'number' },
    { key: 'docuChargesPerInvoice', label: 'Docu Charges Per Invoice', type: 'number' },
    { key: 'loadingChargesPerPkg', label: 'Loading Charges Per Pkg', type: 'number' },
    { key: 'fuelSurcharge', label: 'Fuel Surcharge', type: 'number' },
    { key: 'odaMinDelCharges', label: 'Oda Min Del Charges', type: 'number' },
    { key: 'reversePickUpCharges', label: 'Reverse Pick Up Charges', type: 'number' },
    { key: 'insuranceCharges', label: 'Insurance Charges', type: 'number' },
    { key: 'minimumChargeableWt', label: 'Minimum Chargeable Wt', type: 'number' },
    { key: 'active', label: 'Active', type: 'boolean' },
    { key: 'versionNo', label: 'Version No', type: 'number' },
    { key: 'isCurrent', label: 'Is Current', type: 'boolean' },
    { key: 'supersededBy', label: 'Superseded By', type: 'number' },
    { key: 'approvalStatus', label: 'Approval Status', type: 'string' },
    { key: 'rejectionReason', label: 'Rejection Reason', type: 'string' },
    { key: 'effectiveFrom', label: 'Effective From', type: 'date' },
    { key: 'effectiveUntil', label: 'Effective Until', type: 'date' },
    { key: 'changeSummary', label: 'Change Summary', type: 'string' },
    { key: 'previousVersionId', label: 'Previous Version Id', type: 'number' }
  ];
  private readonly excelSheetName = 'cust_contract';

  @Public()
  @Get('template')
  @ApiOperation({ summary: 'Download blank Excel template' })
  async downloadTemplate(@Res() res: any) {
    const buf = await this.excelService.buildTemplate(this.excelSheetName, this.excelColumns);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="cust_contract_template.xlsx"`);
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
    res.setHeader('Content-Disposition', `attachment; filename="cust_contract_${Date.now()}.xlsx"`);
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
