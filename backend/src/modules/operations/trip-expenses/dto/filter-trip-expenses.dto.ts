import { z } from 'zod';

// FILTER / pagination DTO for list endpoints.
export const FilterTripExpensesSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  size: z.coerce.number().int().min(1).max(200).default(25),
  sort: z.string().optional(),         // e.g. "createdAt:desc"
  search: z.string().optional(),
  status: z.string().optional(),
  includeDeleted: z.coerce.boolean().default(false),
});
export type FilterTripExpensesDto = z.infer<typeof FilterTripExpensesSchema>;
