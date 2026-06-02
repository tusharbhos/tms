import { z } from 'zod';

// CREATE DTO for api_provider_config — validated business fields only.
export const CreateApiProviderConfigSchema = z.object({
  providerType: z.string().optional().nullable(),
  providerName: z.string().optional().nullable(),
  providerCode: z.string().optional().nullable(),
  baseUrl: z.string().optional().nullable(),
  apiKey: z.string().optional().nullable(),
  apiSecret: z.string().optional().nullable(),
  username: z.string().optional().nullable(),
  password: z.string().optional().nullable(),
  authType: z.string().optional().nullable(),
  tokenEndpoint: z.string().optional().nullable(),
  webhookSecret: z.string().optional().nullable(),
  timeoutSeconds: z.number().optional().nullable(),
  retryMax: z.number().optional().nullable(),
  extraConfig: z.record(z.any()).optional().nullable(),
  environment: z.string().optional().nullable(),
  isActive: z.boolean().optional().nullable(),
  lastTestedAt: z.coerce.date().optional().nullable(),
});

export type CreateApiProviderConfigDto = z.infer<typeof CreateApiProviderConfigSchema>;