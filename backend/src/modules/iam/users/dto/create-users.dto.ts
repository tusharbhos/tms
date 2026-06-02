import { z } from 'zod';

// CREATE DTO for users — validated business fields only.
export const CreateUsersSchema = z.object({
  roleId: z.number(),
  employeeCode: z.string().optional().nullable(),
  name: z.string(),
  loginId: z.string(),
  userType: z.string().optional().nullable(),
  profilePicUrl: z.string().optional().nullable(),
  jobTitle: z.string().optional().nullable(),
  designation: z.string().optional().nullable(),
  department: z.string().optional().nullable(),
  departmentId: z.number(),
  mobile: z.string(),
  email: z.string().email().optional().nullable(),
  email2: z.string().email().optional().nullable(),
  passwordHash: z.string().optional().nullable(),
  googleId: z.string(),
  ssoId: z.string(),
  ssoRef: z.string().optional().nullable(),
  aadhaar: z.string().optional().nullable(),
  pan: z.string().optional().nullable(),
  epfUan: z.string().optional().nullable(),
  epfNum: z.string().optional().nullable(),
  esic: z.string().optional().nullable(),
  officeId: z.number(),
  managerUserId: z.number(),
  lastLogin: z.coerce.date().optional().nullable(),
  lastPasswordReset: z.coerce.date().optional().nullable(),
  failedLoginAttempts: z.number().optional().nullable(),
  active: z.boolean().optional().nullable(),
  status: z.string(),
  remarks: z.string().optional().nullable(),
});

export type CreateUsersDto = z.infer<typeof CreateUsersSchema>;