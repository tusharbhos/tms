import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards, Res, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Public } from '../../../common/decorators/public.decorator';
import { ExcelService, ColumnDef  } from '../../../common/services/excel.service';
import { ChannelPartnerService } from './channel-partner.service';
import { CreateChannelPartnerSchema, CreateChannelPartnerDto } from './dto/create-channel-partner.dto';
import { UpdateChannelPartnerSchema, UpdateChannelPartnerDto } from './dto/update-channel-partner.dto';
import { FilterChannelPartnerSchema, FilterChannelPartnerDto } from './dto/filter-channel-partner.dto';
import { ZodValidationPipe } from '../../../common/pipes/zod-validation.pipe';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { TenantGuard } from '../../../common/guards/tenant.guard';
import { CurrentTenant } from '../../../common/decorators/tenant.decorator';
import { CurrentUser } from '../../../common/decorators/user.decorator';

@UseGuards(JwtAuthGuard, TenantGuard)
@ApiTags('masters/channel-partner')
@ApiBearerAuth()
@Controller('masters/channel-partner')
export class ChannelPartnerController {
  constructor(private readonly service: ChannelPartnerService,
    private readonly excelService: ExcelService) {}

  @Post()
  create(
    @CurrentTenant() tenantId: number,
    @CurrentUser('id') userId: number,
    @Body(new ZodValidationPipe(CreateChannelPartnerSchema)) dto: CreateChannelPartnerDto,
  ) {
    return this.service.create(tenantId, userId, dto);
  }

  @Get()
  findAll(
    @CurrentTenant() tenantId: number,
    @Query(new ZodValidationPipe(FilterChannelPartnerSchema)) query: FilterChannelPartnerDto,
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
    @Body(new ZodValidationPipe(UpdateChannelPartnerSchema)) dto: UpdateChannelPartnerDto,
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
    { key: 'companyId', label: 'Company Id', type: 'number' },
    { key: 'officeId', label: 'Office Id', type: 'number' },
    { key: 'parentCpId', label: 'Parent Cp Id', type: 'number' },
    { key: 'cpCode', label: 'Cp Code', type: 'string' },
    { key: 'name', label: 'Name', type: 'string' },
    { key: 'contactPerson', label: 'Contact Person', type: 'string' },
    { key: 'mobile', label: 'Mobile', type: 'string' },
    { key: 'email', label: 'Email', type: 'string' },
    { key: 'cpType', label: 'Cp Type', type: 'string' },
    { key: 'gstNumber', label: 'Gst Number', type: 'string' },
    { key: 'panNumber', label: 'Pan Number', type: 'string' },
    { key: 'agreementNumber', label: 'Agreement Number', type: 'string' },
    { key: 'agreementStartDate', label: 'Agreement Start Date', type: 'date' },
    { key: 'agreementEndDate', label: 'Agreement End Date', type: 'date' },
    { key: 'autoRenewal', label: 'Auto Renewal', type: 'boolean' },
    { key: 'commissionType', label: 'Commission Type', type: 'string' },
    { key: 'commissionValue', label: 'Commission Value', type: 'number' },
    { key: 'paymentCycle', label: 'Payment Cycle', type: 'string' },
    { key: 'creditLimit', label: 'Credit Limit', type: 'number' },
    { key: 'creditDays', label: 'Credit Days', type: 'number' },
    { key: 'rating', label: 'Rating', type: 'number' },
    { key: 'assignedUserId', label: 'Assigned User Id', type: 'number' },
    { key: 'status', label: 'Status', type: 'string' },
    { key: 'onboardingStatus', label: 'Onboarding Status', type: 'string' },
    { key: 'blacklistReason', label: 'Blacklist Reason', type: 'string' },
    { key: 'isActive', label: 'Is Active', type: 'boolean' }
  ];
  private readonly excelSheetName = 'channel_partner';

  @Public()
  @Get('template')
  @ApiOperation({ summary: 'Download blank Excel template' })
  async downloadTemplate(@Res() res: any) {
    const buf = await this.excelService.buildTemplate(this.excelSheetName, this.excelColumns);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="channel_partner_template.xlsx"`);
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
    res.setHeader('Content-Disposition', `attachment; filename="channel_partner_${Date.now()}.xlsx"`);
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
