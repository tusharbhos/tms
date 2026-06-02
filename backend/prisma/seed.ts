/**
 * TMS Platform — COMPREHENSIVE Seed Script
 * ─────────────────────────────────────────
 * Seeds all 60+ master/config/reference tables with realistic demo data.
 *
 * Coverage:
 *   ✓ Foundation: currency, feature_flags, document_types, geo_hierarchy, privileges
 *   ✓ Tenant root: tenant, organizations
 *   ✓ Platform config: status_master (8 modules), reason_master, number_series,
 *                      incident types/actions, print_templates, status_automation_rules
 *   ✓ Identity: role + role_privileges, departments, users
 *   ✓ Organization: company, office (HO + Hub + Branches)
 *   ✓ Masters: customer (3), vendor (2), channel_partner, vehicles (3), driver (3)
 *   ✓ Rates: driver_rate, loader_rate
 *   ✓ Contracts: cust_contract + slab_definition + slab_rates + excess_weight + oda_charges
 *   ✓ Coverage: station_coverage
 *   ✓ Vault: addresses, contact_persons, bank_accounts, tax_registrations, documents
 *   ✓ Notifications: notification_templates
 *   ✓ Integrations: api_integrations + api_provider_config + webhook_configs
 *   ✓ Workflow + dashboards (sample widgets)
 *
 * Run: npm run db:seed
 *
 * Idempotent: uses upsert + try-catch so re-running is safe.
 */
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// ─── helpers ────────────────────────────────────────────
const uuid = (seed: number) => {
  const s = seed.toString(16).padStart(12, '0');
  return `00000000-0000-0000-0000-${s}`;
};

const safe = async (fn: () => Promise<any>, label: string) => {
  try { await fn(); } catch (e: any) { console.log(`  ⚠️  ${label}: ${e.message?.split('\n')[0]}`); }
};

const bulk = async (model: any, rows: any[], label: string) => {
  let ok = 0;
  for (const row of rows) {
    try {
      await model.upsert({ where: { id: row.id }, update: {}, create: row });
      ok++;
    } catch (e: any) {
      // try create-only fallback for tables without unique id constraints
      try { await model.create({ data: row }); ok++; }
      catch (e2: any) { /* skip duplicates */ }
    }
  }
  console.log(`  ✓ ${label}: ${ok}/${rows.length}`);
};


// ════════════════════════════════════════════════════════
// MAIN
// ════════════════════════════════════════════════════════
async function main() {
  console.log('\n🚛 TMS Seed — starting comprehensive seed...\n');

  // ─── 1. CURRENCY (no deps) ──────────────────────────
  console.log('📦 Foundation tables...');
  await bulk(prisma.currency, [
    { id: 1, code: 'INR', name: 'Indian Rupee', symbol: '₹', decimalPlaces: 2, active: true },
    { id: 2, code: 'USD', name: 'US Dollar',     symbol: '$', decimalPlaces: 2, active: true },
    { id: 3, code: 'EUR', name: 'Euro',          symbol: '€', decimalPlaces: 2, active: true },
  ], 'currency');

  // ─── 2. FEATURE FLAGS (global) ──────────────────────
  await bulk(prisma.featureFlags, [
    { id: 1, featureKey: 'ewb_auto_generate', moduleName: 'operations', featureName: 'E-Way Bill Auto Generation', featureType: true, defaultValue: 'true',  planRequired: 'STANDARD', active: true },
    { id: 2, featureKey: 'gps_live_tracking', moduleName: 'tracking',   featureName: 'Live GPS Tracking',          featureType: true, defaultValue: 'true',  planRequired: 'PRO',     active: true },
    { id: 3, featureKey: 'whatsapp_notify',   moduleName: 'notifications', featureName: 'WhatsApp Notifications',  featureType: true, defaultValue: 'false', planRequired: 'PRO',     active: true },
    { id: 4, featureKey: 'sap_sync',          moduleName: 'integrations', featureName: 'SAP ERP Sync',             featureType: true, defaultValue: 'false', planRequired: 'ENTERPRISE', active: true },
    { id: 5, featureKey: 'multi_company',     moduleName: 'tenant',      featureName: 'Multi-Company support',     featureType: true, defaultValue: 'false', planRequired: 'PRO',     active: true },
  ], 'feature_flags');

  // ─── 3. DOCUMENT TYPES (global reference) ───────────
  await bulk(prisma.documentTypes, [
    { id: 1,  entityType: 'customer', docCode: 'GST_CERT',     name: 'GST Certificate',        isRequired: true,  hasExpiry: false, reminderDays: 0,  status: 'ACTIVE' },
    { id: 2,  entityType: 'customer', docCode: 'PAN_CARD',     name: 'PAN Card',               isRequired: true,  hasExpiry: false, reminderDays: 0,  status: 'ACTIVE' },
    { id: 3,  entityType: 'vendor',   docCode: 'AGREEMENT',    name: 'Vendor Agreement',       isRequired: true,  hasExpiry: true,  reminderDays: 30, status: 'ACTIVE' },
    { id: 4,  entityType: 'vehicle',  docCode: 'RC',           name: 'Registration Certificate', isRequired: true, hasExpiry: true, reminderDays: 30, status: 'ACTIVE' },
    { id: 5,  entityType: 'vehicle',  docCode: 'INSURANCE',    name: 'Insurance Policy',       isRequired: true,  hasExpiry: true,  reminderDays: 30, status: 'ACTIVE' },
    { id: 6,  entityType: 'vehicle',  docCode: 'FITNESS',      name: 'Fitness Certificate',    isRequired: true,  hasExpiry: true,  reminderDays: 30, status: 'ACTIVE' },
    { id: 7,  entityType: 'vehicle',  docCode: 'PERMIT',       name: 'Permit',                 isRequired: true,  hasExpiry: true,  reminderDays: 30, status: 'ACTIVE' },
    { id: 8,  entityType: 'vehicle',  docCode: 'POLLUTION',    name: 'Pollution Certificate',  isRequired: true,  hasExpiry: true,  reminderDays: 15, status: 'ACTIVE' },
    { id: 9,  entityType: 'driver',   docCode: 'DL',           name: 'Driving License',        isRequired: true,  hasExpiry: true,  reminderDays: 60, status: 'ACTIVE' },
    { id: 10, entityType: 'driver',   docCode: 'AADHAAR',      name: 'Aadhaar Card',           isRequired: true,  hasExpiry: false, reminderDays: 0,  status: 'ACTIVE' },
    { id: 11, entityType: 'driver',   docCode: 'MEDICAL',      name: 'Medical Fitness',        isRequired: false, hasExpiry: true,  reminderDays: 30, status: 'ACTIVE' },
    { id: 12, entityType: 'pod',      docCode: 'POD_PHOTO',    name: 'POD Photo',              isRequired: true,  hasExpiry: false, reminderDays: 0,  status: 'ACTIVE' },
    { id: 13, entityType: 'pod',      docCode: 'SIGNATURE',    name: 'Receiver Signature',     isRequired: true,  hasExpiry: false, reminderDays: 0,  status: 'ACTIVE' },
    { id: 14, entityType: 'incident', docCode: 'POLICE_FIR',   name: 'Police FIR',             isRequired: false, hasExpiry: false, reminderDays: 0,  status: 'ACTIVE' },
    { id: 15, entityType: 'incident', docCode: 'RTO_DOC',      name: 'RTO Document',           isRequired: false, hasExpiry: false, reminderDays: 0,  status: 'ACTIVE' },
  ], 'document_types');

  // ─── 4. GEO HIERARCHY (sample pincodes) ─────────────
  await bulk(prisma.geoHierarchy, [
    { id: 1, country: 'India', state: 'Maharashtra', district: 'Pune',    city: 'Pune',    pincode: '411001', poName: 'Pune GPO',         poLat: 18.5204 as any, poLong: 73.8567 as any, isActive: true },
    { id: 2, country: 'India', state: 'Maharashtra', district: 'Mumbai',  city: 'Mumbai',  pincode: '400001', poName: 'Mumbai Fort',      poLat: 18.9388 as any, poLong: 72.8354 as any, isActive: true },
    { id: 3, country: 'India', state: 'Maharashtra', district: 'Mumbai',  city: 'Mumbai',  pincode: '400070', poName: 'Kurla',            poLat: 19.0726 as any, poLong: 72.8845 as any, isActive: true },
    { id: 4, country: 'India', state: 'Maharashtra', district: 'Pune',    city: 'Pune',    pincode: '411014', poName: 'Viman Nagar',      poLat: 18.5680 as any, poLong: 73.9143 as any, isActive: true },
    { id: 5, country: 'India', state: 'Karnataka',   district: 'Bangalore', city: 'Bangalore', pincode: '560001', poName: 'Bangalore GPO', poLat: 12.9716 as any, poLong: 77.5946 as any, isActive: true },
    { id: 6, country: 'India', state: 'Karnataka',   district: 'Bangalore', city: 'Bangalore', pincode: '560037', poName: 'Marathahalli', poLat: 12.9591 as any, poLong: 77.6974 as any, isActive: true },
    { id: 7, country: 'India', state: 'Delhi',       district: 'New Delhi', city: 'New Delhi', pincode: '110001', poName: 'CP', poLat: 28.6332 as any, poLong: 77.2197 as any, isActive: true },
    { id: 8, country: 'India', state: 'Tamil Nadu',  district: 'Chennai', city: 'Chennai', pincode: '600001', poName: 'Chennai GPO', poLat: 13.0827 as any, poLong: 80.2707 as any, isActive: true },
    { id: 9, country: 'India', state: 'West Bengal', district: 'Kolkata', city: 'Kolkata', pincode: '700001', poName: 'Kolkata GPO', poLat: 22.5726 as any, poLong: 88.3639 as any, isActive: true },
    { id:10, country: 'India', state: 'Telangana',   district: 'Hyderabad', city: 'Hyderabad', pincode: '500001', poName: 'Hyderabad GPO', poLat: 17.3850 as any, poLong: 78.4867 as any, isActive: true },
  ], 'geo_hierarchy');

  // ─── 5. PRIVILEGES (global RBAC catalog) ────────────
  const privs: any[] = [];
  const modules = ['tenant','iam','masters','operations','tracking','finance','integrations','notifications','audit','config','vault'];
  const actions = ['view','create','update','delete','approve','print','export','import'];
  let pid = 1;
  for (const m of modules) for (const a of actions) {
    privs.push({ id: pid++, name: `${m}.${a}`, description: `${a} ${m}`, moduleName: m, actionName: a, apiEndpoint: `/${m}`, isActive: true });
  }
  await bulk(prisma.privileges, privs, 'privileges');

  // ─── 6. TENANT (the SaaS root) ──────────────────────
  console.log('\n🏢 Tenant & Organization...');
  await bulk(prisma.tenant, [
    {
      id: 1, code: 'DEMO', name: 'Demo Logistics Pvt Ltd',
      uuid: uuid(1), timezone: 'Asia/Kolkata', languageCode: 'en',
      country: 'India', state: 'Maharashtra', city: 'Pune', pincode: '411001',
      address: '1st Floor, Tech Park, Pune', currencyId: 1, active: true, status: 'active',
    },
  ], 'tenant');

  // ─── 7. ORGANIZATIONS (legal entities under tenant) ─
  await bulk(prisma.organizations, [
    { id: 1, name: 'Demo Logistics Headquarters', code: 'DLH' } as any,
  ], 'organizations');

  // ─── 8. TENANT FEATURE FLAGS ────────────────────────
  await bulk(prisma.tenantFeatureFlags, [
    { id: 1, tenantId: 1, featureFlagId: 1, value: 'true' } as any,
    { id: 2, tenantId: 1, featureFlagId: 2, value: 'true' } as any,
    { id: 3, tenantId: 1, featureFlagId: 3, value: 'true' } as any,
  ], 'tenant_feature_flags');

  // ─── 9. TENANT KYC ──────────────────────────────────
  await bulk(prisma.tenantKyc, [
    {
      id: 1, tenantId: 1, gstNum: '27AAACA1234L1Z2', panNum: 'AAACA1234L',
      cinNum: 'U63010MH2020PTC123456', kycStatus: 'VERIFIED',
    } as any,
  ], 'tenant_kyc');

  // ════════════════════════════════════════════════════
  // PLATFORM CONFIG
  // ════════════════════════════════════════════════════
  console.log('\n⚙️  Platform config...');

  // ─── 10. STATUS MASTER (all 8 modules) ──────────────
  const statuses: any[] = [];
  let sid = 1;
  const statusSet = {
    booking:    [['DRAFT','#9CA3AF',1,false,false],['CONFIRMED','#3B82F6',2,false,false],['LR_GENERATED','#10B981',3,false,false],['CLOSED','#22C55E',4,true,false],['CANCELLED','#EF4444',5,true,false]],
    lr:         [['CREATED','#9CA3AF',1,false,true],['HUB_RECEIVED','#3B82F6',2,false,false],['IN_MANIFEST','#6366F1',3,false,false],['IN_TRANSIT','#F59E0B',4,false,false],['ARRIVED_AT_DEST','#06B6D4',5,false,false],['IN_DRS','#8B5CF6',6,false,false],['OUT_FOR_DELIVERY','#F97316',7,false,false],['DELIVERED','#22C55E',8,true,false],['ATTEMPTED_FAILED','#FB923C',9,false,false],['RTO','#EF4444',10,true,false],['CANCELLED','#DC2626',11,true,false]],
    manifest:   [['CREATED','#9CA3AF',1,false,true],['LOADING','#F59E0B',2,false,false],['DISPATCHED','#3B82F6',3,false,false],['IN_TRANSIT','#6366F1',4,false,false],['ARRIVED','#06B6D4',5,false,false],['CLOSED','#22C55E',6,true,false],['CANCELLED','#EF4444',7,true,false]],
    trip:       [['CREATED','#9CA3AF',1,false,true],['SCHEDULED','#3B82F6',2,false,false],['IN_PROGRESS','#F59E0B',3,false,false],['HALTED','#FB923C',4,false,false],['COMPLETED','#22C55E',5,true,false],['COMPLETED_DELAYED','#EAB308',6,true,false],['CANCELLED','#EF4444',7,true,false]],
    drs:        [['CREATED','#9CA3AF',1,false,true],['DISPATCHED','#3B82F6',2,false,false],['IN_PROGRESS','#F59E0B',3,false,false],['COMPLETED','#22C55E',4,false,false],['RECONCILED','#16A34A',5,true,false],['CANCELLED','#EF4444',6,true,false]],
    pod:        [['UPLOADED','#9CA3AF',1,false,true],['PENDING_VERIFY','#F59E0B',2,false,false],['VERIFIED','#22C55E',3,false,false],['REJECTED','#EF4444',4,false,false],['ON_HOLD','#FB923C',5,false,false],['RE_UPLOADED','#A78BFA',6,false,false],['INVOICE_TRIGGERED','#16A34A',7,true,false]],
    invoice:    [['DRAFT','#9CA3AF',1,false,true],['ISSUED','#3B82F6',2,false,false],['SENT','#6366F1',3,false,false],['ACKNOWLEDGED','#8B5CF6',4,false,false],['PARTIAL_PAID','#F59E0B',5,false,false],['PAID','#22C55E',6,true,false],['DISPUTED','#EF4444',7,false,false],['RESOLVED','#10B981',8,false,false],['WRITTEN_OFF','#6B7280',9,true,false]],
    voucher:    [['DRAFT','#9CA3AF',1,false,true],['PENDING_APPROVAL','#F59E0B',2,false,false],['APPROVED','#10B981',3,false,false],['REJECTED','#EF4444',4,true,false],['ON_HOLD','#FB923C',5,false,false],['PAYMENT_INITIATED','#3B82F6',6,false,false],['PAID','#22C55E',7,true,false]],
  };
  for (const [mod, items] of Object.entries(statusSet)) {
    for (const [code, color, seq, isFinal, isDefault] of items as any[]) {
      statuses.push({
        id: sid++, tenantId: 1, moduleName: mod, statusCode: code, statusName: code.replace(/_/g, ' '),
        colorCode: color, textColor: '#FFFFFF', sequenceNo: seq, isFinalStatus: isFinal, isDefault, isActive: true,
      });
    }
  }
  await bulk(prisma.statusMaster, statuses, 'status_master');

  // ─── 11. REASON MASTER ──────────────────────────────
  const reasons: any[] = [];
  let rid = 1;
  const reasonSet = {
    booking_cancel: ['CUSTOMER_REQUEST', 'DUPLICATE', 'WRONG_DETAILS', 'CREDIT_LIMIT', 'OTHER'],
    lr_cancel:      ['DAMAGE_FOUND', 'WRONG_DESTINATION', 'CUSTOMER_HOLD', 'OTHER'],
    pod_reject:     ['SIGNATURE_UNCLEAR', 'WRONG_RECEIVER', 'PHOTO_BLURRY', 'GPS_MISMATCH', 'DAMAGE_NOTED'],
    delivery_fail:  ['CONSIGNEE_NOT_AVAILABLE', 'ADDRESS_WRONG', 'PAYMENT_REFUSED', 'GOODS_DAMAGED', 'OTHER'],
    voucher_reject: ['RATE_MISMATCH', 'DUPLICATE_TRIP', 'MISSING_DOCS', 'CALCULATION_ERROR'],
    incident:       ['ACCIDENT', 'THEFT', 'BREAKDOWN', 'NATURAL_CAUSE', 'OTHER'],
    invoice_dispute:['AMOUNT_WRONG', 'GST_INCORRECT', 'SERVICE_NOT_RENDERED', 'OTHER'],
  };
  for (const [mt, items] of Object.entries(reasonSet)) {
    const [mod, type] = mt.split('_');
    for (const code of items) {
      reasons.push({
        id: rid++, tenantId: 1, moduleName: mod, reasonType: type,
        reasonCode: code, reasonText: code.replace(/_/g, ' '),
        requiresNote: code === 'OTHER', isActive: true,
      });
    }
  }
  await bulk(prisma.reasonMaster, reasons, 'reason_master');

  // ─── 12. NUMBER SERIES CONFIG (per entity) ──────────
  const series = [
    { id: 1, entityType: 'booking',  prefix: 'BKG', minDigits: 6 },
    { id: 2, entityType: 'lr',       prefix: 'LR',  minDigits: 6 },
    { id: 3, entityType: 'prn',      prefix: 'PRN', minDigits: 6 },
    { id: 4, entityType: 'manifest', prefix: 'MFT', minDigits: 6 },
    { id: 5, entityType: 'trip',     prefix: 'TRP', minDigits: 6 },
    { id: 6, entityType: 'drs',      prefix: 'DRS', minDigits: 6 },
    { id: 7, entityType: 'invoice',  prefix: 'INV', minDigits: 6 },
    { id: 8, entityType: 'voucher',  prefix: 'VCH', minDigits: 6 },
    { id: 9, entityType: 'ewb',      prefix: 'EWB', minDigits: 6 },
    { id:10, entityType: 'incident', prefix: 'INC', minDigits: 6 },
    { id:11, entityType: 'claim',    prefix: 'CLM', minDigits: 6 },
  ].map(s => ({
    ...s, tenantId: 1, financialYear: '2526', currentRunningNo: 0,
    separator: '-', resetType: 'YEARLY', isActive: true,
    exampleOutput: `${s.prefix}-2526-000001`,
  }));
  await bulk(prisma.numberSeriesConfig, series, 'number_series_config');

  // ─── 13. INCIDENT TYPE MASTER ───────────────────────
  await bulk(prisma.incidentTypeMaster, [
    { id: 1, tenantId: 1, incidentCode: 'VEHICLE_BREAKDOWN', incidentName: 'Vehicle Breakdown', severityDefault: 'MEDIUM', requiresPhoto: true,  isClaimApplicable: false, autoHoldShipment: true,  isActive: true },
    { id: 2, tenantId: 1, incidentCode: 'ACCIDENT',          incidentName: 'Accident',           severityDefault: 'HIGH',   requiresPhoto: true,  requiresPoliceDoc: true, requiresRtoDoc: true, isClaimApplicable: true,  autoHoldShipment: true,  isActive: true },
    { id: 3, tenantId: 1, incidentCode: 'THEFT',             incidentName: 'Theft',              severityDefault: 'HIGH',   requiresPhoto: true,  requiresPoliceDoc: true, isClaimApplicable: true,  autoHoldShipment: true,  isActive: true },
    { id: 4, tenantId: 1, incidentCode: 'PRODUCT_DAMAGE',    incidentName: 'Product Damage',     severityDefault: 'MEDIUM', requiresPhoto: true,  isClaimApplicable: true,  autoHoldShipment: false, isActive: true },
    { id: 5, tenantId: 1, incidentCode: 'SHORTAGE',          incidentName: 'Shortage',           severityDefault: 'MEDIUM', requiresPhoto: true,  isClaimApplicable: true,  autoHoldShipment: false, isActive: true },
    { id: 6, tenantId: 1, incidentCode: 'DELAY',             incidentName: 'Delivery Delay',     severityDefault: 'LOW',    requiresPhoto: false, isClaimApplicable: false, autoHoldShipment: false, isActive: true },
  ], 'incident_type_master');

  // ─── 14. INCIDENT ACTION MASTER ─────────────────────
  await bulk(prisma.incidentActionMaster, [
    { id: 1, tenantId: 1, incidentTypeId: 1, actionCode: 'TOW_REQUESTED',  actionName: 'Tow Truck Requested',    defaultSlaHours: 2,  isMandatory: true,  sequenceOrder: 1, isActive: true },
    { id: 2, tenantId: 1, incidentTypeId: 1, actionCode: 'REPAIR_DONE',    actionName: 'Repair Completed',       defaultSlaHours: 24, isMandatory: true,  sequenceOrder: 2, isActive: true },
    { id: 3, tenantId: 1, incidentTypeId: 2, actionCode: 'FIR_FILED',      actionName: 'Police FIR Filed',       defaultSlaHours: 4,  isMandatory: true,  sequenceOrder: 1, isActive: true },
    { id: 4, tenantId: 1, incidentTypeId: 2, actionCode: 'INSURANCE_NOTIFIED', actionName: 'Insurance Notified', defaultSlaHours: 24, isMandatory: true,  sequenceOrder: 2, isActive: true },
    { id: 5, tenantId: 1, incidentTypeId: 3, actionCode: 'FIR_FILED',      actionName: 'Theft FIR Filed',        defaultSlaHours: 2,  isMandatory: true,  sequenceOrder: 1, isActive: true },
    { id: 6, tenantId: 1, incidentTypeId: 4, actionCode: 'PHOTO_UPLOADED', actionName: 'Damage Photo Uploaded',  defaultSlaHours: 1,  isMandatory: true,  sequenceOrder: 1, isActive: true },
  ], 'incident_action_master');

  // ─── 15. PRINT TEMPLATES ────────────────────────────
  await bulk(prisma.printTemplates, [
    { id: 1, tenantId: 1, templateCode: 'LR_A5', name: 'LR — A5 Format', entityType: 'lr', paperSize: 'A5', orientation: 'PORTRAIT', isDefault: true,  isActive: true } as any,
    { id: 2, tenantId: 1, templateCode: 'LR_A4', name: 'LR — A4 Format', entityType: 'lr', paperSize: 'A4', orientation: 'PORTRAIT', isDefault: false, isActive: true } as any,
    { id: 3, tenantId: 1, templateCode: 'MANIFEST_A4', name: 'Manifest — A4',  entityType: 'manifest', paperSize: 'A4', orientation: 'PORTRAIT', isDefault: true, isActive: true } as any,
    { id: 4, tenantId: 1, templateCode: 'INVOICE_A4', name: 'Tax Invoice — A4', entityType: 'invoice', paperSize: 'A4', orientation: 'PORTRAIT', isDefault: true, isActive: true } as any,
    { id: 5, tenantId: 1, templateCode: 'POD_A5', name: 'POD Slip — A5', entityType: 'pod', paperSize: 'A5', orientation: 'PORTRAIT', isDefault: true, isActive: true } as any,
  ], 'print_templates');

  // ─── 16. STATUS AUTOMATION RULES ────────────────────
  await bulk(prisma.statusAutomationRules, [
    { id: 1, tenantId: 1, sourceModule: 'manifest', sourceStatus: 'DISPATCHED', targetModule: 'lr', targetStatus: 'IN_TRANSIT', cascadeType: 'AUTO', isActive: true } as any,
    { id: 2, tenantId: 1, sourceModule: 'manifest', sourceStatus: 'ARRIVED',    targetModule: 'lr', targetStatus: 'ARRIVED_AT_DEST', cascadeType: 'AUTO', isActive: true } as any,
    { id: 3, tenantId: 1, sourceModule: 'drs',      sourceStatus: 'DISPATCHED', targetModule: 'lr', targetStatus: 'OUT_FOR_DELIVERY', cascadeType: 'AUTO', isActive: true } as any,
    { id: 4, tenantId: 1, sourceModule: 'pod',      sourceStatus: 'VERIFIED',   targetModule: 'invoice', targetStatus: 'DRAFT', cascadeType: 'AUTO_CREATE', isActive: true } as any,
    { id: 5, tenantId: 1, sourceModule: 'trip',     sourceStatus: 'COMPLETED',  targetModule: 'voucher', targetStatus: 'DRAFT', cascadeType: 'AUTO_CREATE', isActive: true } as any,
  ], 'status_automation_rules');

  // ════════════════════════════════════════════════════
  // ORGANIZATION
  // ════════════════════════════════════════════════════
  console.log('\n🏛️  Organization (company, office, departments)...');

  // ─── 17. COMPANY ────────────────────────────────────
  await bulk(prisma.company, [
    {
      id: 1, uuid: uuid(2), tenantId: 1, code: 'DEMO',
      name: 'Demo Logistics Pvt Ltd', phone1: '+91-9876543210', email1: 'info@demologistics.in',
      website: 'https://demologistics.in', address: 'Tech Park, Pune',
      gstNum: '27AAACA1234L1Z2', cinNum: 'U63010MH2020PTC123456', panNum: 'AAACA1234L',
      legalEntityType: 'PRIVATE_LIMITED', active: true,
    },
  ], 'company');

  // ─── 18. DEPARTMENTS ────────────────────────────────
  await bulk(prisma.departments, [
    { id: 1, tenantId: 1, code: 'OPS',  name: 'Operations',    description: 'Booking, LR, dispatch',  isActive: true } as any,
    { id: 2, tenantId: 1, code: 'FLT',  name: 'Fleet',         description: 'Vehicles + drivers',     isActive: true } as any,
    { id: 3, tenantId: 1, code: 'FIN',  name: 'Finance',       description: 'Invoicing + vouchers',   isActive: true } as any,
    { id: 4, tenantId: 1, code: 'CRM',  name: 'Sales & CRM',   description: 'Customers + contracts',  isActive: true } as any,
    { id: 5, tenantId: 1, code: 'TRK',  name: 'Tracking',      description: 'Live tracking + claims', isActive: true } as any,
    { id: 6, tenantId: 1, code: 'ADM',  name: 'Administration', description: 'Tenant + users + masters', isActive: true } as any,
  ], 'departments');

  // ─── 19. OFFICE (HO + 3 hubs + 2 branches) ──────────
  await bulk(prisma.office, [
    { id: 1, uuid: uuid(10), tenantId: 1, companyTag: 1, code: 'HO',     name: 'Head Office',          oType: 'HEAD_OFFICE', officeLevel: 1, owned: true, country: 'India', state: 'Maharashtra', city: 'Pune',      pincode: '411001', gstNum: '27AAACA1234L1Z2', active: true },
    { id: 2, uuid: uuid(11), tenantId: 1, companyTag: 1, parentOfficeId: 1, code: 'PUN-HUB', name: 'Pune Hub',      oType: 'HUB',         officeLevel: 2, owned: true, country: 'India', state: 'Maharashtra', city: 'Pune',      pincode: '411014', capacityPackages: 5000, active: true },
    { id: 3, uuid: uuid(12), tenantId: 1, companyTag: 1, parentOfficeId: 1, code: 'MUM-HUB', name: 'Mumbai Hub',    oType: 'HUB',         officeLevel: 2, owned: true, country: 'India', state: 'Maharashtra', city: 'Mumbai',    pincode: '400070', capacityPackages: 8000, active: true },
    { id: 4, uuid: uuid(13), tenantId: 1, companyTag: 1, parentOfficeId: 1, code: 'BLR-HUB', name: 'Bangalore Hub', oType: 'HUB',         officeLevel: 2, owned: true, country: 'India', state: 'Karnataka',  city: 'Bangalore', pincode: '560037', capacityPackages: 6000, active: true },
    { id: 5, uuid: uuid(14), tenantId: 1, companyTag: 1, parentOfficeId: 2, code: 'PUN-VN',  name: 'Pune Viman Nagar Branch', oType: 'BRANCH', officeLevel: 3, owned: true, country: 'India', state: 'Maharashtra', city: 'Pune',      pincode: '411014', active: true },
    { id: 6, uuid: uuid(15), tenantId: 1, companyTag: 1, parentOfficeId: 3, code: 'MUM-KU',  name: 'Mumbai Kurla Branch',     oType: 'BRANCH', officeLevel: 3, owned: true, country: 'India', state: 'Maharashtra', city: 'Mumbai',    pincode: '400070', active: true },
  ], 'office');

  // ─── 20. ROLE ───────────────────────────────────────
  console.log('\n👤 Identity (roles, role-privileges, users)...');
  await bulk(prisma.role, [
    { id: 1, tenantId: 1, name: 'Super Admin',     roleLevel: 1, isSystemRole: true,  officeScope: 'ALL',  departmentScope: 'ALL', isActive: true } as any,
    { id: 2, tenantId: 1, name: 'Tenant Admin',    roleLevel: 2, isSystemRole: true,  officeScope: 'ALL',  departmentScope: 'ALL', isActive: true } as any,
    { id: 3, tenantId: 1, name: 'Branch Manager',  roleLevel: 3, isSystemRole: false, officeScope: 'BRANCH', departmentScope: 'ALL', isActive: true } as any,
    { id: 4, tenantId: 1, name: 'Ops Manager',     roleLevel: 4, isSystemRole: false, officeScope: 'OWN_HIERARCHY', departmentScope: 'OPS', isActive: true } as any,
    { id: 5, tenantId: 1, name: 'Counter Staff',   roleLevel: 5, isSystemRole: false, officeScope: 'OWN_OFFICE', departmentScope: 'OPS', isActive: true } as any,
    { id: 6, tenantId: 1, name: 'Hub Staff',       roleLevel: 5, isSystemRole: false, officeScope: 'OWN_OFFICE', departmentScope: 'OPS', isActive: true } as any,
    { id: 7, tenantId: 1, name: 'Driver',          roleLevel: 6, isSystemRole: false, officeScope: 'OWN_OFFICE', departmentScope: 'FLT', isActive: true } as any,
    { id: 8, tenantId: 1, name: 'Finance Officer', roleLevel: 4, isSystemRole: false, officeScope: 'ALL',  departmentScope: 'FIN', isActive: true } as any,
  ], 'role');

  // ─── 21. ROLE PRIVILEGES (compose link table) ───────
  const rolePrivs: any[] = [];
  // Super Admin & Tenant Admin: ALL privs
  for (let p = 1; p <= privs.length; p++) {
    rolePrivs.push({ roleId: 1, privilegeId: p });
    rolePrivs.push({ roleId: 2, privilegeId: p });
  }
  // Branch Manager: most privs except admin
  for (let p = 1; p <= privs.length; p++) {
    const pv = privs[p - 1];
    if (pv.moduleName !== 'tenant' && pv.actionName !== 'delete') {
      rolePrivs.push({ roleId: 3, privilegeId: p });
    }
  }
  // Ops Manager: operations + tracking + masters view
  for (let p = 1; p <= privs.length; p++) {
    const pv = privs[p - 1];
    if (['operations', 'tracking'].includes(pv.moduleName) || (pv.moduleName === 'masters' && pv.actionName === 'view')) {
      rolePrivs.push({ roleId: 4, privilegeId: p });
    }
  }
  // bulk: composite-PK table, use create with skip-on-conflict
  for (const rp of rolePrivs) {
    try { await prisma.rolePrivileges.create({ data: rp }); } catch { /* duplicate */ }
  }
  console.log(`  ✓ role_privileges: ${rolePrivs.length} bindings attempted`);

  // ─── 22. USERS (one per role) ───────────────────────
  // bcrypt('demo123', 10) for all demo users
  const demoHash = bcrypt.hashSync('demo123', 10);
  await bulk(prisma.users, [
    { id: 1, uuid: uuid(20), tenantId: 1, roleId: 1, employeeCode: 'EMP001', name: 'Super Admin',      loginId: 'superadmin',  email: 'super@demologistics.in',  mobile: '9999999991', passwordHash: demoHash, officeId: 1, departmentId: 6, userType: 'STAFF',  active: true, status: 'active' },
    { id: 2, uuid: uuid(21), tenantId: 1, roleId: 2, employeeCode: 'EMP002', name: 'Tenant Admin',     loginId: 'admin',       email: 'admin@demologistics.in',  mobile: '9999999992', passwordHash: demoHash, officeId: 1, departmentId: 6, userType: 'STAFF',  active: true, status: 'active' },
    { id: 3, uuid: uuid(22), tenantId: 1, roleId: 3, employeeCode: 'EMP003', name: 'Rakesh Sharma',    loginId: 'rakesh.sharma', email: 'rakesh@demologistics.in', mobile: '9999999993', passwordHash: demoHash, officeId: 2, departmentId: 1, userType: 'STAFF', jobTitle: 'Branch Manager', active: true, status: 'active' },
    { id: 4, uuid: uuid(23), tenantId: 1, roleId: 4, employeeCode: 'EMP004', name: 'Priya Patil',      loginId: 'priya.patil', email: 'priya@demologistics.in',  mobile: '9999999994', passwordHash: demoHash, officeId: 2, departmentId: 1, userType: 'STAFF', jobTitle: 'Ops Manager',    active: true, status: 'active' },
    { id: 5, uuid: uuid(24), tenantId: 1, roleId: 5, employeeCode: 'EMP005', name: 'Amit Counter',     loginId: 'amit.counter',email: 'amit@demologistics.in',   mobile: '9999999995', passwordHash: demoHash, officeId: 5, departmentId: 1, userType: 'STAFF', jobTitle: 'Counter Staff',  active: true, status: 'active' },
    { id: 6, uuid: uuid(25), tenantId: 1, roleId: 6, employeeCode: 'EMP006', name: 'Suresh Hub',       loginId: 'suresh.hub',  email: 'suresh@demologistics.in', mobile: '9999999996', passwordHash: demoHash, officeId: 2, departmentId: 1, userType: 'STAFF', jobTitle: 'Hub Staff',      active: true, status: 'active' },
    { id: 7, uuid: uuid(26), tenantId: 1, roleId: 8, employeeCode: 'EMP007', name: 'Neha Finance',     loginId: 'neha.fin',    email: 'neha@demologistics.in',   mobile: '9999999997', passwordHash: demoHash, officeId: 1, departmentId: 3, userType: 'STAFF', jobTitle: 'Finance Officer', active: true, status: 'active' },
  ], 'users');

  // ════════════════════════════════════════════════════
  // PARTNERS — Customer / Vendor / Channel Partner
  // ════════════════════════════════════════════════════
  console.log('\n🤝 Partners (customers, vendors, channel partners)...');

  // ─── 23. CUSTOMER ───────────────────────────────────
  await bulk(prisma.customer, [
    { id: 1, uuid: uuid(30), tenantId: 1, companyTag: 1, primaryServicingOfficeId: 2, code: 'CUST001', name: 'TechCorp India Pvt Ltd', cType: 'CORPORATE', customerType: 'CONTRACT', industryType: 'IT', paymentTypes: ['TBB','PAID'] as any, mobile: '9876543210', email: 'accounts@techcorp.in', billingContactPerson: 'Anil Sales', billingMobile: '9876543211', billingEmail: 'billing@techcorp.in', country: 'India', state: 'Maharashtra', city: 'Pune', pincode: '411014', address: 'IT Park, Viman Nagar', gstNum: '27ABCDE1234E1Z5', panNum: 'ABCDE1234E', creditLimit: 500000 as any, paymentTerms: 'NET30', billingCycle: 'MONTHLY', active: true },
    { id: 2, uuid: uuid(31), tenantId: 1, companyTag: 1, primaryServicingOfficeId: 3, code: 'CUST002', name: 'Mumbai Traders',         cType: 'SME',       customerType: 'WALK_IN',  industryType: 'TRADING', paymentTypes: ['TBB','COD'] as any, mobile: '9876543220', email: 'info@mumbaitraders.in', country: 'India', state: 'Maharashtra', city: 'Mumbai', pincode: '400070', address: 'Kurla West', gstNum: '27XYZAB5678F1Z3', panNum: 'XYZAB5678F', creditLimit: 100000 as any, paymentTerms: 'NET15', billingCycle: 'MONTHLY', active: true },
    { id: 3, uuid: uuid(32), tenantId: 1, companyTag: 1, primaryServicingOfficeId: 4, code: 'CUST003', name: 'Bangalore Bazaar',       cType: 'SME',       customerType: 'CONTRACT', industryType: 'RETAIL',  paymentTypes: ['PAID']         as any, mobile: '9876543230', email: 'logistics@bbazaar.in', country: 'India', state: 'Karnataka', city: 'Bangalore', pincode: '560037', address: 'Marathahalli', gstNum: '29PQRST9012G1Z7', panNum: 'PQRST9012G', creditLimit: 250000 as any, paymentTerms: 'NET30', billingCycle: 'BIWEEKLY', active: true },
  ], 'customer');

  // ─── 24. VENDOR + KYC ───────────────────────────────
  await bulk(prisma.vendor, [
    { id: 1, uuid: uuid(40), tenantId: 1, companyTag: 1, contractingOfficeId: 1, code: 'VEN001', name: 'Royal Transport',   legalName: 'Royal Transport Pvt Ltd',   vType: 'TRANSPORT', vendorCategory: 1, mobile: '9876541001', email: 'ops@royaltransport.in',   vendorRating: 4.2 as any, paymentTerms: 'NET15', active: true, blacklistedFlag: false },
    { id: 2, uuid: uuid(41), tenantId: 1, companyTag: 1, contractingOfficeId: 1, code: 'VEN002', name: 'Speed Carriers',    legalName: 'Speed Carriers India',      vType: 'TRANSPORT', vendorCategory: 1, mobile: '9876541002', email: 'ops@speedcarriers.in',    vendorRating: 4.5 as any, paymentTerms: 'NET30', active: true, blacklistedFlag: false },
  ], 'vendor');

  await bulk(prisma.vendorKyc, [
    { id: 1, vendorId: 1, gstNum: '27AABCR1234L1Z6', panNum: 'AABCR1234L', kycStatus: 'VERIFIED' } as any,
    { id: 2, vendorId: 2, gstNum: '27AAACS5678M1Z9', panNum: 'AAACS5678M', kycStatus: 'VERIFIED' } as any,
  ], 'vendor_kyc');

  // ─── 25. CHANNEL PARTNER + KYC ──────────────────────
  await bulk(prisma.channelPartner, [
    { id: 1, uuid: uuid(45), tenantId: 1, code: 'CP001', name: 'Mumbai Booking Agent', mobile: '9876551001', email: 'mumbai.agent@partners.in', active: true } as any,
  ], 'channel_partner');

  await bulk(prisma.cpKyc, [
    { id: 1, channelPartnerId: 1, gstNum: '27ABCAG1234L1Z8', panNum: 'ABCAG1234L', kycStatus: 'VERIFIED' } as any,
  ], 'cp_kyc');

  // ════════════════════════════════════════════════════
  // FLEET
  // ════════════════════════════════════════════════════
  console.log('\n🚚 Fleet (vehicles + drivers)...');

  // ─── 26. VEHICLES ───────────────────────────────────
  const future1y = new Date(Date.now() + 365 * 24 * 3600 * 1000);
  const future6m = new Date(Date.now() + 180 * 24 * 3600 * 1000);
  await bulk(prisma.vehicles, [
    { id: 1, uuid: uuid(50), tenantId: 1, baseOfficeId: 2, vendorId: 1, rcNum: 'MH12-RC-001', vehicleNum: 'MH12-AB-1234', vehicleOwnership: 'VENDOR', bodyType: 'CONTAINER', make: 'Tata', model: 'Ace', fuelType: 'DIESEL', gvw: '1500',  capacity: '750',  gvwCapacityUnit: 'KG', length: '8', width: '5', height: '6', lwhUnit: 'FT', rtoRegExpiry: future1y as any, insurancePolicyNum: 'INS-001', insuranceExpiry: future1y as any, fitnessCertNum: 'FIT-001', fitnessCertExpiry: future6m as any, permitExpiry: future1y as any, pollutionExpiry: future6m as any, manufacturingYear: '2022', currentOfficeId: 2, active: true, status: 'AVAILABLE' },
    { id: 2, uuid: uuid(51), tenantId: 1, baseOfficeId: 3, vendorId: 1, rcNum: 'MH02-RC-002', vehicleNum: 'MH02-CD-5678', vehicleOwnership: 'VENDOR', bodyType: 'CONTAINER', make: 'Eicher', model: 'Pro 3015', fuelType: 'DIESEL', gvw: '14000', capacity: '8000', gvwCapacityUnit: 'KG', length: '20', width: '7', height: '8', lwhUnit: 'FT', rtoRegExpiry: future1y as any, insurancePolicyNum: 'INS-002', insuranceExpiry: future1y as any, fitnessCertNum: 'FIT-002', fitnessCertExpiry: future6m as any, permitExpiry: future1y as any, pollutionExpiry: future6m as any, manufacturingYear: '2023', currentOfficeId: 3, active: true, status: 'AVAILABLE' },
    { id: 3, uuid: uuid(52), tenantId: 1, baseOfficeId: 4, vendorId: 2, rcNum: 'KA05-RC-003', vehicleNum: 'KA05-EF-9012', vehicleOwnership: 'OWNED', bodyType: 'OPEN_BODY', make: 'Ashok Leyland', model: 'Dost+', fuelType: 'DIESEL', gvw: '2800', capacity: '1500', gvwCapacityUnit: 'KG', length: '10', width: '6', height: '7', lwhUnit: 'FT', rtoRegExpiry: future1y as any, insurancePolicyNum: 'INS-003', insuranceExpiry: future1y as any, fitnessCertNum: 'FIT-003', fitnessCertExpiry: future6m as any, permitExpiry: future1y as any, pollutionExpiry: future6m as any, manufacturingYear: '2024', currentOfficeId: 4, active: true, status: 'AVAILABLE' },
  ], 'vehicles');

  // ─── 27. DRIVERS ────────────────────────────────────
  await bulk(prisma.driver, [
    { id: 1, uuid: uuid(60), tenantId: 1, vendorId: 1, homeOfficeId: 2, name: 'Ramesh Pawar',  mobile: '9876511001', dlNumber: 'MH12-DL-001', dlCategory: 'HMV',  dlExpiryDate: future1y as any, medicalFitnessExpiry: future6m as any, driverStatus: 'AVAILABLE', driverRating: 4.5 as any, totalTrips: 250, active: true } as any,
    { id: 2, uuid: uuid(61), tenantId: 1, vendorId: 1, homeOfficeId: 3, name: 'Suresh Kumar',  mobile: '9876511002', dlNumber: 'MH02-DL-002', dlCategory: 'HMV',  dlExpiryDate: future1y as any, medicalFitnessExpiry: future6m as any, driverStatus: 'AVAILABLE', driverRating: 4.3 as any, totalTrips: 180, active: true } as any,
    { id: 3, uuid: uuid(62), tenantId: 1, vendorId: 2, homeOfficeId: 4, name: 'Mahesh Reddy',  mobile: '9876511003', dlNumber: 'KA05-DL-003', dlCategory: 'LMV',  dlExpiryDate: future1y as any, medicalFitnessExpiry: future6m as any, driverStatus: 'AVAILABLE', driverRating: 4.7 as any, totalTrips: 320, active: true } as any,
  ], 'driver');

  // ════════════════════════════════════════════════════
  // RATES
  // ════════════════════════════════════════════════════
  console.log('\n💰 Rates...');

  await bulk(prisma.driverRate, [
    { id: 1, tenantId: 1, driverId: 1, rateType: 'TRIP',  baseAmount: 1500 as any, currency: 'INR', effectiveFrom: new Date('2025-01-01') as any, active: true } as any,
    { id: 2, tenantId: 1, driverId: 2, rateType: 'TRIP',  baseAmount: 1500 as any, currency: 'INR', effectiveFrom: new Date('2025-01-01') as any, active: true } as any,
    { id: 3, tenantId: 1, driverId: 3, rateType: 'TRIP',  baseAmount: 1200 as any, currency: 'INR', effectiveFrom: new Date('2025-01-01') as any, active: true } as any,
  ], 'driver_rate');

  await bulk(prisma.loaderRate, [
    { id: 1, tenantId: 1, officeId: 2, rateType: 'PER_PACKAGE', baseAmount: 5 as any,  effectiveFrom: new Date('2025-01-01') as any, active: true } as any,
    { id: 2, tenantId: 1, officeId: 3, rateType: 'PER_PACKAGE', baseAmount: 6 as any,  effectiveFrom: new Date('2025-01-01') as any, active: true } as any,
    { id: 3, tenantId: 1, officeId: 4, rateType: 'PER_PACKAGE', baseAmount: 5 as any,  effectiveFrom: new Date('2025-01-01') as any, active: true } as any,
  ], 'loader_rate');

  // ════════════════════════════════════════════════════
  // CONTRACTS (full set: contract + slabs + ODA)
  // ════════════════════════════════════════════════════
  console.log('\n📜 Contracts (with slabs + ODA + excess weight)...');

  await bulk(prisma.custContract, [
    {
      id: 1, tenantId: 1, customerId: 1, contractCode: 'CT-TECHCORP-V1',
      effectiveFrom: new Date('2025-04-01') as any, effectiveUntil: new Date('2026-03-31') as any,
      versionNo: 1, isCurrent: true, approvalStatus: 'APPROVED',
      paymentTerms: 'NET30', billingCycle: 'MONTHLY', active: true,
    } as any,
    {
      id: 2, tenantId: 1, customerId: 3, contractCode: 'CT-BLR-BAZAAR-V1',
      effectiveFrom: new Date('2025-04-01') as any, effectiveUntil: new Date('2026-03-31') as any,
      versionNo: 1, isCurrent: true, approvalStatus: 'APPROVED',
      paymentTerms: 'NET30', billingCycle: 'BIWEEKLY', active: true,
    } as any,
  ], 'cust_contract');

  // ─── slab definitions (5 weight slabs) ─
  await bulk(prisma.custContractSlabDefinition, [
    { id: 1, contractId: 1, slabNo: 1, minWeight: 0    as any, maxWeight: 10   as any, unit: 'KG' } as any,
    { id: 2, contractId: 1, slabNo: 2, minWeight: 10.01 as any, maxWeight: 50   as any, unit: 'KG' } as any,
    { id: 3, contractId: 1, slabNo: 3, minWeight: 50.01 as any, maxWeight: 100  as any, unit: 'KG' } as any,
    { id: 4, contractId: 1, slabNo: 4, minWeight: 100.01 as any, maxWeight: 500 as any, unit: 'KG' } as any,
    { id: 5, contractId: 1, slabNo: 5, minWeight: 500.01 as any, maxWeight: 1000 as any, unit: 'KG' } as any,
    // contract 2 same slabs
    { id: 6,  contractId: 2, slabNo: 1, minWeight: 0     as any, maxWeight: 10   as any, unit: 'KG' } as any,
    { id: 7,  contractId: 2, slabNo: 2, minWeight: 10.01 as any, maxWeight: 50   as any, unit: 'KG' } as any,
    { id: 8,  contractId: 2, slabNo: 3, minWeight: 50.01 as any, maxWeight: 100  as any, unit: 'KG' } as any,
    { id: 9,  contractId: 2, slabNo: 4, minWeight: 100.01 as any, maxWeight: 500 as any, unit: 'KG' } as any,
    { id: 10, contractId: 2, slabNo: 5, minWeight: 500.01 as any, maxWeight: 1000 as any, unit: 'KG' } as any,
  ], 'cust_contract_slab_definition');

  // ─── slab rates (lane × slab → ₹/kg) ─
  // Pune Hub (2) → Mumbai Hub (3), Bangalore Hub (4)
  const slabRates = [
    // contract 1 - Pune ↔ Mumbai
    [1, 2, 3, 1, 25], [1, 2, 3, 2, 22], [1, 2, 3, 3, 20], [1, 2, 3, 4, 18], [1, 2, 3, 5, 16],
    [1, 3, 2, 1, 25], [1, 3, 2, 2, 22], [1, 3, 2, 3, 20], [1, 3, 2, 4, 18], [1, 3, 2, 5, 16],
    // contract 1 - Pune ↔ Bangalore (longer)
    [1, 2, 4, 1, 45], [1, 2, 4, 2, 40], [1, 2, 4, 3, 36], [1, 2, 4, 4, 32], [1, 2, 4, 5, 28],
    // contract 2 - Bangalore ↔ Mumbai
    [2, 4, 3, 1, 50], [2, 4, 3, 2, 45], [2, 4, 3, 3, 40], [2, 4, 3, 4, 36], [2, 4, 3, 5, 30],
  ];
  await bulk(prisma.custContractSlabRates,
    slabRates.map(([cid, from, to, slab, rate], i) => ({
      id: i + 1, contractId: cid, slabDefinitionId: cid === 1 ? slab : slab + 5,
      fromPlaceId: from, toPlaceId: to, rate: rate as any, currency: 'INR',
    } as any)),
    'cust_contract_slab_rates',
  );

  // ─── excess weight rates (above slab 5) ─
  await bulk(prisma.custContractExcessWeight, [
    { id: 1, contractId: 1, fromWeight: 1000.01 as any, rate: 14 as any, unit: 'KG' } as any,
    { id: 2, contractId: 2, fromWeight: 1000.01 as any, rate: 27 as any, unit: 'KG' } as any,
  ], 'cust_contract_excess_weight');

  // ─── ODA charges (out-of-delivery-area) ─
  await bulk(prisma.custContractOdaCharges, [
    { id: 1, contractId: 1, fromPlaceId: 2, toPlaceId: 3, amount: 500  as any } as any,
    { id: 2, contractId: 1, fromPlaceId: 2, toPlaceId: 4, amount: 1000 as any } as any,
    { id: 3, contractId: 2, fromPlaceId: 4, toPlaceId: 3, amount: 1000 as any } as any,
  ], 'cust_contract_oda_charges');

  // ════════════════════════════════════════════════════
  // STATION COVERAGE
  // ════════════════════════════════════════════════════
  console.log('\n📍 Station coverage (pincode → hub)...');
  await bulk(prisma.stationCoverage, [
    { id: 1, tenantId: 1, pincode: '411001', hubId: 2, tatDays: 1, isOda: false, isActive: true } as any,
    { id: 2, tenantId: 1, pincode: '411014', hubId: 2, tatDays: 1, isOda: false, isActive: true } as any,
    { id: 3, tenantId: 1, pincode: '400001', hubId: 3, tatDays: 1, isOda: false, isActive: true } as any,
    { id: 4, tenantId: 1, pincode: '400070', hubId: 3, tatDays: 1, isOda: false, isActive: true } as any,
    { id: 5, tenantId: 1, pincode: '560001', hubId: 4, tatDays: 2, isOda: false, isActive: true } as any,
    { id: 6, tenantId: 1, pincode: '560037', hubId: 4, tatDays: 2, isOda: false, isActive: true } as any,
    { id: 7, tenantId: 1, pincode: '110001', hubId: 3, tatDays: 3, isOda: true,  isActive: true } as any,  // ODA via Mumbai
    { id: 8, tenantId: 1, pincode: '600001', hubId: 4, tatDays: 3, isOda: true,  isActive: true } as any,  // ODA via Bangalore
    { id: 9, tenantId: 1, pincode: '700001', hubId: 3, tatDays: 4, isOda: true,  isActive: true } as any,
    { id:10, tenantId: 1, pincode: '500001', hubId: 4, tatDays: 2, isOda: false, isActive: true } as any,
  ], 'station_coverage');

  // ════════════════════════════════════════════════════
  // POLYMORPHIC VAULT (sample data per entity)
  // ════════════════════════════════════════════════════
  console.log('\n🔐 Polymorphic vault (addresses, contacts, banks, tax, docs)...');

  await bulk(prisma.addresses, [
    { id: 1, tenantId: 1, ownerType: 'customer', ownerId: 1, addressType: 'BILLING',  line1: 'IT Park, Tower B',  city: 'Pune',      state: 'Maharashtra', pincode: '411014', country: 'India', isPrimary: true } as any,
    { id: 2, tenantId: 1, ownerType: 'customer', ownerId: 1, addressType: 'SHIPPING', line1: 'Warehouse 4, MIDC', city: 'Pune',      state: 'Maharashtra', pincode: '411019', country: 'India', isPrimary: false } as any,
    { id: 3, tenantId: 1, ownerType: 'customer', ownerId: 2, addressType: 'BILLING',  line1: 'Kurla West Plaza', city: 'Mumbai',    state: 'Maharashtra', pincode: '400070', country: 'India', isPrimary: true } as any,
    { id: 4, tenantId: 1, ownerType: 'customer', ownerId: 3, addressType: 'BILLING',  line1: 'Marathahalli HQ',  city: 'Bangalore', state: 'Karnataka',   pincode: '560037', country: 'India', isPrimary: true } as any,
    { id: 5, tenantId: 1, ownerType: 'vendor',   ownerId: 1, addressType: 'OFFICE',   line1: 'Logistics Park',   city: 'Pune',      state: 'Maharashtra', pincode: '411001', country: 'India', isPrimary: true } as any,
  ], 'addresses');

  await bulk(prisma.contactPersons, [
    { id: 1, tenantId: 1, ownerType: 'customer', ownerId: 1, name: 'Anil Sales',   designation: 'Sales Head',   mobile: '9876543211', email: 'anil@techcorp.in',  isPrimary: true } as any,
    { id: 2, tenantId: 1, ownerType: 'customer', ownerId: 1, name: 'Geeta Accts',  designation: 'Accountant',   mobile: '9876543212', email: 'geeta@techcorp.in', isPrimary: false } as any,
    { id: 3, tenantId: 1, ownerType: 'customer', ownerId: 2, name: 'Rakesh Owner', designation: 'Proprietor',   mobile: '9876543221', email: 'rakesh@mumbaitraders.in', isPrimary: true } as any,
    { id: 4, tenantId: 1, ownerType: 'vendor',   ownerId: 1, name: 'Manoj Ops',    designation: 'Ops Manager',  mobile: '9876541011', email: 'manoj@royaltransport.in', isPrimary: true } as any,
    { id: 5, tenantId: 1, ownerType: 'vendor',   ownerId: 2, name: 'Vijay Owner',  designation: 'Director',     mobile: '9876541021', email: 'vijay@speedcarriers.in',  isPrimary: true } as any,
  ], 'contact_persons');

  await bulk(prisma.bankAccounts, [
    { id: 1, tenantId: 1, ownerType: 'tenant',   ownerId: 1, accountName: 'Demo Logistics',  accountNumber: '50100123456789', ifscCode: 'HDFC0001234', bankName: 'HDFC Bank',     branchName: 'Pune Camp',    accountType: 'CURRENT', isPrimary: true } as any,
    { id: 2, tenantId: 1, ownerType: 'vendor',   ownerId: 1, accountName: 'Royal Transport', accountNumber: '912010987654321', ifscCode: 'ICIC0002345', bankName: 'ICICI Bank',    branchName: 'Mumbai Main',  accountType: 'CURRENT', isPrimary: true } as any,
    { id: 3, tenantId: 1, ownerType: 'vendor',   ownerId: 2, accountName: 'Speed Carriers',  accountNumber: '00060123456789', ifscCode: 'SBIN0003456', bankName: 'State Bank',    branchName: 'Delhi CP',     accountType: 'CURRENT', isPrimary: true } as any,
    { id: 4, tenantId: 1, ownerType: 'driver',   ownerId: 1, accountName: 'Ramesh Pawar',    accountNumber: '40050098765432', ifscCode: 'HDFC0001234', bankName: 'HDFC Bank',     branchName: 'Pune Camp',    accountType: 'SAVINGS', isPrimary: true } as any,
  ], 'bank_accounts');

  await bulk(prisma.taxRegistrations, [
    { id: 1, tenantId: 1, ownerType: 'tenant',   ownerId: 1, taxType: 'GST', registrationNo: '27AAACA1234L1Z2', state: 'Maharashtra', validFrom: new Date('2020-01-01') as any, isPrimary: true } as any,
    { id: 2, tenantId: 1, ownerType: 'customer', ownerId: 1, taxType: 'GST', registrationNo: '27ABCDE1234E1Z5', state: 'Maharashtra', validFrom: new Date('2020-01-01') as any, isPrimary: true } as any,
    { id: 3, tenantId: 1, ownerType: 'customer', ownerId: 3, taxType: 'GST', registrationNo: '29PQRST9012G1Z7', state: 'Karnataka',   validFrom: new Date('2020-01-01') as any, isPrimary: true } as any,
    { id: 4, tenantId: 1, ownerType: 'vendor',   ownerId: 1, taxType: 'GST', registrationNo: '27AABCR1234L1Z6', state: 'Maharashtra', validFrom: new Date('2021-01-01') as any, isPrimary: true } as any,
  ], 'tax_registrations');

  await bulk(prisma.documents, [
    { id: 1, tenantId: 1, ownerType: 'vehicle', ownerId: 1, docTypeId: 5, docNumber: 'INS-001',    documentUrl: 's3://demo/ins-mh12.pdf',  expiryDate: future1y as any, verificationStatus: 'VERIFIED' } as any,
    { id: 2, tenantId: 1, ownerType: 'vehicle', ownerId: 1, docTypeId: 6, docNumber: 'FIT-001',    documentUrl: 's3://demo/fit-mh12.pdf',  expiryDate: future6m as any, verificationStatus: 'VERIFIED' } as any,
    { id: 3, tenantId: 1, ownerType: 'driver',  ownerId: 1, docTypeId: 9, docNumber: 'MH12-DL-001', documentUrl: 's3://demo/dl-ramesh.pdf', expiryDate: future1y as any, verificationStatus: 'VERIFIED' } as any,
    { id: 4, tenantId: 1, ownerType: 'driver',  ownerId: 2, docTypeId: 9, docNumber: 'MH02-DL-002', documentUrl: 's3://demo/dl-suresh.pdf', expiryDate: future1y as any, verificationStatus: 'VERIFIED' } as any,
    { id: 5, tenantId: 1, ownerType: 'customer',ownerId: 1, docTypeId: 1, docNumber: 'GST-CERT-1',  documentUrl: 's3://demo/gst-techcorp.pdf',           verificationStatus: 'VERIFIED' } as any,
  ], 'documents');

  // ════════════════════════════════════════════════════
  // NOTIFICATIONS
  // ════════════════════════════════════════════════════
  console.log('\n📧 Notification templates...');
  await bulk(prisma.notificationTemplates, [
    { id: 1, tenantId: 1, templateCode: 'LR_CREATED_SMS',          channel: 'SMS',      eventName: 'lr.created',     subject: '',                                  bodyTemplate: 'Dear {{consigneeName}}, your shipment LR# {{lrNo}} from {{consignor}} has been booked. Track: {{trackUrl}}', isActive: true } as any,
    { id: 2, tenantId: 1, templateCode: 'LR_DISPATCHED_SMS',       channel: 'SMS',      eventName: 'lr.dispatched',  subject: '',                                  bodyTemplate: 'LR# {{lrNo}} dispatched on {{date}}. ETA: {{eta}}. Track: {{trackUrl}}',                              isActive: true } as any,
    { id: 3, tenantId: 1, templateCode: 'LR_OFD_SMS',              channel: 'SMS',      eventName: 'lr.ofd',         subject: '',                                  bodyTemplate: 'Out for delivery today. LR# {{lrNo}}. Driver: {{driverName}} ({{driverMobile}})',                     isActive: true } as any,
    { id: 4, tenantId: 1, templateCode: 'LR_DELIVERED_SMS',        channel: 'SMS',      eventName: 'lr.delivered',   subject: '',                                  bodyTemplate: 'LR# {{lrNo}} delivered on {{date}} at {{time}}. Thank you for choosing {{tenantName}}.',              isActive: true } as any,
    { id: 5, tenantId: 1, templateCode: 'INVOICE_GENERATED_EMAIL', channel: 'EMAIL',    eventName: 'invoice.issued', subject: 'Invoice {{invoiceNo}} from {{tenantName}}', bodyTemplate: 'Dear {{customerName}},\nAttached please find tax invoice {{invoiceNo}} for ₹{{amount}}.\nDue date: {{dueDate}}.', isActive: true } as any,
    { id: 6, tenantId: 1, templateCode: 'POD_VERIFIED_WHATSAPP',   channel: 'WHATSAPP', eventName: 'pod.verified',   subject: '',                                  bodyTemplate: 'POD verified for LR {{lrNo}}. Photo: {{podUrl}}',                                                     isActive: true } as any,
    { id: 7, tenantId: 1, templateCode: 'DRIVER_TASK_PUSH',        channel: 'PUSH',     eventName: 'driver.task',    subject: 'New {{taskType}} task',             bodyTemplate: 'You have a new {{taskType}}: {{taskNo}} at {{location}}',                                             isActive: true } as any,
  ], 'notification_templates');

  // ════════════════════════════════════════════════════
  // INTEGRATIONS
  // ════════════════════════════════════════════════════
  console.log('\n🔌 Integrations & webhook configs...');
  await bulk(prisma.apiIntegrations, [
    { id: 1, tenantId: 1, integrationCode: 'GST_EWB',     providerName: 'NIC GST Portal',     integrationType: 'EWAYBILL',  status: 'CONFIGURED', isActive: true } as any,
    { id: 2, tenantId: 1, integrationCode: 'SAP_ERP',     providerName: 'SAP S/4HANA',         integrationType: 'ERP',       status: 'CONFIGURED', isActive: false } as any,
    { id: 3, tenantId: 1, integrationCode: 'GPS_UFFIZIO', providerName: 'Uffizio GPS',         integrationType: 'GPS',       status: 'CONFIGURED', isActive: true } as any,
    { id: 4, tenantId: 1, integrationCode: 'SMS_MSG91',   providerName: 'MSG91',               integrationType: 'SMS',       status: 'CONFIGURED', isActive: true } as any,
    { id: 5, tenantId: 1, integrationCode: 'WA_GUPSHUP',  providerName: 'Gupshup WhatsApp',    integrationType: 'WHATSAPP',  status: 'CONFIGURED', isActive: true } as any,
    { id: 6, tenantId: 1, integrationCode: 'MAPS_GOOGLE', providerName: 'Google Maps',         integrationType: 'MAPS',      status: 'CONFIGURED', isActive: true } as any,
  ], 'api_integrations');

  await bulk(prisma.apiProviderConfig, [
    { id: 1, integrationId: 1, configKey: 'BASE_URL', configValue: 'https://api-sandbox.gst.gov.in',     isEncrypted: false } as any,
    { id: 2, integrationId: 1, configKey: 'API_KEY',  configValue: 'ENC::ewb-demo-key',                  isEncrypted: true  } as any,
    { id: 3, integrationId: 3, configKey: 'BASE_URL', configValue: 'https://api.uffizio.com/v2',        isEncrypted: false } as any,
    { id: 4, integrationId: 3, configKey: 'TOKEN',    configValue: 'ENC::gps-demo-token',                isEncrypted: true  } as any,
    { id: 5, integrationId: 4, configKey: 'SENDER_ID',configValue: 'DEMOLOG',                            isEncrypted: false } as any,
    { id: 6, integrationId: 4, configKey: 'API_KEY',  configValue: 'ENC::msg91-demo-key',                isEncrypted: true  } as any,
  ], 'api_provider_config');

  await bulk(prisma.webhookConfigs, [
    { id: 1, tenantId: 1, eventName: 'lr.delivered',   targetUrl: 'https://customer-erp.example/webhooks/tms', secret: 'demo-secret-1', isActive: true } as any,
    { id: 2, tenantId: 1, eventName: 'invoice.issued', targetUrl: 'https://customer-erp.example/webhooks/tms', secret: 'demo-secret-1', isActive: true } as any,
  ], 'webhook_configs');

  // ════════════════════════════════════════════════════
  // WORKFLOW + DASHBOARDS
  // ════════════════════════════════════════════════════
  console.log('\n🔄 Workflows & dashboards...');
  await bulk(prisma.workflowMaster, [
    { id: 1, tenantId: 1, workflowCode: 'POD_APPROVAL',    name: 'POD Approval Workflow',      entityType: 'pod',     steps: 2, isActive: true } as any,
    { id: 2, tenantId: 1, workflowCode: 'VOUCHER_APPROVAL', name: 'Vendor Voucher Approval',   entityType: 'voucher', steps: 2, isActive: true } as any,
    { id: 3, tenantId: 1, workflowCode: 'CONTRACT_APPROVAL', name: 'Customer Contract Approval', entityType: 'contract', steps: 2, isActive: true } as any,
  ], 'workflow_master');

  await bulk(prisma.dashboards, [
    { id: 1, tenantId: 1, code: 'OPS_OVERVIEW',  name: 'Operations Overview', layout: { cols: 4 } as any, isDefault: true,  isActive: true } as any,
    { id: 2, tenantId: 1, code: 'FIN_OVERVIEW',  name: 'Finance Overview',    layout: { cols: 3 } as any, isDefault: false, isActive: true } as any,
    { id: 3, tenantId: 1, code: 'FLEET_OVERVIEW', name: 'Fleet Overview',     layout: { cols: 3 } as any, isDefault: false, isActive: true } as any,
  ], 'dashboards');

  await bulk(prisma.dashboardWidgets, [
    { id: 1, dashboardId: 1, widgetCode: 'TODAY_BOOKINGS',  name: 'Today Bookings',  widgetType: 'COUNTER', position: 1, config: { metric: 'count', table: 'txn_booking', where: { today: true } } as any } as any,
    { id: 2, dashboardId: 1, widgetCode: 'PENDING_POD',     name: 'Pending POD',     widgetType: 'COUNTER', position: 2, config: { metric: 'count', table: 'txn_pod', where: { status: 'PENDING_VERIFY' } } as any } as any,
    { id: 3, dashboardId: 1, widgetCode: 'LIVE_VEHICLES',   name: 'Live Vehicles',   widgetType: 'MAP',     position: 3, config: { source: 'txn_vehicle_location_logs' } as any } as any,
    { id: 4, dashboardId: 2, widgetCode: 'AR_AGING',        name: 'AR Aging',        widgetType: 'CHART',   position: 1, config: { chart: 'bar', source: 'txn_customer_invoice' } as any } as any,
    { id: 5, dashboardId: 3, widgetCode: 'EXPIRING_DOCS',   name: 'Expiring Docs',   widgetType: 'LIST',    position: 1, config: { entity: 'vehicle', days: 30 } as any } as any,
  ], 'dashboard_widgets');

  // ════════════════════════════════════════════════════
  // DONE
  // ════════════════════════════════════════════════════
  console.log('\n✅ Seed complete!');
  console.log('\nDemo credentials:');
  console.log('  superadmin / demo123   — Super Admin');
  console.log('  admin / demo123        — Tenant Admin');
  console.log('  priya.patil / demo123  — Ops Manager');
  console.log('  amit.counter / demo123 — Counter Staff');
  console.log('\nDemo tenant: DEMO  |  Demo customers: TechCorp, Mumbai Traders, Bangalore Bazaar');
  console.log('\nWhat is NOT seeded (created via app flow):');
  console.log('  • Bookings, LRs, EWBs, PRNs, manifests, trips, DRS, POD');
  console.log('  • Invoices, vouchers, fuel logs, loader expenses');
  console.log('  • Tracking events, GPS logs, incidents, claims');
  console.log('  • Notification logs, integration logs, webhook logs, activity logs');
  console.log('  → these grow as you USE the system.\n');
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
