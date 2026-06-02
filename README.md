# TMS Platform — Full Source

Transport Management System generated from the TMS Excel schema (100 tables · 11 modules).
Two independent projects, **no Turborepo** — each folder is a standalone deployable project.

```
tms-platform/
├── backend/         → NestJS 10 + Prisma + PostgreSQL   (REST API on :3000)
├── frontend/        → Next.js 14 App Router             (web portal on :3001)
├── driver-app/      → React Native (Expo) skeleton      (driver mobile)
├── postman/         → 772-endpoint Postman collection + environment
└── docker-compose.yml   → postgres + redis + minio for local dev
```

---

## ⚡ Quick start

```bash
# 1. Start infrastructure
docker compose up -d                  # postgres :5432 · redis :6379 · minio :9000

# 2. Backend
cd backend
cp .env.example .env
npm install
npm run prisma:generate
npm run prisma:migrate                # creates all 100 tables
npm run db:seed                       # populates 49+ reference tables (~1 sec)
npm run start:dev                     # http://localhost:3000  •  Swagger /docs

# 3. Frontend (new terminal)
cd frontend
cp .env.example .env
npm install
npm run dev                           # http://localhost:3001
```

**Demo login** (any of these, password = `demo123`):

| Login | Role | What works |
|-------|------|------------|
| `superadmin` | Super Admin | Everything |
| `admin` | Tenant Admin | All masters + transactions |
| `priya.patil` | Ops Manager | Operations module |
| `amit.counter` | Counter Staff | Limited — booking + LR only |
| `suresh.hub` | Hub Staff | Manifest + scanning |
| `neha.fin` | Finance | Invoice + voucher |

---

## 🔑 What's REAL (production-grade)

### Auth + RBAC (real bcrypt, real JWT, real privilege blocking)
- bcryptjs password hashing — computed at seed time so `demo123` always verifies
- JWT access + refresh tokens (separate secrets, in `.env.example`)
- OTP service: 6-digit code, 10-min TTL, max 5 attempts, stored in `user_otps`
  - SMS/email delivery is mocked via `console.log` in dev — backend logs the OTP code so you can copy it during development
  - Replace with MSG91 / Gupshup / SES for production (see `modules/integrations/`)
- **Privileges loaded into JWT at login** — the `PrivilegeGuard` rejects unauthorized calls with the actual privilege list:
  ```
  403 — Missing privilege: masters.delete. You have: [operations.view, operations.create, masters.view]
  ```
- Login attempts logged to `login_attempts` (immutable)
- Sessions tracked in `user_sessions`
- Activity audit auto-logged to `activity_logs`

### State machines (real, blocking)
8 entity types with full transition graphs. Illegal transitions throw with the allowed targets:
- `BookingTransitions` — DRAFT → CONFIRMED → LR_GENERATED → CLOSED (or CANCELLED)
- `LrTransitions` — 11 states from CREATED to DELIVERED/RTO
- Manifest, Trip, DRS, POD, Invoice, Voucher — all enforced

### Business services (real math)
- `ChargeCalculatorService` — slab → excess weight → ODA → GST
- `GstCalculatorService` — SGST+CGST (intra-state) vs IGST (inter-state)
- `TdsCalculatorService` — 1% / 2% based on payee type
- `ComplianceService` — DL / insurance / fitness expiry + blacklist gate
- `NumberSeriesService` — `SELECT … FOR UPDATE` atomic numbering

### Excel everywhere (real, reusable)
The backend `ExcelService` in `common/services/` is used by **every** controller via dependency injection.
The frontend `<ExcelActions />` component in `components/shared/` is used by **every** list page.

**No per-page edits needed** — just `<ExcelActions resource="masters/customer" />` and the buttons appear with full template/export/import logic.

Per-resource endpoints (all 100 tables):
| Verb | Path | What |
|------|------|------|
| `GET` | `/<resource>/template` | Blank Excel with column headers + sample row + notes sheet |
| `GET` | `/<resource>/export` | Current data as Excel (respects filters) |
| `POST` | `/<resource>/import` | Bulk-create from uploaded Excel + per-row error report |

Immutable log tables (activity_logs, tracking_events, GPS logs, etc.) have only the read endpoints + template/export — no import.

### Seed (real, idempotent, FK-ordered)
`npm run db:seed` populates 49 reference tables in correct foreign-key order. Re-runnable safely.

| Category | What's seeded |
|----------|---------------|
| Foundation | currency (3), feature_flags (5), document_types (15), geo_hierarchy (10), privileges (88) |
| Tenant | DEMO tenant + KYC + organizations + feature flags |
| Config | status_master (60+ across 8 modules), reason_master (~30), number_series (11), incident types (6) + actions (6), print_templates (5), automation rules (5) |
| Org | DEMO company, 6 offices (HO + 3 hubs + 2 branches), 6 departments |
| Identity | 8 roles, ~250 role_privileges bindings, 7 demo users (one per role) |
| Partners | 3 customers, 2 vendors + KYC, 1 channel partner + KYC |
| Fleet | 3 vehicles (real expiry dates), 3 drivers |
| Rates | driver_rate (3), loader_rate (3) |
| Contracts | 2 cust_contracts + 10 slab_definitions + 20 lane×slab rates + excess weight + ODA |
| Coverage | 10 pincode → hub mappings with TAT + ODA flags |
| Vault | addresses (5), contact_persons (5), bank_accounts (4), tax_registrations (4), documents (5) |
| Notifications | 7 templates (SMS/Email/WhatsApp/Push) |
| Integrations | 6 providers (GST, SAP, GPS, SMS, WA, Maps) + provider_config + webhook_configs |
| Routes | 5 trunk routes + 6 stops |
| Dashboards | 3 dashboards + 5 widgets + 3 workflows |

**51 tables left empty by design** — transactional + log + event tables that grow with use.

---

## 📁 Project layout

### `backend/` (NestJS)
```
backend/
├── src/
│   ├── main.ts                       # Entry, Swagger, CORS
│   ├── app.module.ts                 # Wires 11 modules + global JwtAuthGuard + PrivilegeGuard
│   ├── common/                       # ⭐ REUSABLE — used by every module
│   │   ├── decorators/               @CurrentTenant, @CurrentUser, @Public, @RequirePrivilege
│   │   ├── guards/                   JwtAuthGuard, TenantGuard, PrivilegeGuard (global)
│   │   ├── interceptors/             TransformInterceptor (wraps to {data, success})
│   │   ├── pipes/                    ZodValidationPipe
│   │   ├── filters/                  AllExceptionsFilter
│   │   ├── services/                 # The 8 reusable business services
│   │   │   ├── password.service.ts          bcrypt hash/verify
│   │   │   ├── otp.service.ts               6-digit, TTL, attempt-limited
│   │   │   ├── excel.service.ts             ⭐ Template / Export / Import
│   │   │   ├── audit.service.ts             writes activity_logs
│   │   │   ├── charge-calculator.service.ts
│   │   │   ├── gst-calculator.service.ts
│   │   │   ├── tds-calculator.service.ts
│   │   │   └── compliance.service.ts
│   │   └── common.module.ts          @Global() — services injectable everywhere
│   ├── database/
│   │   ├── prisma.service.ts
│   │   └── database.module.ts
│   └── modules/                      # ONE FOLDER PER BOUNDED CONTEXT
│       ├── tenant/                   6 submodules
│       ├── iam/                      10 submodules (including auth/)
│       │   └── auth/                 # ⭐ Real auth + OTP + RBAC
│       │       ├── auth.controller.ts        login, otp/send, otp/verify, refresh, logout, me
│       │       ├── auth.service.ts            loads user + role + privileges
│       │       ├── auth.module.ts
│       │       ├── strategies/
│       │       │   ├── jwt.strategy.ts
│       │       │   └── jwt-refresh.strategy.ts
│       │       └── dto/
│       ├── masters/                  19 submodules (customer, vendor, vehicle, driver, contract, …)
│       ├── vault/                    7 submodules (addresses, contacts, banks, tax, documents)
│       ├── config/                   7 submodules
│       ├── operations/               20 submodules (booking, lr, manifest, trip, drs, pod, …)
│       ├── tracking/                 9 submodules
│       ├── finance/                  6 submodules (invoice, voucher, fuel, loader)
│       ├── integrations/             7 submodules
│       ├── notifications/            3 submodules
│       └── audit/                    7 submodules
├── prisma/
│   ├── schema.prisma                 100 models, real columns from Excel
│   └── seed.ts                       Idempotent demo seed
├── package.json
└── .env.example
```

Each submodule has the same file shape:
```
masters/customer/
├── customer.controller.ts           CRUD + Excel template/export/import
├── customer.service.ts              Business logic
├── customer.repository.ts           Prisma queries (tenant-scoped, soft-delete)
├── customer.module.ts
├── entities/customer.entity.ts      Real columns from Excel (with descriptions)
├── dto/
│   ├── create-customer.dto.ts       Zod schema + inferred TS type
│   ├── update-customer.dto.ts
│   └── filter-customer.dto.ts
└── validators/customer.validator.ts
```

### `frontend/` (Next.js 14)
```
frontend/
├── src/
│   ├── app/
│   │   ├── (auth)/login/page.tsx
│   │   ├── (portal)/
│   │   │   ├── layout.tsx                    Sidebar + tenant switcher
│   │   │   ├── masters/customer/page.tsx     ← <ExcelActions /> auto-added
│   │   │   ├── operations/booking/page.tsx   ← <ExcelActions />
│   │   │   └── ...                           (100 list pages, all with Excel buttons)
│   │   └── api/                              Next.js webhook receivers
│   ├── components/
│   │   ├── ui/                               shadcn primitives
│   │   └── shared/                           # ⭐ REUSABLE
│   │       ├── excel-actions.tsx             Template / Export / Import buttons
│   │       └── import-result-dialog.tsx      Modal showing import errors
│   ├── lib/
│   │   ├── axios.ts                          Axios w/ JWT interceptor
│   │   ├── api/
│   │   │   ├── excel-client.ts               ⭐ Reusable downloadTemplate / exportData / importData
│   │   │   ├── customer.api.ts               One per resource
│   │   │   └── ...
│   │   └── auth.ts                           Token storage
│   ├── hooks/                                TanStack Query hooks per resource
│   └── store/                                Zustand stores
└── package.json
```

### `postman/`
```
postman/
├── TMS_API.postman_collection.json           772 endpoints across 12 folders
├── TMS_Environment.postman_environment.json
└── README.md
```

---

## 🛡 Privilege system

88 privileges in catalog (11 modules × 8 actions = `view`, `create`, `update`, `delete`, `approve`, `print`, `export`, `import`).

JWT carries `privileges: string[]` — e.g. `["masters.view", "masters.create", "operations.*"]`.

Use on any endpoint:
```typescript
@RequirePrivilege('masters.create')
@Post()
create(...) { ... }
```

Wildcards:
- `masters.*` grants all actions in masters
- `*` grants everything (Super Admin)

---

## 🧪 Test the auth flow with Postman

1. Import `postman/TMS_API.postman_collection.json` + the environment file
2. Open **🔐 Auth → Login (password)** → click Send → token auto-saved
3. **🔐 Auth → Me** → returns the user + privilege list
4. Try **📋 Masters → /masters/customer → ☰ List** → works
5. **🔐 Auth → Logout** → session invalidated

For OTP:
1. **🔐 Auth → OTP — send** with `{ "mobile": "9999999992", "purpose": "LOGIN" }`
2. Watch the backend console — you'll see:
   ```
   🔓 DEV: OTP for 9999999992 = 642193
   ```
3. **🔐 Auth → OTP — verify** with that code → tokens returned

---

## 🌱 Adding a new resource

1. Add Prisma model to `prisma/schema.prisma`, run `npx prisma migrate dev`
2. Create `src/modules/<module>/<resource>/` with the standard files
3. Inject `ExcelService` in the constructor → Excel endpoints come free
4. Add `<ExcelActions resource="<module>/<resource>" />` to the frontend page → done

---

## 📦 What's intentionally NOT included

- Production SMS/WhatsApp/Email sending (provider clients are stubs)
- Production secret rotation (dev JWT secrets in `.env`)
- BullMQ jobs wired to transitions (processors exist, you decide triggers)
- GPS provider integration (client stub exists)
- GST e-Way Bill real API integration (stub exists)

Every extension point is clearly marked. See `STRUCTURE.md` for the full file map.



# TMS Platform — Complete File Tree

Total files: 1406

```
tms-platform/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.ts
│   ├── src/
│   │   ├── common/
│   │   │   ├── decorators/
│   │   │   │   ├── privilege.decorator.ts
│   │   │   │   ├── public.decorator.ts
│   │   │   │   ├── tenant.decorator.ts
│   │   │   │   └── user.decorator.ts
│   │   │   ├── filters/
│   │   │   │   └── all-exceptions.filter.ts
│   │   │   ├── guards/
│   │   │   │   ├── jwt-auth.guard.ts
│   │   │   │   ├── privilege.guard.ts
│   │   │   │   └── tenant.guard.ts
│   │   │   ├── interceptors/
│   │   │   │   ├── audit.interceptor.ts
│   │   │   │   └── transform.interceptor.ts
│   │   │   ├── pipes/
│   │   │   │   └── zod-validation.pipe.ts
│   │   │   ├── services/
│   │   │   │   ├── audit.service.ts
│   │   │   │   ├── charge-calculator.service.ts
│   │   │   │   ├── compliance.service.ts
│   │   │   │   ├── excel.service.ts
│   │   │   │   ├── gst-calculator.service.ts
│   │   │   │   ├── otp.service.ts
│   │   │   │   ├── password.service.ts
│   │   │   │   └── tds-calculator.service.ts
│   │   │   └── common.module.ts
│   │   ├── database/
│   │   │   ├── database.module.ts
│   │   │   └── prisma.service.ts
│   │   ├── modules/
│   │   │   ├── audit/
│   │   │   │   ├── activity-logs/
│   │   │   │   │   ├── dto/
│   │   │   │   │   │   ├── create-activity-logs.dto.ts
│   │   │   │   │   │   ├── filter-activity-logs.dto.ts
│   │   │   │   │   │   └── update-activity-logs.dto.ts
│   │   │   │   │   ├── entities/
│   │   │   │   │   │   └── activity-logs.entity.ts
│   │   │   │   │   ├── mappers/
│   │   │   │   │   │   └── activity-logs.mapper.ts
│   │   │   │   │   ├── validators/
│   │   │   │   │   │   └── activity-logs.validator.ts
│   │   │   │   │   ├── activity-logs.controller.ts
│   │   │   │   │   ├── activity-logs.module.ts
│   │   │   │   │   ├── activity-logs.repository.ts
│   │   │   │   │   └── activity-logs.service.ts
│   │   │   │   ├── approval-action-logs/
│   │   │   │   │   ├── dto/
│   │   │   │   │   │   ├── create-approval-action-logs.dto.ts
│   │   │   │   │   │   ├── filter-approval-action-logs.dto.ts
│   │   │   │   │   │   └── update-approval-action-logs.dto.ts
│   │   │   │   │   ├── entities/
│   │   │   │   │   │   └── approval-action-logs.entity.ts
│   │   │   │   │   ├── mappers/
│   │   │   │   │   │   └── approval-action-logs.mapper.ts
│   │   │   │   │   ├── validators/
│   │   │   │   │   │   └── approval-action-logs.validator.ts
│   │   │   │   │   ├── approval-action-logs.controller.ts
│   │   │   │   │   ├── approval-action-logs.module.ts
│   │   │   │   │   ├── approval-action-logs.repository.ts
│   │   │   │   │   └── approval-action-logs.service.ts
│   │   │   │   ├── approval-requests/
│   │   │   │   │   ├── dto/
│   │   │   │   │   │   ├── create-approval-requests.dto.ts
│   │   │   │   │   │   ├── filter-approval-requests.dto.ts
│   │   │   │   │   │   └── update-approval-requests.dto.ts
│   │   │   │   │   ├── entities/
│   │   │   │   │   │   └── approval-requests.entity.ts
│   │   │   │   │   ├── mappers/
│   │   │   │   │   │   └── approval-requests.mapper.ts
│   │   │   │   │   ├── validators/
│   │   │   │   │   │   └── approval-requests.validator.ts
│   │   │   │   │   ├── approval-requests.controller.ts
│   │   │   │   │   ├── approval-requests.module.ts
│   │   │   │   │   ├── approval-requests.repository.ts
│   │   │   │   │   └── approval-requests.service.ts
│   │   │   │   ├── approval-steps/
│   │   │   │   │   ├── dto/
│   │   │   │   │   │   ├── create-approval-steps.dto.ts
│   │   │   │   │   │   ├── filter-approval-steps.dto.ts
│   │   │   │   │   │   └── update-approval-steps.dto.ts
│   │   │   │   │   ├── entities/
│   │   │   │   │   │   └── approval-steps.entity.ts
│   │   │   │   │   ├── mappers/
│   │   │   │   │   │   └── approval-steps.mapper.ts
│   │   │   │   │   ├── validators/
│   │   │   │   │   │   └── approval-steps.validator.ts
│   │   │   │   │   ├── approval-steps.controller.ts
│   │   │   │   │   ├── approval-steps.module.ts
│   │   │   │   │   ├── approval-steps.repository.ts
│   │   │   │   │   └── approval-steps.service.ts
│   │   │   │   ├── dashboard-widgets/
│   │   │   │   │   ├── dto/
│   │   │   │   │   │   ├── create-dashboard-widgets.dto.ts
│   │   │   │   │   │   ├── filter-dashboard-widgets.dto.ts
│   │   │   │   │   │   └── update-dashboard-widgets.dto.ts
│   │   │   │   │   ├── entities/
│   │   │   │   │   │   └── dashboard-widgets.entity.ts
│   │   │   │   │   ├── mappers/
│   │   │   │   │   │   └── dashboard-widgets.mapper.ts
│   │   │   │   │   ├── validators/
│   │   │   │   │   │   └── dashboard-widgets.validator.ts
│   │   │   │   │   ├── dashboard-widgets.controller.ts
│   │   │   │   │   ├── dashboard-widgets.module.ts
│   │   │   │   │   ├── dashboard-widgets.repository.ts
│   │   │   │   │   └── dashboard-widgets.service.ts
│   │   │   │   ├── dashboards/
│   │   │   │   │   ├── dto/
│   │   │   │   │   │   ├── create-dashboards.dto.ts
│   │   │   │   │   │   ├── filter-dashboards.dto.ts
│   │   │   │   │   │   └── update-dashboards.dto.ts
│   │   │   │   │   ├── entities/
│   │   │   │   │   │   └── dashboards.entity.ts
│   │   │   │   │   ├── mappers/
│   │   │   │   │   │   └── dashboards.mapper.ts
│   │   │   │   │   ├── validators/
│   │   │   │   │   │   └── dashboards.validator.ts
│   │   │   │   │   ├── dashboards.controller.ts
│   │   │   │   │   ├── dashboards.module.ts
│   │   │   │   │   ├── dashboards.repository.ts
│   │   │   │   │   └── dashboards.service.ts
│   │   │   │   ├── scheduled-jobs/
│   │   │   │   │   ├── dto/
│   │   │   │   │   │   ├── create-scheduled-jobs.dto.ts
│   │   │   │   │   │   ├── filter-scheduled-jobs.dto.ts
│   │   │   │   │   │   └── update-scheduled-jobs.dto.ts
│   │   │   │   │   ├── entities/
│   │   │   │   │   │   └── scheduled-jobs.entity.ts
│   │   │   │   │   ├── mappers/
│   │   │   │   │   │   └── scheduled-jobs.mapper.ts
│   │   │   │   │   ├── validators/
│   │   │   │   │   │   └── scheduled-jobs.validator.ts
│   │   │   │   │   ├── scheduled-jobs.controller.ts
│   │   │   │   │   ├── scheduled-jobs.module.ts
│   │   │   │   │   ├── scheduled-jobs.repository.ts
│   │   │   │   │   └── scheduled-jobs.service.ts
│   │   │   │   └── audit.module.ts
│   │   │   ├── config/
│   │   │   │   ├── incident-action-master/
│   │   │   │   │   ├── dto/
│   │   │   │   │   │   ├── create-incident-action-master.dto.ts
│   │   │   │   │   │   ├── filter-incident-action-master.dto.ts
│   │   │   │   │   │   └── update-incident-action-master.dto.ts
│   │   │   │   │   ├── entities/
│   │   │   │   │   │   └── incident-action-master.entity.ts
│   │   │   │   │   ├── mappers/
│   │   │   │   │   │   └── incident-action-master.mapper.ts
│   │   │   │   │   ├── validators/
│   │   │   │   │   │   └── incident-action-master.validator.ts
│   │   │   │   │   ├── incident-action-master.controller.ts
│   │   │   │   │   ├── incident-action-master.module.ts
│   │   │   │   │   ├── incident-action-master.repository.ts
│   │   │   │   │   └── incident-action-master.service.ts
│   │   │   │   ├── incident-type-master/
│   │   │   │   │   ├── dto/
│   │   │   │   │   │   ├── create-incident-type-master.dto.ts
│   │   │   │   │   │   ├── filter-incident-type-master.dto.ts
│   │   │   │   │   │   └── update-incident-type-master.dto.ts
│   │   │   │   │   ├── entities/
│   │   │   │   │   │   └── incident-type-master.entity.ts
│   │   │   │   │   ├── mappers/
│   │   │   │   │   │   └── incident-type-master.mapper.ts
│   │   │   │   │   ├── validators/
│   │   │   │   │   │   └── incident-type-master.validator.ts
│   │   │   │   │   ├── incident-type-master.controller.ts
│   │   │   │   │   ├── incident-type-master.module.ts
│   │   │   │   │   ├── incident-type-master.repository.ts
│   │   │   │   │   └── incident-type-master.service.ts
│   │   │   │   ├── number-series/
│   │   │   │   │   ├── dto/
│   │   │   │   │   │   ├── create-number-series-config.dto.ts
│   │   │   │   │   │   ├── filter-number-series-config.dto.ts
│   │   │   │   │   │   └── update-number-series-config.dto.ts
│   │   │   │   │   ├── entities/
│   │   │   │   │   │   └── number-series-config.entity.ts
│   │   │   │   │   ├── mappers/
│   │   │   │   │   │   └── number-series-config.mapper.ts
│   │   │   │   │   ├── validators/
│   │   │   │   │   │   └── number-series-config.validator.ts
│   │   │   │   │   ├── number-series-config.controller.ts
│   │   │   │   │   ├── number-series-config.module.ts
│   │   │   │   │   ├── number-series-config.repository.ts
│   │   │   │   │   └── number-series-config.service.ts
│   │   │   │   ├── print-templates/
│   │   │   │   │   ├── dto/
│   │   │   │   │   │   ├── create-print-templates.dto.ts
│   │   │   │   │   │   ├── filter-print-templates.dto.ts
│   │   │   │   │   │   └── update-print-templates.dto.ts
│   │   │   │   │   ├── entities/
│   │   │   │   │   │   └── print-templates.entity.ts
│   │   │   │   │   ├── mappers/
│   │   │   │   │   │   └── print-templates.mapper.ts
│   │   │   │   │   ├── validators/
│   │   │   │   │   │   └── print-templates.validator.ts
│   │   │   │   │   ├── print-templates.controller.ts
│   │   │   │   │   ├── print-templates.module.ts
│   │   │   │   │   ├── print-templates.repository.ts
│   │   │   │   │   └── print-templates.service.ts
│   │   │   │   ├── reason-master/
│   │   │   │   │   ├── dto/
│   │   │   │   │   │   ├── create-reason-master.dto.ts
│   │   │   │   │   │   ├── filter-reason-master.dto.ts
│   │   │   │   │   │   └── update-reason-master.dto.ts
│   │   │   │   │   ├── entities/
│   │   │   │   │   │   └── reason-master.entity.ts
│   │   │   │   │   ├── mappers/
│   │   │   │   │   │   └── reason-master.mapper.ts
│   │   │   │   │   ├── validators/
│   │   │   │   │   │   └── reason-master.validator.ts
│   │   │   │   │   ├── reason-master.controller.ts
│   │   │   │   │   ├── reason-master.module.ts
│   │   │   │   │   ├── reason-master.repository.ts
│   │   │   │   │   └── reason-master.service.ts
│   │   │   │   ├── status-automation/
│   │   │   │   │   ├── dto/
│   │   │   │   │   │   ├── create-status-automation-rules.dto.ts
│   │   │   │   │   │   ├── filter-status-automation-rules.dto.ts
│   │   │   │   │   │   └── update-status-automation-rules.dto.ts
│   │   │   │   │   ├── entities/
│   │   │   │   │   │   └── status-automation-rules.entity.ts
│   │   │   │   │   ├── mappers/
│   │   │   │   │   │   └── status-automation-rules.mapper.ts
│   │   │   │   │   ├── validators/
│   │   │   │   │   │   └── status-automation-rules.validator.ts
│   │   │   │   │   ├── status-automation-rules.controller.ts
│   │   │   │   │   ├── status-automation-rules.module.ts
│   │   │   │   │   ├── status-automation-rules.repository.ts
│   │   │   │   │   └── status-automation-rules.service.ts
│   │   │   │   ├── status-master/
│   │   │   │   │   ├── dto/
│   │   │   │   │   │   ├── create-status-master.dto.ts
│   │   │   │   │   │   ├── filter-status-master.dto.ts
│   │   │   │   │   │   └── update-status-master.dto.ts
│   │   │   │   │   ├── entities/
│   │   │   │   │   │   └── status-master.entity.ts
│   │   │   │   │   ├── mappers/
│   │   │   │   │   │   └── status-master.mapper.ts
│   │   │   │   │   ├── validators/
│   │   │   │   │   │   └── status-master.validator.ts
│   │   │   │   │   ├── status-master.controller.ts
│   │   │   │   │   ├── status-master.module.ts
│   │   │   │   │   ├── status-master.repository.ts
│   │   │   │   │   └── status-master.service.ts
│   │   │   │   └── config.module.ts
│   │   │   ├── finance/
│   │   │   │   ├── customer-invoice/
│   │   │   │   │   ├── dto/
│   │   │   │   │   │   ├── create-customer-invoice.dto.ts
│   │   │   │   │   │   ├── filter-customer-invoice.dto.ts
│   │   │   │   │   │   └── update-customer-invoice.dto.ts
│   │   │   │   │   ├── entities/
│   │   │   │   │   │   └── customer-invoice.entity.ts
│   │   │   │   │   ├── mappers/
│   │   │   │   │   │   └── customer-invoice.mapper.ts
│   │   │   │   │   ├── validators/
│   │   │   │   │   │   └── customer-invoice.validator.ts
│   │   │   │   │   ├── customer-invoice.controller.ts
│   │   │   │   │   ├── customer-invoice.module.ts
│   │   │   │   │   ├── customer-invoice.repository.ts
│   │   │   │   │   └── customer-invoice.service.ts
│   │   │   │   ├── customer-invoice-items/
│   │   │   │   │   ├── dto/
│   │   │   │   │   │   ├── create-customer-invoice-items.dto.ts
│   │   │   │   │   │   ├── filter-customer-invoice-items.dto.ts
│   │   │   │   │   │   └── update-customer-invoice-items.dto.ts
│   │   │   │   │   ├── entities/
│   │   │   │   │   │   └── customer-invoice-items.entity.ts
│   │   │   │   │   ├── mappers/
│   │   │   │   │   │   └── customer-invoice-items.mapper.ts
│   │   │   │   │   ├── validators/
│   │   │   │   │   │   └── customer-invoice-items.validator.ts
│   │   │   │   │   ├── customer-invoice-items.controller.ts
│   │   │   │   │   ├── customer-invoice-items.module.ts
│   │   │   │   │   ├── customer-invoice-items.repository.ts
│   │   │   │   │   └── customer-invoice-items.service.ts
│   │   │   │   ├── fuel-log/
│   │   │   │   │   ├── dto/
│   │   │   │   │   │   ├── create-fuel-log.dto.ts
│   │   │   │   │   │   ├── filter-fuel-log.dto.ts
│   │   │   │   │   │   └── update-fuel-log.dto.ts
│   │   │   │   │   ├── entities/
│   │   │   │   │   │   └── fuel-log.entity.ts
│   │   │   │   │   ├── mappers/
│   │   │   │   │   │   └── fuel-log.mapper.ts
│   │   │   │   │   ├── validators/
│   │   │   │   │   │   └── fuel-log.validator.ts
│   │   │   │   │   ├── fuel-log.controller.ts
│   │   │   │   │   ├── fuel-log.module.ts
│   │   │   │   │   ├── fuel-log.repository.ts
│   │   │   │   │   └── fuel-log.service.ts
│   │   │   │   ├── loader-expense/
│   │   │   │   │   ├── dto/
│   │   │   │   │   │   ├── create-loader-expense.dto.ts
│   │   │   │   │   │   ├── filter-loader-expense.dto.ts
│   │   │   │   │   │   └── update-loader-expense.dto.ts
│   │   │   │   │   ├── entities/
│   │   │   │   │   │   └── loader-expense.entity.ts
│   │   │   │   │   ├── mappers/
│   │   │   │   │   │   └── loader-expense.mapper.ts
│   │   │   │   │   ├── validators/
│   │   │   │   │   │   └── loader-expense.validator.ts
│   │   │   │   │   ├── loader-expense.controller.ts
│   │   │   │   │   ├── loader-expense.module.ts
│   │   │   │   │   ├── loader-expense.repository.ts
│   │   │   │   │   └── loader-expense.service.ts
│   │   │   │   ├── vendor-voucher/
│   │   │   │   │   ├── dto/
│   │   │   │   │   │   ├── create-vendor-voucher.dto.ts
│   │   │   │   │   │   ├── filter-vendor-voucher.dto.ts
│   │   │   │   │   │   └── update-vendor-voucher.dto.ts
│   │   │   │   │   ├── entities/
│   │   │   │   │   │   └── vendor-voucher.entity.ts
│   │   │   │   │   ├── mappers/
│   │   │   │   │   │   └── vendor-voucher.mapper.ts
│   │   │   │   │   ├── validators/
│   │   │   │   │   │   └── vendor-voucher.validator.ts
│   │   │   │   │   ├── vendor-voucher.controller.ts
│   │   │   │   │   ├── vendor-voucher.module.ts
│   │   │   │   │   ├── vendor-voucher.repository.ts
│   │   │   │   │   └── vendor-voucher.service.ts
│   │   │   │   ├── vendor-voucher-items/
│   │   │   │   │   ├── dto/
│   │   │   │   │   │   ├── create-vendor-voucher-items.dto.ts
│   │   │   │   │   │   ├── filter-vendor-voucher-items.dto.ts
│   │   │   │   │   │   └── update-vendor-voucher-items.dto.ts
│   │   │   │   │   ├── entities/
│   │   │   │   │   │   └── vendor-voucher-items.entity.ts
│   │   │   │   │   ├── mappers/
│   │   │   │   │   │   └── vendor-voucher-items.mapper.ts
│   │   │   │   │   ├── validators/
│   │   │   │   │   │   └── vendor-voucher-items.validator.ts
│   │   │   │   │   ├── vendor-voucher-items.controller.ts
│   │   │   │   │   ├── vendor-voucher-items.module.ts
│   │   │   │   │   ├── vendor-voucher-items.repository.ts
│   │   │   │   │   └── vendor-voucher-items.service.ts
│   │   │   │   └── finance.module.ts
│   │   │   ├── iam/
│   │   │   │   ├── auth/
│   │   │   │   │   ├── dto/
│   │   │   │   │   │   ├── login.dto.ts
│   │   │   │   │   │   ├── otp-request.dto.ts
│   │   │   │   │   │   ├── otp-verify.dto.ts
│   │   │   │   │   │   └── refresh.dto.ts
│   │   │   │   │   ├── strategies/
│   │   │   │   │   │   ├── jwt-refresh.strategy.ts
│   │   │   │   │   │   └── jwt.strategy.ts
│   │   │   │   │   ├── auth.controller.ts
│   │   │   │   │   ├── auth.module.ts
│   │   │   │   │   └── auth.service.ts
│   │   │   │   ├── departments/
│   │   │   │   │   ├── dto/
│   │   │   │   │   │   ├── create-departments.dto.ts
│   │   │   │   │   │   ├── filter-departments.dto.ts
│   │   │   │   │   │   └── update-departments.dto.ts
│   │   │   │   │   ├── entities/
│   │   │   │   │   │   └── departments.entity.ts
│   │   │   │   │   ├── mappers/
│   │   │   │   │   │   └── departments.mapper.ts
│   │   │   │   │   ├── validators/
│   │   │   │   │   │   └── departments.validator.ts
│   │   │   │   │   ├── departments.controller.ts
│   │   │   │   │   ├── departments.module.ts
│   │   │   │   │   ├── departments.repository.ts
│   │   │   │   │   └── departments.service.ts
│   │   │   │   ├── login-attempts/
│   │   │   │   │   ├── dto/
│   │   │   │   │   │   ├── create-login-attempts.dto.ts
│   │   │   │   │   │   ├── filter-login-attempts.dto.ts
│   │   │   │   │   │   └── update-login-attempts.dto.ts
│   │   │   │   │   ├── entities/
│   │   │   │   │   │   └── login-attempts.entity.ts
│   │   │   │   │   ├── mappers/
│   │   │   │   │   │   └── login-attempts.mapper.ts
│   │   │   │   │   ├── validators/
│   │   │   │   │   │   └── login-attempts.validator.ts
│   │   │   │   │   ├── login-attempts.controller.ts
│   │   │   │   │   ├── login-attempts.module.ts
│   │   │   │   │   ├── login-attempts.repository.ts
│   │   │   │   │   └── login-attempts.service.ts
│   │   │   │   ├── privileges/
│   │   │   │   │   ├── dto/
│   │   │   │   │   │   ├── create-privileges.dto.ts
│   │   │   │   │   │   ├── filter-privileges.dto.ts
│   │   │   │   │   │   └── update-privileges.dto.ts
│   │   │   │   │   ├── entities/
│   │   │   │   │   │   └── privileges.entity.ts
│   │   │   │   │   ├── mappers/
│   │   │   │   │   │   └── privileges.mapper.ts
│   │   │   │   │   ├── validators/
│   │   │   │   │   │   └── privileges.validator.ts
│   │   │   │   │   ├── privileges.controller.ts
│   │   │   │   │   ├── privileges.module.ts
│   │   │   │   │   ├── privileges.repository.ts
│   │   │   │   │   └── privileges.service.ts
│   │   │   │   ├── role-privileges/
│   │   │   │   │   ├── dto/
│   │   │   │   │   │   ├── create-role-privileges.dto.ts
│   │   │   │   │   │   ├── filter-role-privileges.dto.ts
│   │   │   │   │   │   └── update-role-privileges.dto.ts
│   │   │   │   │   ├── entities/
│   │   │   │   │   │   └── role-privileges.entity.ts
│   │   │   │   │   ├── mappers/
│   │   │   │   │   │   └── role-privileges.mapper.ts
│   │   │   │   │   ├── validators/
│   │   │   │   │   │   └── role-privileges.validator.ts
│   │   │   │   │   ├── role-privileges.controller.ts
│   │   │   │   │   ├── role-privileges.module.ts
│   │   │   │   │   ├── role-privileges.repository.ts
│   │   │   │   │   └── role-privileges.service.ts
│   │   │   │   ├── roles/
│   │   │   │   │   ├── dto/
│   │   │   │   │   │   ├── create-role.dto.ts
│   │   │   │   │   │   ├── filter-role.dto.ts
│   │   │   │   │   │   └── update-role.dto.ts
│   │   │   │   │   ├── entities/
│   │   │   │   │   │   └── role.entity.ts
│   │   │   │   │   ├── mappers/
│   │   │   │   │   │   └── role.mapper.ts
│   │   │   │   │   ├── validators/
│   │   │   │   │   │   └── role.validator.ts
│   │   │   │   │   ├── role.controller.ts
│   │   │   │   │   ├── role.module.ts
│   │   │   │   │   ├── role.repository.ts
│   │   │   │   │   └── role.service.ts
│   │   │   │   ├── security-events/
│   │   │   │   │   ├── dto/
│   │   │   │   │   │   ├── create-security-events.dto.ts
│   │   │   │   │   │   ├── filter-security-events.dto.ts
│   │   │   │   │   │   └── update-security-events.dto.ts
│   │   │   │   │   ├── entities/
│   │   │   │   │   │   └── security-events.entity.ts
│   │   │   │   │   ├── mappers/
│   │   │   │   │   │   └── security-events.mapper.ts
│   │   │   │   │   ├── validators/
│   │   │   │   │   │   └── security-events.validator.ts
│   │   │   │   │   ├── security-events.controller.ts
│   │   │   │   │   ├── security-events.module.ts
│   │   │   │   │   ├── security-events.repository.ts
│   │   │   │   │   └── security-events.service.ts
│   │   │   │   ├── sessions/
│   │   │   │   │   ├── dto/
│   │   │   │   │   │   ├── create-user-sessions.dto.ts
│   │   │   │   │   │   ├── filter-user-sessions.dto.ts
│   │   │   │   │   │   └── update-user-sessions.dto.ts
│   │   │   │   │   ├── entities/
│   │   │   │   │   │   └── user-sessions.entity.ts
│   │   │   │   │   ├── mappers/
│   │   │   │   │   │   └── user-sessions.mapper.ts
│   │   │   │   │   ├── validators/
│   │   │   │   │   │   └── user-sessions.validator.ts
│   │   │   │   │   ├── user-sessions.controller.ts
│   │   │   │   │   ├── user-sessions.module.ts
│   │   │   │   │   ├── user-sessions.repository.ts
│   │   │   │   │   └── user-sessions.service.ts
│   │   │   │   ├── user-otps/
│   │   │   │   │   ├── dto/
│   │   │   │   │   │   ├── create-user-otps.dto.ts
│   │   │   │   │   │   ├── filter-user-otps.dto.ts
│   │   │   │   │   │   └── update-user-otps.dto.ts
│   │   │   │   │   ├── entities/
│   │   │   │   │   │   └── user-otps.entity.ts
│   │   │   │   │   ├── mappers/
│   │   │   │   │   │   └── user-otps.mapper.ts
│   │   │   │   │   ├── validators/
│   │   │   │   │   │   └── user-otps.validator.ts
│   │   │   │   │   ├── user-otps.controller.ts
│   │   │   │   │   ├── user-otps.module.ts
│   │   │   │   │   ├── user-otps.repository.ts
│   │   │   │   │   └── user-otps.service.ts
│   │   │   │   ├── users/
│   │   │   │   │   ├── dto/
│   │   │   │   │   │   ├── create-users.dto.ts
│   │   │   │   │   │   ├── filter-users.dto.ts
│   │   │   │   │   │   └── update-users.dto.ts
│   │   │   │   │   ├── entities/
│   │   │   │   │   │   └── users.entity.ts
│   │   │   │   │   ├── mappers/
│   │   │   │   │   │   └── users.mapper.ts
│   │   │   │   │   ├── validators/
│   │   │   │   │   │   └── users.validator.ts
│   │   │   │   │   ├── users.controller.ts
│   │   │   │   │   ├── users.module.ts
│   │   │   │   │   ├── users.repository.ts
│   │   │   │   │   └── users.service.ts
│   │   │   │   └── iam.module.ts
│   │   │   ├── integrations/
│   │   │   │   ├── api-integration-logs/
│   │   │   │   │   ├── dto/
│   │   │   │   │   │   ├── create-api-integration-logs.dto.ts
│   │   │   │   │   │   ├── filter-api-integration-logs.dto.ts
│   │   │   │   │   │   └── update-api-integration-logs.dto.ts
│   │   │   │   │   ├── entities/
│   │   │   │   │   │   └── api-integration-logs.entity.ts
│   │   │   │   │   ├── mappers/
│   │   │   │   │   │   └── api-integration-logs.mapper.ts
│   │   │   │   │   ├── validators/
│   │   │   │   │   │   └── api-integration-logs.validator.ts
│   │   │   │   │   ├── api-integration-logs.controller.ts
│   │   │   │   │   ├── api-integration-logs.module.ts
│   │   │   │   │   ├── api-integration-logs.repository.ts
│   │   │   │   │   └── api-integration-logs.service.ts
│   │   │   │   ├── api-integrations/
│   │   │   │   │   ├── dto/
│   │   │   │   │   │   ├── create-api-integrations.dto.ts
│   │   │   │   │   │   ├── filter-api-integrations.dto.ts
│   │   │   │   │   │   └── update-api-integrations.dto.ts
│   │   │   │   │   ├── entities/
│   │   │   │   │   │   └── api-integrations.entity.ts
│   │   │   │   │   ├── mappers/
│   │   │   │   │   │   └── api-integrations.mapper.ts
│   │   │   │   │   ├── validators/
│   │   │   │   │   │   └── api-integrations.validator.ts
│   │   │   │   │   ├── api-integrations.controller.ts
│   │   │   │   │   ├── api-integrations.module.ts
│   │   │   │   │   ├── api-integrations.repository.ts
│   │   │   │   │   └── api-integrations.service.ts
│   │   │   │   ├── api-provider-config/
│   │   │   │   │   ├── dto/
│   │   │   │   │   │   ├── create-api-provider-config.dto.ts
│   │   │   │   │   │   ├── filter-api-provider-config.dto.ts
│   │   │   │   │   │   └── update-api-provider-config.dto.ts
│   │   │   │   │   ├── entities/
│   │   │   │   │   │   └── api-provider-config.entity.ts
│   │   │   │   │   ├── mappers/
│   │   │   │   │   │   └── api-provider-config.mapper.ts
│   │   │   │   │   ├── validators/
│   │   │   │   │   │   └── api-provider-config.validator.ts
│   │   │   │   │   ├── api-provider-config.controller.ts
│   │   │   │   │   ├── api-provider-config.module.ts
│   │   │   │   │   ├── api-provider-config.repository.ts
│   │   │   │   │   └── api-provider-config.service.ts
│   │   │   │   ├── sync-jobs/
│   │   │   │   │   ├── dto/
│   │   │   │   │   │   ├── create-api-sync-jobs.dto.ts
│   │   │   │   │   │   ├── filter-api-sync-jobs.dto.ts
│   │   │   │   │   │   └── update-api-sync-jobs.dto.ts
│   │   │   │   │   ├── entities/
│   │   │   │   │   │   └── api-sync-jobs.entity.ts
│   │   │   │   │   ├── mappers/
│   │   │   │   │   │   └── api-sync-jobs.mapper.ts
│   │   │   │   │   ├── validators/
│   │   │   │   │   │   └── api-sync-jobs.validator.ts
│   │   │   │   │   ├── api-sync-jobs.controller.ts
│   │   │   │   │   ├── api-sync-jobs.module.ts
│   │   │   │   │   ├── api-sync-jobs.repository.ts
│   │   │   │   │   └── api-sync-jobs.service.ts
│   │   │   │   ├── webhook-configs/
│   │   │   │   │   ├── dto/
│   │   │   │   │   │   ├── create-webhook-configs.dto.ts
│   │   │   │   │   │   ├── filter-webhook-configs.dto.ts
│   │   │   │   │   │   └── update-webhook-configs.dto.ts
│   │   │   │   │   ├── entities/
│   │   │   │   │   │   └── webhook-configs.entity.ts
│   │   │   │   │   ├── mappers/
│   │   │   │   │   │   └── webhook-configs.mapper.ts
│   │   │   │   │   ├── validators/
│   │   │   │   │   │   └── webhook-configs.validator.ts
│   │   │   │   │   ├── webhook-configs.controller.ts
│   │   │   │   │   ├── webhook-configs.module.ts
│   │   │   │   │   ├── webhook-configs.repository.ts
│   │   │   │   │   └── webhook-configs.service.ts
│   │   │   │   ├── webhook-log-store/
│   │   │   │   │   ├── dto/
│   │   │   │   │   │   ├── create-webhook-logs.dto.ts
│   │   │   │   │   │   ├── filter-webhook-logs.dto.ts
│   │   │   │   │   │   └── update-webhook-logs.dto.ts
│   │   │   │   │   ├── entities/
│   │   │   │   │   │   └── webhook-logs.entity.ts
│   │   │   │   │   ├── mappers/
│   │   │   │   │   │   └── webhook-logs.mapper.ts
│   │   │   │   │   ├── validators/
│   │   │   │   │   │   └── webhook-logs.validator.ts
│   │   │   │   │   ├── webhook-logs.controller.ts
│   │   │   │   │   ├── webhook-logs.module.ts
│   │   │   │   │   ├── webhook-logs.repository.ts
│   │   │   │   │   └── webhook-logs.service.ts
│   │   │   │   ├── webhook-logs/
│   │   │   │   │   ├── dto/
│   │   │   │   │   │   ├── create-api-webhook-logs.dto.ts
│   │   │   │   │   │   ├── filter-api-webhook-logs.dto.ts
│   │   │   │   │   │   └── update-api-webhook-logs.dto.ts
│   │   │   │   │   ├── entities/
│   │   │   │   │   │   └── api-webhook-logs.entity.ts
│   │   │   │   │   ├── mappers/
│   │   │   │   │   │   └── api-webhook-logs.mapper.ts
│   │   │   │   │   ├── validators/
│   │   │   │   │   │   └── api-webhook-logs.validator.ts
│   │   │   │   │   ├── api-webhook-logs.controller.ts
│   │   │   │   │   ├── api-webhook-logs.module.ts
│   │   │   │   │   ├── api-webhook-logs.repository.ts
│   │   │   │   │   └── api-webhook-logs.service.ts
│   │   │   │   └── integrations.module.ts
│   │   │   ├── masters/
│   │   │   │   ├── channel-partner/
│   │   │   │   │   ├── dto/
│   │   │   │   │   │   ├── create-channel-partner.dto.ts
│   │   │   │   │   │   ├── filter-channel-partner.dto.ts
│   │   │   │   │   │   └── update-channel-partner.dto.ts
│   │   │   │   │   ├── entities/
│   │   │   │   │   │   └── channel-partner.entity.ts
│   │   │   │   │   ├── mappers/
│   │   │   │   │   │   └── channel-partner.mapper.ts
│   │   │   │   │   ├── validators/
│   │   │   │   │   │   └── channel-partner.validator.ts
│   │   │   │   │   ├── channel-partner.controller.ts
│   │   │   │   │   ├── channel-partner.module.ts
│   │   │   │   │   ├── channel-partner.repository.ts
│   │   │   │   │   └── channel-partner.service.ts
│   │   │   │   ├── company/
│   │   │   │   │   ├── dto/
│   │   │   │   │   │   ├── create-company.dto.ts
│   │   │   │   │   │   ├── filter-company.dto.ts
│   │   │   │   │   │   └── update-company.dto.ts
│   │   │   │   │   ├── entities/
│   │   │   │   │   │   └── company.entity.ts
│   │   │   │   │   ├── mappers/
│   │   │   │   │   │   └── company.mapper.ts
│   │   │   │   │   ├── validators/
│   │   │   │   │   │   └── company.validator.ts
│   │   │   │   │   ├── company.controller.ts
│   │   │   │   │   ├── company.module.ts
│   │   │   │   │   ├── company.repository.ts
│   │   │   │   │   └── company.service.ts
│   │   │   │   ├── contract/
│   │   │   │   │   ├── dto/
│   │   │   │   │   │   ├── create-cust-contract.dto.ts
│   │   │   │   │   │   ├── filter-cust-contract.dto.ts
│   │   │   │   │   │   └── update-cust-contract.dto.ts
│   │   │   │   │   ├── entities/
│   │   │   │   │   │   └── cust-contract.entity.ts
│   │   │   │   │   ├── mappers/
│   │   │   │   │   │   └── cust-contract.mapper.ts
│   │   │   │   │   ├── validators/
│   │   │   │   │   │   └── cust-contract.validator.ts
│   │   │   │   │   ├── cust-contract.controller.ts
│   │   │   │   │   ├── cust-contract.module.ts
│   │   │   │   │   ├── cust-contract.repository.ts
│   │   │   │   │   └── cust-contract.service.ts
│   │   │   │   ├── contract-excess-weight/
│   │   │   │   │   ├── dto/
│   │   │   │   │   │   ├── create-cust-contract-excess-weight.dto.ts
│   │   │   │   │   │   ├── filter-cust-contract-excess-weight.dto.ts
│   │   │   │   │   │   └── update-cust-contract-excess-weight.dto.ts
│   │   │   │   │   ├── entities/
│   │   │   │   │   │   └── cust-contract-excess-weight.entity.ts
│   │   │   │   │   ├── mappers/
│   │   │   │   │   │   └── cust-contract-excess-weight.mapper.ts
│   │   │   │   │   ├── validators/
│   │   │   │   │   │   └── cust-contract-excess-weight.validator.ts
│   │   │   │   │   ├── cust-contract-excess-weight.controller.ts
│   │   │   │   │   ├── cust-contract-excess-weight.module.ts
│   │   │   │   │   ├── cust-contract-excess-weight.repository.ts
│   │   │   │   │   └── cust-contract-excess-weight.service.ts
│   │   │   │   ├── contract-oda-charges/
│   │   │   │   │   ├── dto/
│   │   │   │   │   │   ├── create-cust-contract-oda-charges.dto.ts
│   │   │   │   │   │   ├── filter-cust-contract-oda-charges.dto.ts
│   │   │   │   │   │   └── update-cust-contract-oda-charges.dto.ts
│   │   │   │   │   ├── entities/
│   │   │   │   │   │   └── cust-contract-oda-charges.entity.ts
│   │   │   │   │   ├── mappers/
│   │   │   │   │   │   └── cust-contract-oda-charges.mapper.ts
│   │   │   │   │   ├── validators/
│   │   │   │   │   │   └── cust-contract-oda-charges.validator.ts
│   │   │   │   │   ├── cust-contract-oda-charges.controller.ts
│   │   │   │   │   ├── cust-contract-oda-charges.module.ts
│   │   │   │   │   ├── cust-contract-oda-charges.repository.ts
│   │   │   │   │   └── cust-contract-oda-charges.service.ts
│   │   │   │   ├── contract-slab-definition/
│   │   │   │   │   ├── dto/
│   │   │   │   │   │   ├── create-cust-contract-slab-definition.dto.ts
│   │   │   │   │   │   ├── filter-cust-contract-slab-definition.dto.ts
│   │   │   │   │   │   └── update-cust-contract-slab-definition.dto.ts
│   │   │   │   │   ├── entities/
│   │   │   │   │   │   └── cust-contract-slab-definition.entity.ts
│   │   │   │   │   ├── mappers/
│   │   │   │   │   │   └── cust-contract-slab-definition.mapper.ts
│   │   │   │   │   ├── validators/
│   │   │   │   │   │   └── cust-contract-slab-definition.validator.ts
│   │   │   │   │   ├── cust-contract-slab-definition.controller.ts
│   │   │   │   │   ├── cust-contract-slab-definition.module.ts
│   │   │   │   │   ├── cust-contract-slab-definition.repository.ts
│   │   │   │   │   └── cust-contract-slab-definition.service.ts
│   │   │   │   ├── contract-slab-rates/
│   │   │   │   │   ├── dto/
│   │   │   │   │   │   ├── create-cust-contract-slab-rates.dto.ts
│   │   │   │   │   │   ├── filter-cust-contract-slab-rates.dto.ts
│   │   │   │   │   │   └── update-cust-contract-slab-rates.dto.ts
│   │   │   │   │   ├── entities/
│   │   │   │   │   │   └── cust-contract-slab-rates.entity.ts
│   │   │   │   │   ├── mappers/
│   │   │   │   │   │   └── cust-contract-slab-rates.mapper.ts
│   │   │   │   │   ├── validators/
│   │   │   │   │   │   └── cust-contract-slab-rates.validator.ts
│   │   │   │   │   ├── cust-contract-slab-rates.controller.ts
│   │   │   │   │   ├── cust-contract-slab-rates.module.ts
│   │   │   │   │   ├── cust-contract-slab-rates.repository.ts
│   │   │   │   │   └── cust-contract-slab-rates.service.ts
│   │   │   │   ├── cp-kyc/
│   │   │   │   │   ├── dto/
│   │   │   │   │   │   ├── create-cp-kyc.dto.ts
│   │   │   │   │   │   ├── filter-cp-kyc.dto.ts
│   │   │   │   │   │   └── update-cp-kyc.dto.ts
│   │   │   │   │   ├── entities/
│   │   │   │   │   │   └── cp-kyc.entity.ts
│   │   │   │   │   ├── mappers/
│   │   │   │   │   │   └── cp-kyc.mapper.ts
│   │   │   │   │   ├── validators/
│   │   │   │   │   │   └── cp-kyc.validator.ts
│   │   │   │   │   ├── cp-kyc.controller.ts
│   │   │   │   │   ├── cp-kyc.module.ts
│   │   │   │   │   ├── cp-kyc.repository.ts
│   │   │   │   │   └── cp-kyc.service.ts
│   │   │   │   ├── customer/
│   │   │   │   │   ├── dto/
│   │   │   │   │   │   ├── create-customer.dto.ts
│   │   │   │   │   │   ├── filter-customer.dto.ts
│   │   │   │   │   │   └── update-customer.dto.ts
│   │   │   │   │   ├── entities/
│   │   │   │   │   │   └── customer.entity.ts
│   │   │   │   │   ├── mappers/
│   │   │   │   │   │   └── customer.mapper.ts
│   │   │   │   │   ├── validators/
│   │   │   │   │   │   └── customer.validator.ts
│   │   │   │   │   ├── customer.controller.ts
│   │   │   │   │   ├── customer.module.ts
│   │   │   │   │   ├── customer.repository.ts
│   │   │   │   │   └── customer.service.ts
│   │   │   │   ├── driver/
│   │   │   │   │   ├── dto/
│   │   │   │   │   │   ├── create-driver.dto.ts
│   │   │   │   │   │   ├── filter-driver.dto.ts
│   │   │   │   │   │   └── update-driver.dto.ts
│   │   │   │   │   ├── entities/
│   │   │   │   │   │   └── driver.entity.ts
│   │   │   │   │   ├── mappers/
│   │   │   │   │   │   └── driver.mapper.ts
│   │   │   │   │   ├── validators/
│   │   │   │   │   │   └── driver.validator.ts
│   │   │   │   │   ├── driver.controller.ts
│   │   │   │   │   ├── driver.module.ts
│   │   │   │   │   ├── driver.repository.ts
│   │   │   │   │   └── driver.service.ts
│   │   │   │   ├── driver-rate/
│   │   │   │   │   ├── dto/
│   │   │   │   │   │   ├── create-driver-rate.dto.ts
│   │   │   │   │   │   ├── filter-driver-rate.dto.ts
│   │   │   │   │   │   └── update-driver-rate.dto.ts
│   │   │   │   │   ├── entities/
│   │   │   │   │   │   └── driver-rate.entity.ts
│   │   │   │   │   ├── mappers/
│   │   │   │   │   │   └── driver-rate.mapper.ts
│   │   │   │   │   ├── validators/
│   │   │   │   │   │   └── driver-rate.validator.ts
│   │   │   │   │   ├── driver-rate.controller.ts
│   │   │   │   │   ├── driver-rate.module.ts
│   │   │   │   │   ├── driver-rate.repository.ts
│   │   │   │   │   └── driver-rate.service.ts
│   │   │   │   ├── geo/
│   │   │   │   │   ├── dto/
│   │   │   │   │   │   ├── create-geo-hierarchy.dto.ts
│   │   │   │   │   │   ├── filter-geo-hierarchy.dto.ts
│   │   │   │   │   │   └── update-geo-hierarchy.dto.ts
│   │   │   │   │   ├── entities/
│   │   │   │   │   │   └── geo-hierarchy.entity.ts
│   │   │   │   │   ├── mappers/
│   │   │   │   │   │   └── geo-hierarchy.mapper.ts
│   │   │   │   │   ├── validators/
│   │   │   │   │   │   └── geo-hierarchy.validator.ts
│   │   │   │   │   ├── geo-hierarchy.controller.ts
│   │   │   │   │   ├── geo-hierarchy.module.ts
│   │   │   │   │   ├── geo-hierarchy.repository.ts
│   │   │   │   │   └── geo-hierarchy.service.ts
│   │   │   │   ├── loader-rate/
│   │   │   │   │   ├── dto/
│   │   │   │   │   │   ├── create-loader-rate.dto.ts
│   │   │   │   │   │   ├── filter-loader-rate.dto.ts
│   │   │   │   │   │   └── update-loader-rate.dto.ts
│   │   │   │   │   ├── entities/
│   │   │   │   │   │   └── loader-rate.entity.ts
│   │   │   │   │   ├── mappers/
│   │   │   │   │   │   └── loader-rate.mapper.ts
│   │   │   │   │   ├── validators/
│   │   │   │   │   │   └── loader-rate.validator.ts
│   │   │   │   │   ├── loader-rate.controller.ts
│   │   │   │   │   ├── loader-rate.module.ts
│   │   │   │   │   ├── loader-rate.repository.ts
│   │   │   │   │   └── loader-rate.service.ts
│   │   │   │   ├── office/
│   │   │   │   │   ├── dto/
│   │   │   │   │   │   ├── create-office.dto.ts
│   │   │   │   │   │   ├── filter-office.dto.ts
│   │   │   │   │   │   └── update-office.dto.ts
│   │   │   │   │   ├── entities/
│   │   │   │   │   │   └── office.entity.ts
│   │   │   │   │   ├── mappers/
│   │   │   │   │   │   └── office.mapper.ts
│   │   │   │   │   ├── validators/
│   │   │   │   │   │   └── office.validator.ts
│   │   │   │   │   ├── office.controller.ts
│   │   │   │   │   ├── office.module.ts
│   │   │   │   │   ├── office.repository.ts
│   │   │   │   │   └── office.service.ts
│   │   │   │   ├── station-coverage/
│   │   │   │   │   ├── dto/
│   │   │   │   │   │   ├── create-station-coverage.dto.ts
│   │   │   │   │   │   ├── filter-station-coverage.dto.ts
│   │   │   │   │   │   └── update-station-coverage.dto.ts
│   │   │   │   │   ├── entities/
│   │   │   │   │   │   └── station-coverage.entity.ts
│   │   │   │   │   ├── mappers/
│   │   │   │   │   │   └── station-coverage.mapper.ts
│   │   │   │   │   ├── validators/
│   │   │   │   │   │   └── station-coverage.validator.ts
│   │   │   │   │   ├── station-coverage.controller.ts
│   │   │   │   │   ├── station-coverage.module.ts
│   │   │   │   │   ├── station-coverage.repository.ts
│   │   │   │   │   └── station-coverage.service.ts
│   │   │   │   ├── vehicle/
│   │   │   │   │   ├── dto/
│   │   │   │   │   │   ├── create-vehicles.dto.ts
│   │   │   │   │   │   ├── filter-vehicles.dto.ts
│   │   │   │   │   │   └── update-vehicles.dto.ts
│   │   │   │   │   ├── entities/
│   │   │   │   │   │   └── vehicles.entity.ts
│   │   │   │   │   ├── mappers/
│   │   │   │   │   │   └── vehicles.mapper.ts
│   │   │   │   │   ├── validators/
│   │   │   │   │   │   └── vehicles.validator.ts
│   │   │   │   │   ├── vehicles.controller.ts
│   │   │   │   │   ├── vehicles.module.ts
│   │   │   │   │   ├── vehicles.repository.ts
│   │   │   │   │   └── vehicles.service.ts
│   │   │   │   ├── vendor/
│   │   │   │   │   ├── dto/
│   │   │   │   │   │   ├── create-vendor.dto.ts
│   │   │   │   │   │   ├── filter-vendor.dto.ts
│   │   │   │   │   │   └── update-vendor.dto.ts
│   │   │   │   │   ├── entities/
│   │   │   │   │   │   └── vendor.entity.ts
│   │   │   │   │   ├── mappers/
│   │   │   │   │   │   └── vendor.mapper.ts
│   │   │   │   │   ├── validators/
│   │   │   │   │   │   └── vendor.validator.ts
│   │   │   │   │   ├── vendor.controller.ts
│   │   │   │   │   ├── vendor.module.ts
│   │   │   │   │   ├── vendor.repository.ts
│   │   │   │   │   └── vendor.service.ts
│   │   │   │   ├── vendor-kyc/
│   │   │   │   │   ├── dto/
│   │   │   │   │   │   ├── create-vendor-kyc.dto.ts
│   │   │   │   │   │   ├── filter-vendor-kyc.dto.ts
│   │   │   │   │   │   └── update-vendor-kyc.dto.ts
│   │   │   │   │   ├── entities/
│   │   │   │   │   │   └── vendor-kyc.entity.ts
│   │   │   │   │   ├── mappers/
│   │   │   │   │   │   └── vendor-kyc.mapper.ts
│   │   │   │   │   ├── validators/
│   │   │   │   │   │   └── vendor-kyc.validator.ts
│   │   │   │   │   ├── vendor-kyc.controller.ts
│   │   │   │   │   ├── vendor-kyc.module.ts
│   │   │   │   │   ├── vendor-kyc.repository.ts
│   │   │   │   │   └── vendor-kyc.service.ts
│   │   │   │   ├── workflow-master/
│   │   │   │   │   ├── dto/
│   │   │   │   │   │   ├── create-workflow-master.dto.ts
│   │   │   │   │   │   ├── filter-workflow-master.dto.ts
│   │   │   │   │   │   └── update-workflow-master.dto.ts
│   │   │   │   │   ├── entities/
│   │   │   │   │   │   └── workflow-master.entity.ts
│   │   │   │   │   ├── mappers/
│   │   │   │   │   │   └── workflow-master.mapper.ts
│   │   │   │   │   ├── validators/
│   │   │   │   │   │   └── workflow-master.validator.ts
│   │   │   │   │   ├── workflow-master.controller.ts
│   │   │   │   │   ├── workflow-master.module.ts
│   │   │   │   │   ├── workflow-master.repository.ts
│   │   │   │   │   └── workflow-master.service.ts
│   │   │   │   └── masters.module.ts
│   │   │   ├── notifications/
│   │   │   │   ├── logs/
│   │   │   │   │   ├── dto/
│   │   │   │   │   │   ├── create-notification-logs.dto.ts
│   │   │   │   │   │   ├── filter-notification-logs.dto.ts
│   │   │   │   │   │   └── update-notification-logs.dto.ts
│   │   │   │   │   ├── entities/
│   │   │   │   │   │   └── notification-logs.entity.ts
│   │   │   │   │   ├── mappers/
│   │   │   │   │   │   └── notification-logs.mapper.ts
│   │   │   │   │   ├── validators/
│   │   │   │   │   │   └── notification-logs.validator.ts
│   │   │   │   │   ├── notification-logs.controller.ts
│   │   │   │   │   ├── notification-logs.module.ts
│   │   │   │   │   ├── notification-logs.repository.ts
│   │   │   │   │   └── notification-logs.service.ts
│   │   │   │   ├── queue/
│   │   │   │   │   ├── dto/
│   │   │   │   │   │   ├── create-notification-queue.dto.ts
│   │   │   │   │   │   ├── filter-notification-queue.dto.ts
│   │   │   │   │   │   └── update-notification-queue.dto.ts
│   │   │   │   │   ├── entities/
│   │   │   │   │   │   └── notification-queue.entity.ts
│   │   │   │   │   ├── mappers/
│   │   │   │   │   │   └── notification-queue.mapper.ts
│   │   │   │   │   ├── validators/
│   │   │   │   │   │   └── notification-queue.validator.ts
│   │   │   │   │   ├── notification-queue.controller.ts
│   │   │   │   │   ├── notification-queue.module.ts
│   │   │   │   │   ├── notification-queue.repository.ts
│   │   │   │   │   └── notification-queue.service.ts
│   │   │   │   ├── templates/
│   │   │   │   │   ├── dto/
│   │   │   │   │   │   ├── create-notification-templates.dto.ts
│   │   │   │   │   │   ├── filter-notification-templates.dto.ts
│   │   │   │   │   │   └── update-notification-templates.dto.ts
│   │   │   │   │   ├── entities/
│   │   │   │   │   │   └── notification-templates.entity.ts
│   │   │   │   │   ├── mappers/
│   │   │   │   │   │   └── notification-templates.mapper.ts
│   │   │   │   │   ├── validators/
│   │   │   │   │   │   └── notification-templates.validator.ts
│   │   │   │   │   ├── notification-templates.controller.ts
│   │   │   │   │   ├── notification-templates.module.ts
│   │   │   │   │   ├── notification-templates.repository.ts
│   │   │   │   │   └── notification-templates.service.ts
│   │   │   │   └── notifications.module.ts
│   │   │   ├── operations/
│   │   │   │   ├── booking/
│   │   │   │   │   ├── dto/
│   │   │   │   │   │   ├── create-booking.dto.ts
│   │   │   │   │   │   ├── filter-booking.dto.ts
│   │   │   │   │   │   └── update-booking.dto.ts
│   │   │   │   │   ├── entities/
│   │   │   │   │   │   └── booking.entity.ts
│   │   │   │   │   ├── mappers/
│   │   │   │   │   │   └── booking.mapper.ts
│   │   │   │   │   ├── validators/
│   │   │   │   │   │   └── booking.validator.ts
│   │   │   │   │   ├── booking.controller.ts
│   │   │   │   │   ├── booking.module.ts
│   │   │   │   │   ├── booking.repository.ts
│   │   │   │   │   └── booking.service.ts
│   │   │   │   ├── booking-charges/
│   │   │   │   │   ├── dto/
│   │   │   │   │   │   ├── create-booking-charges.dto.ts
│   │   │   │   │   │   ├── filter-booking-charges.dto.ts
│   │   │   │   │   │   └── update-booking-charges.dto.ts
│   │   │   │   │   ├── entities/
│   │   │   │   │   │   └── booking-charges.entity.ts
│   │   │   │   │   ├── mappers/
│   │   │   │   │   │   └── booking-charges.mapper.ts
│   │   │   │   │   ├── validators/
│   │   │   │   │   │   └── booking-charges.validator.ts
│   │   │   │   │   ├── booking-charges.controller.ts
│   │   │   │   │   ├── booking-charges.module.ts
│   │   │   │   │   ├── booking-charges.repository.ts
│   │   │   │   │   └── booking-charges.service.ts
│   │   │   │   ├── booking-items/
│   │   │   │   │   ├── dto/
│   │   │   │   │   │   ├── create-booking-items.dto.ts
│   │   │   │   │   │   ├── filter-booking-items.dto.ts
│   │   │   │   │   │   └── update-booking-items.dto.ts
│   │   │   │   │   ├── entities/
│   │   │   │   │   │   └── booking-items.entity.ts
│   │   │   │   │   ├── mappers/
│   │   │   │   │   │   └── booking-items.mapper.ts
│   │   │   │   │   ├── validators/
│   │   │   │   │   │   └── booking-items.validator.ts
│   │   │   │   │   ├── booking-items.controller.ts
│   │   │   │   │   ├── booking-items.module.ts
│   │   │   │   │   ├── booking-items.repository.ts
│   │   │   │   │   └── booking-items.service.ts
│   │   │   │   ├── driver-tasks/
│   │   │   │   │   ├── dto/
│   │   │   │   │   │   ├── create-driver-tasks.dto.ts
│   │   │   │   │   │   ├── filter-driver-tasks.dto.ts
│   │   │   │   │   │   └── update-driver-tasks.dto.ts
│   │   │   │   │   ├── entities/
│   │   │   │   │   │   └── driver-tasks.entity.ts
│   │   │   │   │   ├── mappers/
│   │   │   │   │   │   └── driver-tasks.mapper.ts
│   │   │   │   │   ├── validators/
│   │   │   │   │   │   └── driver-tasks.validator.ts
│   │   │   │   │   ├── driver-tasks.controller.ts
│   │   │   │   │   ├── driver-tasks.module.ts
│   │   │   │   │   ├── driver-tasks.repository.ts
│   │   │   │   │   └── driver-tasks.service.ts
│   │   │   │   ├── drs/
│   │   │   │   │   ├── dto/
│   │   │   │   │   │   ├── create-drs.dto.ts
│   │   │   │   │   │   ├── filter-drs.dto.ts
│   │   │   │   │   │   └── update-drs.dto.ts
│   │   │   │   │   ├── entities/
│   │   │   │   │   │   └── drs.entity.ts
│   │   │   │   │   ├── mappers/
│   │   │   │   │   │   └── drs.mapper.ts
│   │   │   │   │   ├── validators/
│   │   │   │   │   │   └── drs.validator.ts
│   │   │   │   │   ├── drs.controller.ts
│   │   │   │   │   ├── drs.module.ts
│   │   │   │   │   ├── drs.repository.ts
│   │   │   │   │   └── drs.service.ts
│   │   │   │   ├── drs-lrs/
│   │   │   │   │   ├── dto/
│   │   │   │   │   │   ├── create-drs-lrs.dto.ts
│   │   │   │   │   │   ├── filter-drs-lrs.dto.ts
│   │   │   │   │   │   └── update-drs-lrs.dto.ts
│   │   │   │   │   ├── entities/
│   │   │   │   │   │   └── drs-lrs.entity.ts
│   │   │   │   │   ├── mappers/
│   │   │   │   │   │   └── drs-lrs.mapper.ts
│   │   │   │   │   ├── validators/
│   │   │   │   │   │   └── drs-lrs.validator.ts
│   │   │   │   │   ├── drs-lrs.controller.ts
│   │   │   │   │   ├── drs-lrs.module.ts
│   │   │   │   │   ├── drs-lrs.repository.ts
│   │   │   │   │   └── drs-lrs.service.ts
│   │   │   │   ├── ewaybill/
│   │   │   │   │   ├── dto/
│   │   │   │   │   │   ├── create-ewaybill.dto.ts
│   │   │   │   │   │   ├── filter-ewaybill.dto.ts
│   │   │   │   │   │   └── update-ewaybill.dto.ts
│   │   │   │   │   ├── entities/
│   │   │   │   │   │   └── ewaybill.entity.ts
│   │   │   │   │   ├── mappers/
│   │   │   │   │   │   └── ewaybill.mapper.ts
│   │   │   │   │   ├── validators/
│   │   │   │   │   │   └── ewaybill.validator.ts
│   │   │   │   │   ├── ewaybill.controller.ts
│   │   │   │   │   ├── ewaybill.module.ts
│   │   │   │   │   ├── ewaybill.repository.ts
│   │   │   │   │   └── ewaybill.service.ts
│   │   │   │   ├── lr/
│   │   │   │   │   ├── dto/
│   │   │   │   │   │   ├── create-lr.dto.ts
│   │   │   │   │   │   ├── filter-lr.dto.ts
│   │   │   │   │   │   └── update-lr.dto.ts
│   │   │   │   │   ├── entities/
│   │   │   │   │   │   └── lr.entity.ts
│   │   │   │   │   ├── mappers/
│   │   │   │   │   │   └── lr.mapper.ts
│   │   │   │   │   ├── validators/
│   │   │   │   │   │   └── lr.validator.ts
│   │   │   │   │   ├── lr.controller.ts
│   │   │   │   │   ├── lr.module.ts
│   │   │   │   │   ├── lr.repository.ts
│   │   │   │   │   └── lr.service.ts
│   │   │   │   ├── lr-state-log/
│   │   │   │   │   ├── dto/
│   │   │   │   │   │   ├── create-lr-state-log.dto.ts
│   │   │   │   │   │   ├── filter-lr-state-log.dto.ts
│   │   │   │   │   │   └── update-lr-state-log.dto.ts
│   │   │   │   │   ├── entities/
│   │   │   │   │   │   └── lr-state-log.entity.ts
│   │   │   │   │   ├── mappers/
│   │   │   │   │   │   └── lr-state-log.mapper.ts
│   │   │   │   │   ├── validators/
│   │   │   │   │   │   └── lr-state-log.validator.ts
│   │   │   │   │   ├── lr-state-log.controller.ts
│   │   │   │   │   ├── lr-state-log.module.ts
│   │   │   │   │   ├── lr-state-log.repository.ts
│   │   │   │   │   └── lr-state-log.service.ts
│   │   │   │   ├── manifest/
│   │   │   │   │   ├── dto/
│   │   │   │   │   │   ├── create-manifest.dto.ts
│   │   │   │   │   │   ├── filter-manifest.dto.ts
│   │   │   │   │   │   └── update-manifest.dto.ts
│   │   │   │   │   ├── entities/
│   │   │   │   │   │   └── manifest.entity.ts
│   │   │   │   │   ├── mappers/
│   │   │   │   │   │   └── manifest.mapper.ts
│   │   │   │   │   ├── validators/
│   │   │   │   │   │   └── manifest.validator.ts
│   │   │   │   │   ├── manifest.controller.ts
│   │   │   │   │   ├── manifest.module.ts
│   │   │   │   │   ├── manifest.repository.ts
│   │   │   │   │   └── manifest.service.ts
│   │   │   │   ├── manifest-lrs/
│   │   │   │   │   ├── dto/
│   │   │   │   │   │   ├── create-manifest-lrs.dto.ts
│   │   │   │   │   │   ├── filter-manifest-lrs.dto.ts
│   │   │   │   │   │   └── update-manifest-lrs.dto.ts
│   │   │   │   │   ├── entities/
│   │   │   │   │   │   └── manifest-lrs.entity.ts
│   │   │   │   │   ├── mappers/
│   │   │   │   │   │   └── manifest-lrs.mapper.ts
│   │   │   │   │   ├── validators/
│   │   │   │   │   │   └── manifest-lrs.validator.ts
│   │   │   │   │   ├── manifest-lrs.controller.ts
│   │   │   │   │   ├── manifest-lrs.module.ts
│   │   │   │   │   ├── manifest-lrs.repository.ts
│   │   │   │   │   └── manifest-lrs.service.ts
│   │   │   │   ├── pod/
│   │   │   │   │   ├── dto/
│   │   │   │   │   │   ├── create-pod.dto.ts
│   │   │   │   │   │   ├── filter-pod.dto.ts
│   │   │   │   │   │   └── update-pod.dto.ts
│   │   │   │   │   ├── entities/
│   │   │   │   │   │   └── pod.entity.ts
│   │   │   │   │   ├── mappers/
│   │   │   │   │   │   └── pod.mapper.ts
│   │   │   │   │   ├── validators/
│   │   │   │   │   │   └── pod.validator.ts
│   │   │   │   │   ├── pod.controller.ts
│   │   │   │   │   ├── pod.module.ts
│   │   │   │   │   ├── pod.repository.ts
│   │   │   │   │   └── pod.service.ts
│   │   │   │   ├── prn/
│   │   │   │   │   ├── dto/
│   │   │   │   │   │   ├── create-prn.dto.ts
│   │   │   │   │   │   ├── filter-prn.dto.ts
│   │   │   │   │   │   └── update-prn.dto.ts
│   │   │   │   │   ├── entities/
│   │   │   │   │   │   └── prn.entity.ts
│   │   │   │   │   ├── mappers/
│   │   │   │   │   │   └── prn.mapper.ts
│   │   │   │   │   ├── validators/
│   │   │   │   │   │   └── prn.validator.ts
│   │   │   │   │   ├── prn.controller.ts
│   │   │   │   │   ├── prn.module.ts
│   │   │   │   │   ├── prn.repository.ts
│   │   │   │   │   └── prn.service.ts
│   │   │   │   ├── prn-bookings/
│   │   │   │   │   ├── dto/
│   │   │   │   │   │   ├── create-prn-bookings.dto.ts
│   │   │   │   │   │   ├── filter-prn-bookings.dto.ts
│   │   │   │   │   │   └── update-prn-bookings.dto.ts
│   │   │   │   │   ├── entities/
│   │   │   │   │   │   └── prn-bookings.entity.ts
│   │   │   │   │   ├── mappers/
│   │   │   │   │   │   └── prn-bookings.mapper.ts
│   │   │   │   │   ├── validators/
│   │   │   │   │   │   └── prn-bookings.validator.ts
│   │   │   │   │   ├── prn-bookings.controller.ts
│   │   │   │   │   ├── prn-bookings.module.ts
│   │   │   │   │   ├── prn-bookings.repository.ts
│   │   │   │   │   └── prn-bookings.service.ts
│   │   │   │   ├── prn-lrs/
│   │   │   │   │   ├── dto/
│   │   │   │   │   │   ├── create-prn-lrs.dto.ts
│   │   │   │   │   │   ├── filter-prn-lrs.dto.ts
│   │   │   │   │   │   └── update-prn-lrs.dto.ts
│   │   │   │   │   ├── entities/
│   │   │   │   │   │   └── prn-lrs.entity.ts
│   │   │   │   │   ├── mappers/
│   │   │   │   │   │   └── prn-lrs.mapper.ts
│   │   │   │   │   ├── validators/
│   │   │   │   │   │   └── prn-lrs.validator.ts
│   │   │   │   │   ├── prn-lrs.controller.ts
│   │   │   │   │   ├── prn-lrs.module.ts
│   │   │   │   │   ├── prn-lrs.repository.ts
│   │   │   │   │   └── prn-lrs.service.ts
│   │   │   │   ├── route-master/
│   │   │   │   │   ├── dto/
│   │   │   │   │   │   ├── create-route-master.dto.ts
│   │   │   │   │   │   ├── filter-route-master.dto.ts
│   │   │   │   │   │   └── update-route-master.dto.ts
│   │   │   │   │   ├── entities/
│   │   │   │   │   │   └── route-master.entity.ts
│   │   │   │   │   ├── mappers/
│   │   │   │   │   │   └── route-master.mapper.ts
│   │   │   │   │   ├── validators/
│   │   │   │   │   │   └── route-master.validator.ts
│   │   │   │   │   ├── route-master.controller.ts
│   │   │   │   │   ├── route-master.module.ts
│   │   │   │   │   ├── route-master.repository.ts
│   │   │   │   │   └── route-master.service.ts
│   │   │   │   ├── route-stops/
│   │   │   │   │   ├── dto/
│   │   │   │   │   │   ├── create-route-stops.dto.ts
│   │   │   │   │   │   ├── filter-route-stops.dto.ts
│   │   │   │   │   │   └── update-route-stops.dto.ts
│   │   │   │   │   ├── entities/
│   │   │   │   │   │   └── route-stops.entity.ts
│   │   │   │   │   ├── mappers/
│   │   │   │   │   │   └── route-stops.mapper.ts
│   │   │   │   │   ├── validators/
│   │   │   │   │   │   └── route-stops.validator.ts
│   │   │   │   │   ├── route-stops.controller.ts
│   │   │   │   │   ├── route-stops.module.ts
│   │   │   │   │   ├── route-stops.repository.ts
│   │   │   │   │   └── route-stops.service.ts
│   │   │   │   ├── trip/
│   │   │   │   │   ├── dto/
│   │   │   │   │   │   ├── create-trip.dto.ts
│   │   │   │   │   │   ├── filter-trip.dto.ts
│   │   │   │   │   │   └── update-trip.dto.ts
│   │   │   │   │   ├── entities/
│   │   │   │   │   │   └── trip.entity.ts
│   │   │   │   │   ├── mappers/
│   │   │   │   │   │   └── trip.mapper.ts
│   │   │   │   │   ├── validators/
│   │   │   │   │   │   └── trip.validator.ts
│   │   │   │   │   ├── trip.controller.ts
│   │   │   │   │   ├── trip.module.ts
│   │   │   │   │   ├── trip.repository.ts
│   │   │   │   │   └── trip.service.ts
│   │   │   │   ├── trip-expenses/
│   │   │   │   │   ├── dto/
│   │   │   │   │   │   ├── create-trip-expenses.dto.ts
│   │   │   │   │   │   ├── filter-trip-expenses.dto.ts
│   │   │   │   │   │   └── update-trip-expenses.dto.ts
│   │   │   │   │   ├── entities/
│   │   │   │   │   │   └── trip-expenses.entity.ts
│   │   │   │   │   ├── mappers/
│   │   │   │   │   │   └── trip-expenses.mapper.ts
│   │   │   │   │   ├── validators/
│   │   │   │   │   │   └── trip-expenses.validator.ts
│   │   │   │   │   ├── trip-expenses.controller.ts
│   │   │   │   │   ├── trip-expenses.module.ts
│   │   │   │   │   ├── trip-expenses.repository.ts
│   │   │   │   │   └── trip-expenses.service.ts
│   │   │   │   ├── trip-lrs/
│   │   │   │   │   ├── dto/
│   │   │   │   │   │   ├── create-trip-lrs.dto.ts
│   │   │   │   │   │   ├── filter-trip-lrs.dto.ts
│   │   │   │   │   │   └── update-trip-lrs.dto.ts
│   │   │   │   │   ├── entities/
│   │   │   │   │   │   └── trip-lrs.entity.ts
│   │   │   │   │   ├── mappers/
│   │   │   │   │   │   └── trip-lrs.mapper.ts
│   │   │   │   │   ├── validators/
│   │   │   │   │   │   └── trip-lrs.validator.ts
│   │   │   │   │   ├── trip-lrs.controller.ts
│   │   │   │   │   ├── trip-lrs.module.ts
│   │   │   │   │   ├── trip-lrs.repository.ts
│   │   │   │   │   └── trip-lrs.service.ts
│   │   │   │   └── operations.module.ts
│   │   │   ├── tenant/
│   │   │   │   ├── currency/
│   │   │   │   │   ├── dto/
│   │   │   │   │   │   ├── create-currency.dto.ts
│   │   │   │   │   │   ├── filter-currency.dto.ts
│   │   │   │   │   │   └── update-currency.dto.ts
│   │   │   │   │   ├── entities/
│   │   │   │   │   │   └── currency.entity.ts
│   │   │   │   │   ├── mappers/
│   │   │   │   │   │   └── currency.mapper.ts
│   │   │   │   │   ├── validators/
│   │   │   │   │   │   └── currency.validator.ts
│   │   │   │   │   ├── currency.controller.ts
│   │   │   │   │   ├── currency.module.ts
│   │   │   │   │   ├── currency.repository.ts
│   │   │   │   │   └── currency.service.ts
│   │   │   │   ├── feature-flags/
│   │   │   │   │   ├── dto/
│   │   │   │   │   │   ├── create-feature-flags.dto.ts
│   │   │   │   │   │   ├── filter-feature-flags.dto.ts
│   │   │   │   │   │   └── update-feature-flags.dto.ts
│   │   │   │   │   ├── entities/
│   │   │   │   │   │   └── feature-flags.entity.ts
│   │   │   │   │   ├── mappers/
│   │   │   │   │   │   └── feature-flags.mapper.ts
│   │   │   │   │   ├── validators/
│   │   │   │   │   │   └── feature-flags.validator.ts
│   │   │   │   │   ├── feature-flags.controller.ts
│   │   │   │   │   ├── feature-flags.module.ts
│   │   │   │   │   ├── feature-flags.repository.ts
│   │   │   │   │   └── feature-flags.service.ts
│   │   │   │   ├── organizations/
│   │   │   │   │   ├── dto/
│   │   │   │   │   │   ├── create-organizations.dto.ts
│   │   │   │   │   │   ├── filter-organizations.dto.ts
│   │   │   │   │   │   └── update-organizations.dto.ts
│   │   │   │   │   ├── entities/
│   │   │   │   │   │   └── organizations.entity.ts
│   │   │   │   │   ├── mappers/
│   │   │   │   │   │   └── organizations.mapper.ts
│   │   │   │   │   ├── validators/
│   │   │   │   │   │   └── organizations.validator.ts
│   │   │   │   │   ├── organizations.controller.ts
│   │   │   │   │   ├── organizations.module.ts
│   │   │   │   │   ├── organizations.repository.ts
│   │   │   │   │   └── organizations.service.ts
│   │   │   │   ├── tenant/
│   │   │   │   │   ├── dto/
│   │   │   │   │   │   ├── create-tenant.dto.ts
│   │   │   │   │   │   ├── filter-tenant.dto.ts
│   │   │   │   │   │   └── update-tenant.dto.ts
│   │   │   │   │   ├── entities/
│   │   │   │   │   │   └── tenant.entity.ts
│   │   │   │   │   ├── mappers/
│   │   │   │   │   │   └── tenant.mapper.ts
│   │   │   │   │   ├── validators/
│   │   │   │   │   │   └── tenant.validator.ts
│   │   │   │   │   ├── tenant.controller.ts
│   │   │   │   │   ├── tenant.module.ts
│   │   │   │   │   ├── tenant.repository.ts
│   │   │   │   │   └── tenant.service.ts
│   │   │   │   ├── tenant-feature-flags/
│   │   │   │   │   ├── dto/
│   │   │   │   │   │   ├── create-tenant-feature-flags.dto.ts
│   │   │   │   │   │   ├── filter-tenant-feature-flags.dto.ts
│   │   │   │   │   │   └── update-tenant-feature-flags.dto.ts
│   │   │   │   │   ├── entities/
│   │   │   │   │   │   └── tenant-feature-flags.entity.ts
│   │   │   │   │   ├── mappers/
│   │   │   │   │   │   └── tenant-feature-flags.mapper.ts
│   │   │   │   │   ├── validators/
│   │   │   │   │   │   └── tenant-feature-flags.validator.ts
│   │   │   │   │   ├── tenant-feature-flags.controller.ts
│   │   │   │   │   ├── tenant-feature-flags.module.ts
│   │   │   │   │   ├── tenant-feature-flags.repository.ts
│   │   │   │   │   └── tenant-feature-flags.service.ts
│   │   │   │   ├── tenant-kyc/
│   │   │   │   │   ├── dto/
│   │   │   │   │   │   ├── create-tenant-kyc.dto.ts
│   │   │   │   │   │   ├── filter-tenant-kyc.dto.ts
│   │   │   │   │   │   └── update-tenant-kyc.dto.ts
│   │   │   │   │   ├── entities/
│   │   │   │   │   │   └── tenant-kyc.entity.ts
│   │   │   │   │   ├── mappers/
│   │   │   │   │   │   └── tenant-kyc.mapper.ts
│   │   │   │   │   ├── validators/
│   │   │   │   │   │   └── tenant-kyc.validator.ts
│   │   │   │   │   ├── tenant-kyc.controller.ts
│   │   │   │   │   ├── tenant-kyc.module.ts
│   │   │   │   │   ├── tenant-kyc.repository.ts
│   │   │   │   │   └── tenant-kyc.service.ts
│   │   │   │   └── tenant.module.ts
│   │   │   ├── tracking/
│   │   │   │   ├── claims/
│   │   │   │   │   ├── dto/
│   │   │   │   │   │   ├── create-claims.dto.ts
│   │   │   │   │   │   ├── filter-claims.dto.ts
│   │   │   │   │   │   └── update-claims.dto.ts
│   │   │   │   │   ├── entities/
│   │   │   │   │   │   └── claims.entity.ts
│   │   │   │   │   ├── mappers/
│   │   │   │   │   │   └── claims.mapper.ts
│   │   │   │   │   ├── validators/
│   │   │   │   │   │   └── claims.validator.ts
│   │   │   │   │   ├── claims.controller.ts
│   │   │   │   │   ├── claims.module.ts
│   │   │   │   │   ├── claims.repository.ts
│   │   │   │   │   └── claims.service.ts
│   │   │   │   ├── exceptions/
│   │   │   │   │   ├── dto/
│   │   │   │   │   │   ├── create-exception-logs.dto.ts
│   │   │   │   │   │   ├── filter-exception-logs.dto.ts
│   │   │   │   │   │   └── update-exception-logs.dto.ts
│   │   │   │   │   ├── entities/
│   │   │   │   │   │   └── exception-logs.entity.ts
│   │   │   │   │   ├── mappers/
│   │   │   │   │   │   └── exception-logs.mapper.ts
│   │   │   │   │   ├── validators/
│   │   │   │   │   │   └── exception-logs.validator.ts
│   │   │   │   │   ├── exception-logs.controller.ts
│   │   │   │   │   ├── exception-logs.module.ts
│   │   │   │   │   ├── exception-logs.repository.ts
│   │   │   │   │   └── exception-logs.service.ts
│   │   │   │   ├── incident-actions/
│   │   │   │   │   ├── dto/
│   │   │   │   │   │   ├── create-incident-actions.dto.ts
│   │   │   │   │   │   ├── filter-incident-actions.dto.ts
│   │   │   │   │   │   └── update-incident-actions.dto.ts
│   │   │   │   │   ├── entities/
│   │   │   │   │   │   └── incident-actions.entity.ts
│   │   │   │   │   ├── mappers/
│   │   │   │   │   │   └── incident-actions.mapper.ts
│   │   │   │   │   ├── validators/
│   │   │   │   │   │   └── incident-actions.validator.ts
│   │   │   │   │   ├── incident-actions.controller.ts
│   │   │   │   │   ├── incident-actions.module.ts
│   │   │   │   │   ├── incident-actions.repository.ts
│   │   │   │   │   └── incident-actions.service.ts
│   │   │   │   ├── incident-documents/
│   │   │   │   │   ├── dto/
│   │   │   │   │   │   ├── create-incident-documents.dto.ts
│   │   │   │   │   │   ├── filter-incident-documents.dto.ts
│   │   │   │   │   │   └── update-incident-documents.dto.ts
│   │   │   │   │   ├── entities/
│   │   │   │   │   │   └── incident-documents.entity.ts
│   │   │   │   │   ├── mappers/
│   │   │   │   │   │   └── incident-documents.mapper.ts
│   │   │   │   │   ├── validators/
│   │   │   │   │   │   └── incident-documents.validator.ts
│   │   │   │   │   ├── incident-documents.controller.ts
│   │   │   │   │   ├── incident-documents.module.ts
│   │   │   │   │   ├── incident-documents.repository.ts
│   │   │   │   │   └── incident-documents.service.ts
│   │   │   │   ├── incidents/
│   │   │   │   │   ├── dto/
│   │   │   │   │   │   ├── create-incidents.dto.ts
│   │   │   │   │   │   ├── filter-incidents.dto.ts
│   │   │   │   │   │   └── update-incidents.dto.ts
│   │   │   │   │   ├── entities/
│   │   │   │   │   │   └── incidents.entity.ts
│   │   │   │   │   ├── mappers/
│   │   │   │   │   │   └── incidents.mapper.ts
│   │   │   │   │   ├── validators/
│   │   │   │   │   │   └── incidents.validator.ts
│   │   │   │   │   ├── incidents.controller.ts
│   │   │   │   │   ├── incidents.module.ts
│   │   │   │   │   ├── incidents.repository.ts
│   │   │   │   │   └── incidents.service.ts
│   │   │   │   ├── package-scan/
│   │   │   │   │   ├── dto/
│   │   │   │   │   │   ├── create-package-scan-logs.dto.ts
│   │   │   │   │   │   ├── filter-package-scan-logs.dto.ts
│   │   │   │   │   │   └── update-package-scan-logs.dto.ts
│   │   │   │   │   ├── entities/
│   │   │   │   │   │   └── package-scan-logs.entity.ts
│   │   │   │   │   ├── mappers/
│   │   │   │   │   │   └── package-scan-logs.mapper.ts
│   │   │   │   │   ├── validators/
│   │   │   │   │   │   └── package-scan-logs.validator.ts
│   │   │   │   │   ├── package-scan-logs.controller.ts
│   │   │   │   │   ├── package-scan-logs.module.ts
│   │   │   │   │   ├── package-scan-logs.repository.ts
│   │   │   │   │   └── package-scan-logs.service.ts
│   │   │   │   ├── status-change-logs/
│   │   │   │   │   ├── dto/
│   │   │   │   │   │   ├── create-status-change-logs.dto.ts
│   │   │   │   │   │   ├── filter-status-change-logs.dto.ts
│   │   │   │   │   │   └── update-status-change-logs.dto.ts
│   │   │   │   │   ├── entities/
│   │   │   │   │   │   └── status-change-logs.entity.ts
│   │   │   │   │   ├── mappers/
│   │   │   │   │   │   └── status-change-logs.mapper.ts
│   │   │   │   │   ├── validators/
│   │   │   │   │   │   └── status-change-logs.validator.ts
│   │   │   │   │   ├── status-change-logs.controller.ts
│   │   │   │   │   ├── status-change-logs.module.ts
│   │   │   │   │   ├── status-change-logs.repository.ts
│   │   │   │   │   └── status-change-logs.service.ts
│   │   │   │   ├── tracking-events/
│   │   │   │   │   ├── dto/
│   │   │   │   │   │   ├── create-tracking-events.dto.ts
│   │   │   │   │   │   ├── filter-tracking-events.dto.ts
│   │   │   │   │   │   └── update-tracking-events.dto.ts
│   │   │   │   │   ├── entities/
│   │   │   │   │   │   └── tracking-events.entity.ts
│   │   │   │   │   ├── mappers/
│   │   │   │   │   │   └── tracking-events.mapper.ts
│   │   │   │   │   ├── validators/
│   │   │   │   │   │   └── tracking-events.validator.ts
│   │   │   │   │   ├── tracking-events.controller.ts
│   │   │   │   │   ├── tracking-events.module.ts
│   │   │   │   │   ├── tracking-events.repository.ts
│   │   │   │   │   └── tracking-events.service.ts
│   │   │   │   ├── vehicle-location/
│   │   │   │   │   ├── dto/
│   │   │   │   │   │   ├── create-vehicle-location-logs.dto.ts
│   │   │   │   │   │   ├── filter-vehicle-location-logs.dto.ts
│   │   │   │   │   │   └── update-vehicle-location-logs.dto.ts
│   │   │   │   │   ├── entities/
│   │   │   │   │   │   └── vehicle-location-logs.entity.ts
│   │   │   │   │   ├── mappers/
│   │   │   │   │   │   └── vehicle-location-logs.mapper.ts
│   │   │   │   │   ├── validators/
│   │   │   │   │   │   └── vehicle-location-logs.validator.ts
│   │   │   │   │   ├── vehicle-location-logs.controller.ts
│   │   │   │   │   ├── vehicle-location-logs.module.ts
│   │   │   │   │   ├── vehicle-location-logs.repository.ts
│   │   │   │   │   └── vehicle-location-logs.service.ts
│   │   │   │   └── tracking.module.ts
│   │   │   └── vault/
│   │   │       ├── addresses/
│   │   │       │   ├── dto/
│   │   │       │   │   ├── create-addresses.dto.ts
│   │   │       │   │   ├── filter-addresses.dto.ts
│   │   │       │   │   └── update-addresses.dto.ts
│   │   │       │   ├── entities/
│   │   │       │   │   └── addresses.entity.ts
│   │   │       │   ├── mappers/
│   │   │       │   │   └── addresses.mapper.ts
│   │   │       │   ├── validators/
│   │   │       │   │   └── addresses.validator.ts
│   │   │       │   ├── addresses.controller.ts
│   │   │       │   ├── addresses.module.ts
│   │   │       │   ├── addresses.repository.ts
│   │   │       │   └── addresses.service.ts
│   │   │       ├── bank-accounts/
│   │   │       │   ├── dto/
│   │   │       │   │   ├── create-bank-accounts.dto.ts
│   │   │       │   │   ├── filter-bank-accounts.dto.ts
│   │   │       │   │   └── update-bank-accounts.dto.ts
│   │   │       │   ├── entities/
│   │   │       │   │   └── bank-accounts.entity.ts
│   │   │       │   ├── mappers/
│   │   │       │   │   └── bank-accounts.mapper.ts
│   │   │       │   ├── validators/
│   │   │       │   │   └── bank-accounts.validator.ts
│   │   │       │   ├── bank-accounts.controller.ts
│   │   │       │   ├── bank-accounts.module.ts
│   │   │       │   ├── bank-accounts.repository.ts
│   │   │       │   └── bank-accounts.service.ts
│   │   │       ├── contact-persons/
│   │   │       │   ├── dto/
│   │   │       │   │   ├── create-contact-persons.dto.ts
│   │   │       │   │   ├── filter-contact-persons.dto.ts
│   │   │       │   │   └── update-contact-persons.dto.ts
│   │   │       │   ├── entities/
│   │   │       │   │   └── contact-persons.entity.ts
│   │   │       │   ├── mappers/
│   │   │       │   │   └── contact-persons.mapper.ts
│   │   │       │   ├── validators/
│   │   │       │   │   └── contact-persons.validator.ts
│   │   │       │   ├── contact-persons.controller.ts
│   │   │       │   ├── contact-persons.module.ts
│   │   │       │   ├── contact-persons.repository.ts
│   │   │       │   └── contact-persons.service.ts
│   │   │       ├── document-types/
│   │   │       │   ├── dto/
│   │   │       │   │   ├── create-document-types.dto.ts
│   │   │       │   │   ├── filter-document-types.dto.ts
│   │   │       │   │   └── update-document-types.dto.ts
│   │   │       │   ├── entities/
│   │   │       │   │   └── document-types.entity.ts
│   │   │       │   ├── mappers/
│   │   │       │   │   └── document-types.mapper.ts
│   │   │       │   ├── validators/
│   │   │       │   │   └── document-types.validator.ts
│   │   │       │   ├── document-types.controller.ts
│   │   │       │   ├── document-types.module.ts
│   │   │       │   ├── document-types.repository.ts
│   │   │       │   └── document-types.service.ts
│   │   │       ├── document-verifications/
│   │   │       │   ├── dto/
│   │   │       │   │   ├── create-document-verifications.dto.ts
│   │   │       │   │   ├── filter-document-verifications.dto.ts
│   │   │       │   │   └── update-document-verifications.dto.ts
│   │   │       │   ├── entities/
│   │   │       │   │   └── document-verifications.entity.ts
│   │   │       │   ├── mappers/
│   │   │       │   │   └── document-verifications.mapper.ts
│   │   │       │   ├── validators/
│   │   │       │   │   └── document-verifications.validator.ts
│   │   │       │   ├── document-verifications.controller.ts
│   │   │       │   ├── document-verifications.module.ts
│   │   │       │   ├── document-verifications.repository.ts
│   │   │       │   └── document-verifications.service.ts
│   │   │       ├── documents/
│   │   │       │   ├── dto/
│   │   │       │   │   ├── create-documents.dto.ts
│   │   │       │   │   ├── filter-documents.dto.ts
│   │   │       │   │   └── update-documents.dto.ts
│   │   │       │   ├── entities/
│   │   │       │   │   └── documents.entity.ts
│   │   │       │   ├── mappers/
│   │   │       │   │   └── documents.mapper.ts
│   │   │       │   ├── validators/
│   │   │       │   │   └── documents.validator.ts
│   │   │       │   ├── documents.controller.ts
│   │   │       │   ├── documents.module.ts
│   │   │       │   ├── documents.repository.ts
│   │   │       │   └── documents.service.ts
│   │   │       ├── tax-registrations/
│   │   │       │   ├── dto/
│   │   │       │   │   ├── create-tax-registrations.dto.ts
│   │   │       │   │   ├── filter-tax-registrations.dto.ts
│   │   │       │   │   └── update-tax-registrations.dto.ts
│   │   │       │   ├── entities/
│   │   │       │   │   └── tax-registrations.entity.ts
│   │   │       │   ├── mappers/
│   │   │       │   │   └── tax-registrations.mapper.ts
│   │   │       │   ├── validators/
│   │   │       │   │   └── tax-registrations.validator.ts
│   │   │       │   ├── tax-registrations.controller.ts
│   │   │       │   ├── tax-registrations.module.ts
│   │   │       │   ├── tax-registrations.repository.ts
│   │   │       │   └── tax-registrations.service.ts
│   │   │       └── vault.module.ts
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── .env.example
│   ├── Dockerfile
│   ├── nest-cli.json
│   ├── package.json
│   └── tsconfig.json
├── driver-app/
│   ├── app/
│   │   ├── (auth)/
│   │   │   └── login.tsx
│   │   ├── (tabs)/
│   │   │   └── tasks.tsx
│   │   └── _layout.tsx
│   ├── lib/
│   │   ├── api.ts
│   │   └── offline-queue.ts
│   ├── README.md
│   ├── app.json
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── (auth)/
│   │   │   │   └── login/
│   │   │   │       └── page.tsx
│   │   │   ├── (portal)/
│   │   │   │   ├── dashboard/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── finance/
│   │   │   │   │   ├── customer-invoice/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── customer-invoice-items/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── fuel-log/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── loader-expense/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── vendor-voucher/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   └── vendor-voucher-items/
│   │   │   │   │       └── page.tsx
│   │   │   │   ├── masters/
│   │   │   │   │   ├── addresses/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── bank-accounts/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── channel-partner/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── company/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── contact-persons/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── contract/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── contract-excess-weight/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── contract-oda-charges/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── contract-slab-definition/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── contract-slab-rates/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── cp-kyc/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── currency/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── customer/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── departments/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── document-types/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── document-verifications/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── documents/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── driver/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── driver-rate/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── feature-flags/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── geo/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── incident-action-master/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── incident-type-master/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── loader-rate/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── login-attempts/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── number-series/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── office/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── organizations/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── print-templates/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── privileges/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── reason-master/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── role-privileges/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── roles/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── security-events/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── sessions/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── station-coverage/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── status-automation/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── status-master/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── tax-registrations/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── tenant/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── tenant-feature-flags/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── tenant-kyc/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── user-otps/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── users/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── vehicle/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── vendor/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── vendor-kyc/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   └── workflow-master/
│   │   │   │   │       └── page.tsx
│   │   │   │   ├── operations/
│   │   │   │   │   ├── booking/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── booking-charges/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── booking-items/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── driver-tasks/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── drs/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── drs-lrs/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── ewaybill/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── lr/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── lr-state-log/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── manifest/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── manifest-lrs/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── pod/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── prn/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── prn-bookings/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── prn-lrs/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── route-master/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── route-stops/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── trip/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── trip-expenses/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   └── trip-lrs/
│   │   │   │   │       └── page.tsx
│   │   │   │   ├── settings/
│   │   │   │   │   ├── activity-logs/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── api-integration-logs/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── api-integrations/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── api-provider-config/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── approval-action-logs/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── approval-requests/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── approval-steps/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── dashboard-widgets/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── dashboards/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── logs/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── queue/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── scheduled-jobs/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── sync-jobs/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── templates/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── webhook-configs/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── webhook-log-store/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   └── webhook-logs/
│   │   │   │   │       └── page.tsx
│   │   │   │   ├── tracking/
│   │   │   │   │   ├── claims/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── exceptions/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── incident-actions/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── incident-documents/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── incidents/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── package-scan/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── status-change-logs/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── tracking-events/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   └── vehicle-location/
│   │   │   │   │       └── page.tsx
│   │   │   │   └── layout.tsx
│   │   │   ├── (public)/
│   │   │   │   └── track/
│   │   │   │       └── [lrNo]/
│   │   │   │           └── page.tsx
│   │   │   ├── globals.css
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   │   └── PermissionGuard.tsx
│   │   │   ├── data-table/
│   │   │   │   ├── DataTable.tsx
│   │   │   │   └── Pagination.tsx
│   │   │   ├── layout/
│   │   │   │   ├── Sidebar.tsx
│   │   │   │   └── Topbar.tsx
│   │   │   ├── shared/
│   │   │   │   ├── PageHeader.tsx
│   │   │   │   ├── SearchBox.tsx
│   │   │   │   ├── StatusBadge.tsx
│   │   │   │   ├── excel-actions.tsx
│   │   │   │   └── import-result-dialog.tsx
│   │   │   ├── ui/
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Input.tsx
│   │   │   │   └── Select.tsx
│   │   │   └── Providers.tsx
│   │   ├── hooks/
│   │   │   ├── use-activity-logs.ts
│   │   │   ├── use-addresses.ts
│   │   │   ├── use-api-integration-logs.ts
│   │   │   ├── use-api-integrations.ts
│   │   │   ├── use-api-provider-config.ts
│   │   │   ├── use-api-sync-jobs.ts
│   │   │   ├── use-api-webhook-logs.ts
│   │   │   ├── use-approval-action-logs.ts
│   │   │   ├── use-approval-requests.ts
│   │   │   ├── use-approval-steps.ts
│   │   │   ├── use-auth.ts
│   │   │   ├── use-bank-accounts.ts
│   │   │   ├── use-booking-charges.ts
│   │   │   ├── use-booking-items.ts
│   │   │   ├── use-booking.ts
│   │   │   ├── use-channel-partner.ts
│   │   │   ├── use-claims.ts
│   │   │   ├── use-company.ts
│   │   │   ├── use-contact-persons.ts
│   │   │   ├── use-cp-kyc.ts
│   │   │   ├── use-currency.ts
│   │   │   ├── use-cust-contract-excess-weight.ts
│   │   │   ├── use-cust-contract-oda-charges.ts
│   │   │   ├── use-cust-contract-slab-definition.ts
│   │   │   ├── use-cust-contract-slab-rates.ts
│   │   │   ├── use-cust-contract.ts
│   │   │   ├── use-customer-invoice-items.ts
│   │   │   ├── use-customer-invoice.ts
│   │   │   ├── use-customer.ts
│   │   │   ├── use-dashboard-widgets.ts
│   │   │   ├── use-dashboards.ts
│   │   │   ├── use-departments.ts
│   │   │   ├── use-document-types.ts
│   │   │   ├── use-document-verifications.ts
│   │   │   ├── use-documents.ts
│   │   │   ├── use-driver-rate.ts
│   │   │   ├── use-driver-tasks.ts
│   │   │   ├── use-driver.ts
│   │   │   ├── use-drs-lrs.ts
│   │   │   ├── use-drs.ts
│   │   │   ├── use-ewaybill.ts
│   │   │   ├── use-exception-logs.ts
│   │   │   ├── use-feature-flags.ts
│   │   │   ├── use-fuel-log.ts
│   │   │   ├── use-geo-hierarchy.ts
│   │   │   ├── use-incident-action-master.ts
│   │   │   ├── use-incident-actions.ts
│   │   │   ├── use-incident-documents.ts
│   │   │   ├── use-incident-type-master.ts
│   │   │   ├── use-incidents.ts
│   │   │   ├── use-loader-expense.ts
│   │   │   ├── use-loader-rate.ts
│   │   │   ├── use-login-attempts.ts
│   │   │   ├── use-lr-state-log.ts
│   │   │   ├── use-lr.ts
│   │   │   ├── use-manifest-lrs.ts
│   │   │   ├── use-manifest.ts
│   │   │   ├── use-notification-logs.ts
│   │   │   ├── use-notification-queue.ts
│   │   │   ├── use-notification-templates.ts
│   │   │   ├── use-number-series-config.ts
│   │   │   ├── use-office.ts
│   │   │   ├── use-organizations.ts
│   │   │   ├── use-package-scan-logs.ts
│   │   │   ├── use-pagination.ts
│   │   │   ├── use-permission.ts
│   │   │   ├── use-pod.ts
│   │   │   ├── use-print-templates.ts
│   │   │   ├── use-privileges.ts
│   │   │   ├── use-prn-bookings.ts
│   │   │   ├── use-prn-lrs.ts
│   │   │   ├── use-prn.ts
│   │   │   ├── use-reason-master.ts
│   │   │   ├── use-role-privileges.ts
│   │   │   ├── use-role.ts
│   │   │   ├── use-route-master.ts
│   │   │   ├── use-route-stops.ts
│   │   │   ├── use-scheduled-jobs.ts
│   │   │   ├── use-security-events.ts
│   │   │   ├── use-station-coverage.ts
│   │   │   ├── use-status-automation-rules.ts
│   │   │   ├── use-status-change-logs.ts
│   │   │   ├── use-status-master.ts
│   │   │   ├── use-tax-registrations.ts
│   │   │   ├── use-tenant-feature-flags.ts
│   │   │   ├── use-tenant-kyc.ts
│   │   │   ├── use-tenant.ts
│   │   │   ├── use-tracking-events.ts
│   │   │   ├── use-trip-expenses.ts
│   │   │   ├── use-trip-lrs.ts
│   │   │   ├── use-trip.ts
│   │   │   ├── use-user-otps.ts
│   │   │   ├── use-user-sessions.ts
│   │   │   ├── use-users.ts
│   │   │   ├── use-vehicle-location-logs.ts
│   │   │   ├── use-vehicles.ts
│   │   │   ├── use-vendor-kyc.ts
│   │   │   ├── use-vendor-voucher-items.ts
│   │   │   ├── use-vendor-voucher.ts
│   │   │   ├── use-vendor.ts
│   │   │   ├── use-webhook-configs.ts
│   │   │   ├── use-webhook-logs.ts
│   │   │   └── use-workflow-master.ts
│   │   ├── lib/
│   │   │   ├── api/
│   │   │   │   ├── activity-logs.api.ts
│   │   │   │   ├── addresses.api.ts
│   │   │   │   ├── api-integration-logs.api.ts
│   │   │   │   ├── api-integrations.api.ts
│   │   │   │   ├── api-provider-config.api.ts
│   │   │   │   ├── api-sync-jobs.api.ts
│   │   │   │   ├── api-webhook-logs.api.ts
│   │   │   │   ├── approval-action-logs.api.ts
│   │   │   │   ├── approval-requests.api.ts
│   │   │   │   ├── approval-steps.api.ts
│   │   │   │   ├── bank-accounts.api.ts
│   │   │   │   ├── booking-charges.api.ts
│   │   │   │   ├── booking-items.api.ts
│   │   │   │   ├── booking.api.ts
│   │   │   │   ├── channel-partner.api.ts
│   │   │   │   ├── claims.api.ts
│   │   │   │   ├── company.api.ts
│   │   │   │   ├── contact-persons.api.ts
│   │   │   │   ├── cp-kyc.api.ts
│   │   │   │   ├── currency.api.ts
│   │   │   │   ├── cust-contract-excess-weight.api.ts
│   │   │   │   ├── cust-contract-oda-charges.api.ts
│   │   │   │   ├── cust-contract-slab-definition.api.ts
│   │   │   │   ├── cust-contract-slab-rates.api.ts
│   │   │   │   ├── cust-contract.api.ts
│   │   │   │   ├── customer-invoice-items.api.ts
│   │   │   │   ├── customer-invoice.api.ts
│   │   │   │   ├── customer.api.ts
│   │   │   │   ├── dashboard-widgets.api.ts
│   │   │   │   ├── dashboards.api.ts
│   │   │   │   ├── departments.api.ts
│   │   │   │   ├── document-types.api.ts
│   │   │   │   ├── document-verifications.api.ts
│   │   │   │   ├── documents.api.ts
│   │   │   │   ├── driver-rate.api.ts
│   │   │   │   ├── driver-tasks.api.ts
│   │   │   │   ├── driver.api.ts
│   │   │   │   ├── drs-lrs.api.ts
│   │   │   │   ├── drs.api.ts
│   │   │   │   ├── ewaybill.api.ts
│   │   │   │   ├── excel-client.ts
│   │   │   │   ├── exception-logs.api.ts
│   │   │   │   ├── feature-flags.api.ts
│   │   │   │   ├── fuel-log.api.ts
│   │   │   │   ├── geo-hierarchy.api.ts
│   │   │   │   ├── incident-action-master.api.ts
│   │   │   │   ├── incident-actions.api.ts
│   │   │   │   ├── incident-documents.api.ts
│   │   │   │   ├── incident-type-master.api.ts
│   │   │   │   ├── incidents.api.ts
│   │   │   │   ├── loader-expense.api.ts
│   │   │   │   ├── loader-rate.api.ts
│   │   │   │   ├── login-attempts.api.ts
│   │   │   │   ├── lr-state-log.api.ts
│   │   │   │   ├── lr.api.ts
│   │   │   │   ├── manifest-lrs.api.ts
│   │   │   │   ├── manifest.api.ts
│   │   │   │   ├── notification-logs.api.ts
│   │   │   │   ├── notification-queue.api.ts
│   │   │   │   ├── notification-templates.api.ts
│   │   │   │   ├── number-series-config.api.ts
│   │   │   │   ├── office.api.ts
│   │   │   │   ├── organizations.api.ts
│   │   │   │   ├── package-scan-logs.api.ts
│   │   │   │   ├── pod.api.ts
│   │   │   │   ├── print-templates.api.ts
│   │   │   │   ├── privileges.api.ts
│   │   │   │   ├── prn-bookings.api.ts
│   │   │   │   ├── prn-lrs.api.ts
│   │   │   │   ├── prn.api.ts
│   │   │   │   ├── reason-master.api.ts
│   │   │   │   ├── role-privileges.api.ts
│   │   │   │   ├── role.api.ts
│   │   │   │   ├── route-master.api.ts
│   │   │   │   ├── route-stops.api.ts
│   │   │   │   ├── scheduled-jobs.api.ts
│   │   │   │   ├── security-events.api.ts
│   │   │   │   ├── station-coverage.api.ts
│   │   │   │   ├── status-automation-rules.api.ts
│   │   │   │   ├── status-change-logs.api.ts
│   │   │   │   ├── status-master.api.ts
│   │   │   │   ├── tax-registrations.api.ts
│   │   │   │   ├── tenant-feature-flags.api.ts
│   │   │   │   ├── tenant-kyc.api.ts
│   │   │   │   ├── tenant.api.ts
│   │   │   │   ├── tracking-events.api.ts
│   │   │   │   ├── trip-expenses.api.ts
│   │   │   │   ├── trip-lrs.api.ts
│   │   │   │   ├── trip.api.ts
│   │   │   │   ├── user-otps.api.ts
│   │   │   │   ├── user-sessions.api.ts
│   │   │   │   ├── users.api.ts
│   │   │   │   ├── vehicle-location-logs.api.ts
│   │   │   │   ├── vehicles.api.ts
│   │   │   │   ├── vendor-kyc.api.ts
│   │   │   │   ├── vendor-voucher-items.api.ts
│   │   │   │   ├── vendor-voucher.api.ts
│   │   │   │   ├── vendor.api.ts
│   │   │   │   ├── webhook-configs.api.ts
│   │   │   │   ├── webhook-logs.api.ts
│   │   │   │   └── workflow-master.api.ts
│   │   │   ├── auth.ts
│   │   │   ├── axios.ts
│   │   │   ├── socket.ts
│   │   │   └── utils.ts
│   │   └── store/
│   │       ├── auth.store.ts
│   │       ├── tenant.store.ts
│   │       └── ui.store.ts
│   ├── .env.example
│   ├── README.md
│   ├── next.config.js
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.ts
│   └── tsconfig.json
├── postman/
│   ├── README.md
│   ├── TMS_API.postman_collection.json
│   └── TMS_Environment.postman_environment.json
├── .gitignore
├── FILE_TREE.md
├── README.md
├── STRUCTURE.md
└── docker-compose.yml
```


# TMS Platform — File Structure

Top-level layout: **2 separate projects** (backend + frontend) + driver-app + postman, no Turborepo.

## Full layout

```
tms-platform/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.ts
│   ├── src/
│   │   ├── common/
│   │   │   ├── decorators/
│   │   │   ├── filters/
│   │   │   ├── guards/
│   │   │   ├── interceptors/
│   │   │   ├── pipes/
│   │   │   ├── services/
│   │   │   └── common.module.ts
│   │   ├── database/
│   │   │   ├── database.module.ts
│   │   │   └── prisma.service.ts
│   │   ├── modules/
│   │   │   ├── audit/
│   │   │   ├── config/
│   │   │   ├── finance/
│   │   │   ├── iam/
│   │   │   ├── integrations/
│   │   │   ├── masters/
│   │   │   ├── notifications/
│   │   │   ├── operations/
│   │   │   ├── tenant/
│   │   │   ├── tracking/
│   │   │   └── vault/
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── .env.example
│   ├── Dockerfile
│   ├── nest-cli.json
│   ├── package.json
│   └── tsconfig.json
├── driver-app/
│   ├── app/
│   │   ├── (auth)/
│   │   │   └── login.tsx
│   │   ├── (tabs)/
│   │   │   └── tasks.tsx
│   │   └── _layout.tsx
│   ├── lib/
│   │   ├── api.ts
│   │   └── offline-queue.ts
│   ├── README.md
│   ├── app.json
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── (auth)/
│   │   │   ├── (portal)/
│   │   │   ├── (public)/
│   │   │   ├── globals.css
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   ├── data-table/
│   │   │   ├── layout/
│   │   │   ├── shared/
│   │   │   ├── ui/
│   │   │   └── Providers.tsx
│   │   ├── hooks/
│   │   │   ├── use-activity-logs.ts
│   │   │   ├── use-addresses.ts
│   │   │   ├── use-api-integration-logs.ts
│   │   │   ├── use-api-integrations.ts
│   │   │   ├── use-api-provider-config.ts
│   │   │   ├── use-api-sync-jobs.ts
│   │   │   ├── use-api-webhook-logs.ts
│   │   │   ├── use-approval-action-logs.ts
│   │   │   ├── use-approval-requests.ts
│   │   │   ├── use-approval-steps.ts
│   │   │   ├── use-auth.ts
│   │   │   ├── use-bank-accounts.ts
│   │   │   ├── use-booking-charges.ts
│   │   │   ├── use-booking-items.ts
│   │   │   ├── use-booking.ts
│   │   │   ├── use-channel-partner.ts
│   │   │   ├── use-claims.ts
│   │   │   ├── use-company.ts
│   │   │   ├── use-contact-persons.ts
│   │   │   ├── use-cp-kyc.ts
│   │   │   ├── use-currency.ts
│   │   │   ├── use-cust-contract-excess-weight.ts
│   │   │   ├── use-cust-contract-oda-charges.ts
│   │   │   ├── use-cust-contract-slab-definition.ts
│   │   │   ├── use-cust-contract-slab-rates.ts
│   │   │   ├── use-cust-contract.ts
│   │   │   ├── use-customer-invoice-items.ts
│   │   │   ├── use-customer-invoice.ts
│   │   │   ├── use-customer.ts
│   │   │   ├── use-dashboard-widgets.ts
│   │   │   ├── use-dashboards.ts
│   │   │   ├── use-departments.ts
│   │   │   ├── use-document-types.ts
│   │   │   ├── use-document-verifications.ts
│   │   │   ├── use-documents.ts
│   │   │   ├── use-driver-rate.ts
│   │   │   ├── use-driver-tasks.ts
│   │   │   ├── use-driver.ts
│   │   │   ├── use-drs-lrs.ts
│   │   │   ├── use-drs.ts
│   │   │   ├── use-ewaybill.ts
│   │   │   ├── use-exception-logs.ts
│   │   │   ├── use-feature-flags.ts
│   │   │   ├── use-fuel-log.ts
│   │   │   ├── use-geo-hierarchy.ts
│   │   │   ├── use-incident-action-master.ts
│   │   │   ├── use-incident-actions.ts
│   │   │   ├── use-incident-documents.ts
│   │   │   ├── use-incident-type-master.ts
│   │   │   ├── use-incidents.ts
│   │   │   ├── use-loader-expense.ts
│   │   │   ├── use-loader-rate.ts
│   │   │   ├── use-login-attempts.ts
│   │   │   ├── use-lr-state-log.ts
│   │   │   ├── use-lr.ts
│   │   │   ├── use-manifest-lrs.ts
│   │   │   ├── use-manifest.ts
│   │   │   ├── use-notification-logs.ts
│   │   │   ├── use-notification-queue.ts
│   │   │   ├── use-notification-templates.ts
│   │   │   ├── use-number-series-config.ts
│   │   │   ├── use-office.ts
│   │   │   ├── use-organizations.ts
│   │   │   ├── use-package-scan-logs.ts
│   │   │   ├── use-pagination.ts
│   │   │   ├── use-permission.ts
│   │   │   ├── use-pod.ts
│   │   │   ├── use-print-templates.ts
│   │   │   ├── use-privileges.ts
│   │   │   ├── use-prn-bookings.ts
│   │   │   ├── use-prn-lrs.ts
│   │   │   ├── use-prn.ts
│   │   │   ├── use-reason-master.ts
│   │   │   ├── use-role-privileges.ts
│   │   │   ├── use-role.ts
│   │   │   ├── use-route-master.ts
│   │   │   ├── use-route-stops.ts
│   │   │   ├── use-scheduled-jobs.ts
│   │   │   ├── use-security-events.ts
│   │   │   ├── use-station-coverage.ts
│   │   │   ├── use-status-automation-rules.ts
│   │   │   ├── use-status-change-logs.ts
│   │   │   ├── use-status-master.ts
│   │   │   ├── use-tax-registrations.ts
│   │   │   ├── use-tenant-feature-flags.ts
│   │   │   ├── use-tenant-kyc.ts
│   │   │   ├── use-tenant.ts
│   │   │   ├── use-tracking-events.ts
│   │   │   ├── use-trip-expenses.ts
│   │   │   ├── use-trip-lrs.ts
│   │   │   ├── use-trip.ts
│   │   │   ├── use-user-otps.ts
│   │   │   ├── use-user-sessions.ts
│   │   │   ├── use-users.ts
│   │   │   ├── use-vehicle-location-logs.ts
│   │   │   ├── use-vehicles.ts
│   │   │   ├── use-vendor-kyc.ts
│   │   │   ├── use-vendor-voucher-items.ts
│   │   │   ├── use-vendor-voucher.ts
│   │   │   ├── use-vendor.ts
│   │   │   ├── use-webhook-configs.ts
│   │   │   ├── use-webhook-logs.ts
│   │   │   └── use-workflow-master.ts
│   │   ├── lib/
│   │   │   ├── api/
│   │   │   ├── auth.ts
│   │   │   ├── axios.ts
│   │   │   ├── socket.ts
│   │   │   └── utils.ts
│   │   └── store/
│   │       ├── auth.store.ts
│   │       ├── tenant.store.ts
│   │       └── ui.store.ts
│   ├── .env.example
│   ├── README.md
│   ├── next.config.js
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.ts
│   └── tsconfig.json
├── postman/
│   ├── README.md
│   ├── TMS_API.postman_collection.json
│   └── TMS_Environment.postman_environment.json
├── .gitignore
├── FILE_TREE.md
├── README.md
├── STRUCTURE.md
└── docker-compose.yml
```