import { CreateCpKycSchema } from '../dto/create-cp-kyc.dto';
import { UpdateCpKycSchema } from '../dto/update-cp-kyc.dto';

// Thin re-export so callers can import validators from one place.
// Add cross-field / business-rule refinements here as the domain grows.
export const validators = {
  create: CreateCpKycSchema,
  update: UpdateCpKycSchema,
};
