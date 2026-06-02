import { z } from 'zod';

// CREATE DTO for station_coverage — validated business fields only.
export const CreateStationCoverageSchema = z.object({
  servicingOfficeId: z.number(),
  name: z.string(),
  nameReg: z.string().optional().nullable(),
  postName: z.string().optional().nullable(),
  postNameReg: z.string().optional().nullable(),
  pincode: z.string().optional().nullable(),
  taluka: z.string().optional().nullable(),
  talukaReg: z.string().optional().nullable(),
  district: z.string().optional().nullable(),
  districtReg: z.string().optional().nullable(),
  state: z.string().optional().nullable(),
  stateReg: z.string().optional().nullable(),
  country: z.string().optional().nullable(),
  latitude: z.number().optional().nullable(),
  longitude: z.number().optional().nullable(),
  nameGmap: z.string().optional().nullable(),
  serviceOfficeTat: z.number().optional().nullable(),
  servicingOfficeDist: z.number().optional().nullable(),
  zone: z.string().optional().nullable(),
  routeNum: z.string().optional().nullable(),
  routeSequence: z.number().optional().nullable(),
  oda: z.boolean().optional().nullable(),
  nrStateHighway: z.string().optional().nullable(),
  nrNationalHighway: z.string().optional().nullable(),
  active: z.boolean().optional().nullable(),
  status: z.string(),
  note: z.string().optional().nullable(),
});

export type CreateStationCoverageDto = z.infer<typeof CreateStationCoverageSchema>;