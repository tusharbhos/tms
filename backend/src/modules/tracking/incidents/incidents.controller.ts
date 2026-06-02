import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards, Res, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Public } from '../../../common/decorators/public.decorator';
import { ExcelService, ColumnDef  } from '../../../common/services/excel.service';
import { IncidentsService } from './incidents.service';
import { CreateIncidentsSchema, CreateIncidentsDto } from './dto/create-incidents.dto';
import { UpdateIncidentsSchema, UpdateIncidentsDto } from './dto/update-incidents.dto';
import { FilterIncidentsSchema, FilterIncidentsDto } from './dto/filter-incidents.dto';
import { ZodValidationPipe } from '../../../common/pipes/zod-validation.pipe';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { TenantGuard } from '../../../common/guards/tenant.guard';
import { CurrentTenant } from '../../../common/decorators/tenant.decorator';
import { CurrentUser } from '../../../common/decorators/user.decorator';

@UseGuards(JwtAuthGuard, TenantGuard)
@ApiTags('tracking/incidents')
@ApiBearerAuth()
@Controller('tracking/incidents')
export class IncidentsController {
  constructor(private readonly service: IncidentsService,
    private readonly excelService: ExcelService) {}

  @Post()
  create(
    @CurrentTenant() tenantId: number,
    @CurrentUser('id') userId: number,
    @Body(new ZodValidationPipe(CreateIncidentsSchema)) dto: CreateIncidentsDto,
  ) {
    return this.service.create(tenantId, userId, dto);
  }

  @Get()
  findAll(
    @CurrentTenant() tenantId: number,
    @Query(new ZodValidationPipe(FilterIncidentsSchema)) query: FilterIncidentsDto,
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
    @Body(new ZodValidationPipe(UpdateIncidentsSchema)) dto: UpdateIncidentsDto,
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
    { key: 'incidentNo', label: 'Incident No', type: 'string' },
    { key: 'incidentTypeId', label: 'Incident Type Id', type: 'number' },
    { key: 'severity', label: 'Severity', type: 'string' },
    { key: 'entityType', label: 'Entity Type', type: 'string' },
    { key: 'entityId', label: 'Entity Id', type: 'number' },
    { key: 'lrId', label: 'Lr Id', type: 'number' },
    { key: 'tripId', label: 'Trip Id', type: 'number' },
    { key: 'vehicleId', label: 'Vehicle Id', type: 'number' },
    { key: 'driverId', label: 'Driver Id', type: 'number' },
    { key: 'officeId', label: 'Office Id', type: 'number' },
    { key: 'incidentDatetime', label: 'Incident Datetime', type: 'date' },
    { key: 'latitude', label: 'Latitude', type: 'number' },
    { key: 'longitude', label: 'Longitude', type: 'number' },
    { key: 'incidentLocation', label: 'Incident Location', type: 'string' },
    { key: 'description', label: 'Description', type: 'string' },
    { key: 'reportedBy', label: 'Reported By', type: 'number' },
    { key: 'incidentStatus', label: 'Incident Status', type: 'string' },
    { key: 'assignedTo', label: 'Assigned To', type: 'number' },
    { key: 'resolutionDeadline', label: 'Resolution Deadline', type: 'date' },
    { key: 'resolvedAt', label: 'Resolved At', type: 'date' },
    { key: 'resolutionNote', label: 'Resolution Note', type: 'string' },
    { key: 'policeReportNo', label: 'Police Report No', type: 'string' },
    { key: 'rtoChallanNo', label: 'Rto Challan No', type: 'string' },
    { key: 'isClaimRequired', label: 'Is Claim Required', type: 'boolean' },
    { key: 'customerNotified', label: 'Customer Notified', type: 'boolean' }
  ];
  private readonly excelSheetName = 'txn_incidents';

  @Public()
  @Get('template')
  @ApiOperation({ summary: 'Download blank Excel template' })
  async downloadTemplate(@Res() res: any) {
    const buf = await this.excelService.buildTemplate(this.excelSheetName, this.excelColumns);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="txn_incidents_template.xlsx"`);
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
    res.setHeader('Content-Disposition', `attachment; filename="txn_incidents_${Date.now()}.xlsx"`);
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
