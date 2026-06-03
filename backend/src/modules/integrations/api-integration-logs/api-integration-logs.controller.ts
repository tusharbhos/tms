import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards, Res, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Public } from '../../../common/decorators/public.decorator';
import { ExcelService, ColumnDef  } from '../../../common/services/excel.service';
import { ApiIntegrationLogsService } from './api-integration-logs.service';
import { CreateApiIntegrationLogsSchema, CreateApiIntegrationLogsDto } from './dto/create-api-integration-logs.dto';
import { UpdateApiIntegrationLogsSchema, UpdateApiIntegrationLogsDto } from './dto/update-api-integration-logs.dto';
import { FilterApiIntegrationLogsSchema, FilterApiIntegrationLogsDto } from './dto/filter-api-integration-logs.dto';
import { ZodValidationPipe } from '../../../common/pipes/zod-validation.pipe';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { TenantGuard } from '../../../common/guards/tenant.guard';
import { CurrentTenant } from '../../../common/decorators/tenant.decorator';
import { CurrentUser } from '../../../common/decorators/user.decorator';

@UseGuards(JwtAuthGuard, TenantGuard)
@ApiTags('integrations/api-integration-logs')
@ApiBearerAuth()
@Controller('integrations/api-integration-logs')
export class ApiIntegrationLogsController {
  constructor(private readonly service: ApiIntegrationLogsService,
    private readonly excelService: ExcelService) {}

  @Post()
  create(
    @CurrentTenant() tenantId: number,
    @CurrentUser('id') userId: number,
    @Body(new ZodValidationPipe(CreateApiIntegrationLogsSchema)) dto: CreateApiIntegrationLogsDto,
  ) {
    return this.service.create(tenantId, userId, dto);
  }

  @Get()
  findAll(
    @CurrentTenant() tenantId: number,
    @Query(new ZodValidationPipe(FilterApiIntegrationLogsSchema)) query: FilterApiIntegrationLogsDto,
  ) {
    return this.service.findAll(tenantId, query);
  }

  @Get(':id(\\d+)')
  findOne(@CurrentTenant() tenantId: number, @Param('id') id: string) {
    return this.service.findOne(tenantId, id);
  }

  // ───────── Excel import / export ─────────
  private readonly excelColumns: ColumnDef[] = [
    { key: 'integrationId', label: 'Integration Id', type: 'number' },
    { key: 'direction', label: 'Direction', type: 'string' },
    { key: 'method', label: 'Method', type: 'string' },
    { key: 'requestUrl', label: 'Request Url', type: 'string' },
    { key: 'requestHeaders', label: 'Request Headers', type: 'string' },
    { key: 'requestPayload', label: 'Request Payload', type: 'string' },
    { key: 'responsePayload', label: 'Response Payload', type: 'string' },
    { key: 'statusCode', label: 'Status Code', type: 'number' },
    { key: 'durationMs', label: 'Duration Ms', type: 'number' },
    { key: 'errorMessage', label: 'Error Message', type: 'string' },
    { key: 'errorCode', label: 'Error Code', type: 'string' },
    { key: 'retryCount', label: 'Retry Count', type: 'number' },
    { key: 'isSuccess', label: 'Is Success', type: 'boolean' },
    { key: 'entityType', label: 'Entity Type', type: 'string' },
    { key: 'entityId', label: 'Entity Id', type: 'number' },
    { key: 'calledAt', label: 'Called At', type: 'date' },
    { key: 'respondedAt', label: 'Responded At', type: 'date' }
  ];
  private readonly excelSheetName = 'api_integration_logs';

  @Public()
  @Get('template')
  @ApiOperation({ summary: 'Download blank Excel template' })
  async downloadTemplate(@Res() res: any) {
    const buf = await this.excelService.buildTemplate(this.excelSheetName, this.excelColumns);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="api_integration_logs_template.xlsx"`);
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
    res.setHeader('Content-Disposition', `attachment; filename="api_integration_logs_${Date.now()}.xlsx"`);
    res.send(buf);
  }

}
