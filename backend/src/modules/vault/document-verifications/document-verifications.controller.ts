import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards, Res, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Public } from '../../../common/decorators/public.decorator';
import { ExcelService, ColumnDef } from '../../../common/services/excel.service';
import { DocumentVerificationsService } from './document-verifications.service';
import { CreateDocumentVerificationsSchema, CreateDocumentVerificationsDto } from './dto/create-document-verifications.dto';
import { UpdateDocumentVerificationsSchema, UpdateDocumentVerificationsDto } from './dto/update-document-verifications.dto';
import { FilterDocumentVerificationsSchema, FilterDocumentVerificationsDto } from './dto/filter-document-verifications.dto';
import { ZodValidationPipe } from '../../../common/pipes/zod-validation.pipe';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { TenantGuard } from '../../../common/guards/tenant.guard';
import { CurrentTenant } from '../../../common/decorators/tenant.decorator';
import { CurrentUser } from '../../../common/decorators/user.decorator';

@UseGuards(JwtAuthGuard, TenantGuard)
@ApiTags('vault/document-verifications')
@ApiBearerAuth()
@Controller('vault/document-verifications')
export class DocumentVerificationsController {
  constructor(private readonly service: DocumentVerificationsService,
    private readonly excelService: ExcelService) {}

  @Post()
  create(
    @CurrentTenant() tenantId: number,
    @CurrentUser('id') userId: number,
    @Body(new ZodValidationPipe(CreateDocumentVerificationsSchema)) dto: CreateDocumentVerificationsDto,
  ) {
    return this.service.create(tenantId, userId, dto);
  }

  @Get()
  findAll(
    @CurrentTenant() tenantId: number,
    @Query(new ZodValidationPipe(FilterDocumentVerificationsSchema)) query: FilterDocumentVerificationsDto,
  ) {
    return this.service.findAll(tenantId, query);
  }

  @Get(':id(\\d+)')
  findOne(@CurrentTenant() tenantId: number, @Param('id') id: string) {
    return this.service.findOne(tenantId, id);
  }

  // ───────── Excel import / export ─────────
  private readonly excelColumns: ColumnDef[] = [
    { key: 'documentId', label: 'Document Id', type: 'number' },
    { key: 'documentTypeId', label: 'Document Type Id', type: 'number' },
    { key: 'entityType', label: 'Entity Type', type: 'string' },
    { key: 'entityId', label: 'Entity Id', type: 'number' },
    { key: 'action', label: 'Action', type: 'string' },
    { key: 'actionBy', label: 'Action By', type: 'number' },
    { key: 'actionAt', label: 'Action At', type: 'date' },
    { key: 'remarks', label: 'Remarks', type: 'string' },
    { key: 'previousStatus', label: 'Previous Status', type: 'string' },
    { key: 'newStatus', label: 'New Status', type: 'string' },
    { key: 'docUrlSnapshot', label: 'Doc Url Snapshot', type: 'string' },
    { key: 'expiryDate', label: 'Expiry Date', type: 'date' },
    { key: 'verificationMethod', label: 'Verification Method', type: 'string' },
    { key: 'ipAddress', label: 'Ip Address', type: 'string' },
    { key: 'approvalRequestId', label: 'Approval Request Id', type: 'number' }
  ];
  private readonly excelSheetName = 'document_verifications';

  @Public()
  @Get('template')
  @ApiOperation({ summary: 'Download blank Excel template' })
  async downloadTemplate(@Res() res: any) {
    const buf = await this.excelService.buildTemplate(this.excelSheetName, this.excelColumns);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="document_verifications_template.xlsx"`);
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
    res.setHeader('Content-Disposition', `attachment; filename="document_verifications_${Date.now()}.xlsx"`);
    res.send(buf);
  }

}
