import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards, Res, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Public } from '../../../common/decorators/public.decorator';
import { ExcelService, ColumnDef  } from '../../../common/services/excel.service';
import { ContactPersonsService } from './contact-persons.service';
import { CreateContactPersonsSchema, CreateContactPersonsDto } from './dto/create-contact-persons.dto';
import { UpdateContactPersonsSchema, UpdateContactPersonsDto } from './dto/update-contact-persons.dto';
import { FilterContactPersonsSchema, FilterContactPersonsDto } from './dto/filter-contact-persons.dto';
import { ZodValidationPipe } from '../../../common/pipes/zod-validation.pipe';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { TenantGuard } from '../../../common/guards/tenant.guard';
import { CurrentTenant } from '../../../common/decorators/tenant.decorator';
import { CurrentUser } from '../../../common/decorators/user.decorator';

@UseGuards(JwtAuthGuard, TenantGuard)
@ApiTags('vault/contact-persons')
@ApiBearerAuth()
@Controller('vault/contact-persons')
export class ContactPersonsController {
  constructor(private readonly service: ContactPersonsService,
    private readonly excelService: ExcelService) {}

  @Post()
  create(
    @CurrentTenant() tenantId: number,
    @CurrentUser('id') userId: number,
    @Body(new ZodValidationPipe(CreateContactPersonsSchema)) dto: CreateContactPersonsDto,
  ) {
    return this.service.create(tenantId, userId, dto);
  }

  @Get()
  findAll(
    @CurrentTenant() tenantId: number,
    @Query(new ZodValidationPipe(FilterContactPersonsSchema)) query: FilterContactPersonsDto,
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
    @Body(new ZodValidationPipe(UpdateContactPersonsSchema)) dto: UpdateContactPersonsDto,
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
    { key: 'entityType', label: 'Entity Type', type: 'string' },
    { key: 'entityId', label: 'Entity Id', type: 'number' },
    { key: 'contactType', label: 'Contact Type', type: 'string' },
    { key: 'salutation', label: 'Salutation', type: 'string' },
    { key: 'name', label: 'Name', type: 'string' },
    { key: 'designation', label: 'Designation', type: 'string' },
    { key: 'department', label: 'Department', type: 'string' },
    { key: 'mobile', label: 'Mobile', type: 'string' },
    { key: 'mobile2', label: 'Mobile2', type: 'string' },
    { key: 'email', label: 'Email', type: 'string' },
    { key: 'email2', label: 'Email2', type: 'string' },
    { key: 'phone', label: 'Phone', type: 'string' },
    { key: 'whatsapp', label: 'Whatsapp', type: 'string' },
    { key: 'isPrimary', label: 'Is Primary', type: 'boolean' },
    { key: 'receivesInvoice', label: 'Receives Invoice', type: 'boolean' },
    { key: 'receivesAlerts', label: 'Receives Alerts', type: 'boolean' },
    { key: 'canLogin', label: 'Can Login', type: 'boolean' },
    { key: 'userId', label: 'User Id', type: 'number' },
    { key: 'notes', label: 'Notes', type: 'string' },
    { key: 'status', label: 'Status', type: 'string' }
  ];
  private readonly excelSheetName = 'contact_persons';

  @Public()
  @Get('template')
  @ApiOperation({ summary: 'Download blank Excel template' })
  async downloadTemplate(@Res() res: any) {
    const buf = await this.excelService.buildTemplate(this.excelSheetName, this.excelColumns);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="contact_persons_template.xlsx"`);
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
    res.setHeader('Content-Disposition', `attachment; filename="contact_persons_${Date.now()}.xlsx"`);
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
