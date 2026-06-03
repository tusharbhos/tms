import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards, Res, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Public } from '../../../common/decorators/public.decorator';
import { ExcelService, ColumnDef  } from '../../../common/services/excel.service';
import { UsersService } from './users.service';
import { CreateUsersSchema, CreateUsersDto } from './dto/create-users.dto';
import { UpdateUsersSchema, UpdateUsersDto } from './dto/update-users.dto';
import { FilterUsersSchema, FilterUsersDto } from './dto/filter-users.dto';
import { ZodValidationPipe } from '../../../common/pipes/zod-validation.pipe';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { TenantGuard } from '../../../common/guards/tenant.guard';
import { CurrentTenant } from '../../../common/decorators/tenant.decorator';
import { CurrentUser } from '../../../common/decorators/user.decorator';

@UseGuards(JwtAuthGuard, TenantGuard)
@ApiTags('iam/users')
@ApiBearerAuth()
@Controller('iam/users')
export class UsersController {
  constructor(private readonly service: UsersService,
    private readonly excelService: ExcelService) {}

  @Post()
  create(
    @CurrentTenant() tenantId: number,
    @CurrentUser('id') userId: number,
    @Body(new ZodValidationPipe(CreateUsersSchema)) dto: CreateUsersDto,
  ) {
    return this.service.create(tenantId, userId, dto);
  }

  @Get()
  findAll(
    @CurrentTenant() tenantId: number,
    @Query(new ZodValidationPipe(FilterUsersSchema)) query: FilterUsersDto,
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
    @Body(new ZodValidationPipe(UpdateUsersSchema)) dto: UpdateUsersDto,
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
    { key: 'roleId', label: 'Role Id', type: 'number' },
    { key: 'employeeCode', label: 'Employee Code', type: 'string' },
    { key: 'name', label: 'Name', type: 'string' },
    { key: 'loginId', label: 'Login Id', type: 'string' },
    { key: 'userType', label: 'User Type', type: 'string' },
    { key: 'profilePicUrl', label: 'Profile Pic Url', type: 'string' },
    { key: 'jobTitle', label: 'Job Title', type: 'string' },
    { key: 'designation', label: 'Designation', type: 'string' },
    { key: 'department', label: 'Department', type: 'string' },
    { key: 'departmentId', label: 'Department Id', type: 'number' },
    { key: 'mobile', label: 'Mobile', type: 'string' },
    { key: 'email', label: 'Email', type: 'string' },
    { key: 'email2', label: 'Email2', type: 'string' },
    { key: 'passwordHash', label: 'Password Hash', type: 'string' },
    { key: 'googleId', label: 'Google Id', type: 'string' },
    { key: 'ssoId', label: 'Sso Id', type: 'string' },
    { key: 'ssoRef', label: 'Sso Ref', type: 'string' },
    { key: 'aadhaar', label: 'Aadhaar', type: 'string' },
    { key: 'pan', label: 'Pan', type: 'string' },
    { key: 'epfUan', label: 'Epf Uan', type: 'string' },
    { key: 'epfNum', label: 'Epf Num', type: 'string' },
    { key: 'esic', label: 'Esic', type: 'string' },
    { key: 'officeId', label: 'Office Id', type: 'number' },
    { key: 'managerUserId', label: 'Manager User Id', type: 'number' },
    { key: 'lastLogin', label: 'Last Login', type: 'date' },
    { key: 'lastPasswordReset', label: 'Last Password Reset', type: 'date' },
    { key: 'failedLoginAttempts', label: 'Failed Login Attempts', type: 'number' },
    { key: 'active', label: 'Active', type: 'boolean' },
    { key: 'status', label: 'Status', type: 'string' },
    { key: 'remarks', label: 'Remarks', type: 'string' }
  ];
  private readonly excelSheetName = 'users';

  @Public()
  @Get('template')
  @ApiOperation({ summary: 'Download blank Excel template' })
  async downloadTemplate(@Res() res: any) {
    const buf = await this.excelService.buildTemplate(this.excelSheetName, this.excelColumns);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="users_template.xlsx"`);
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
    res.setHeader('Content-Disposition', `attachment; filename="users_${Date.now()}.xlsx"`);
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
