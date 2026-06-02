import { z } from 'zod';

// CREATE DTO for api_integrations — validated business fields only.
export const CreateApiIntegrationsSchema = z.object({
  name: z.string(),
  baseUrl: z.string().optional().nullable(),
  apiKey: z.string().optional().nullable(),
  authType: z.string().optional().nullable(),
  oauthToken: z.string().optional().nullable(),
  rateLimitPerMin: z.number().optional().nullable(),
  retryPolicy: z.number().optional().nullable(),
  timeoutSeconds: z.number().optional().nullable(),
  active: z.boolean().optional().nullable(),
});

export type CreateApiIntegrationsDto = z.infer<typeof CreateApiIntegrationsSchema>;