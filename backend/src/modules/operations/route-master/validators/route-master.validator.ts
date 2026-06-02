import { CreateRouteMasterSchema } from '../dto/create-route-master.dto';
import { UpdateRouteMasterSchema } from '../dto/update-route-master.dto';

// Thin re-export so callers can import validators from one place.
// Add cross-field / business-rule refinements here as the domain grows.
export const validators = {
  create: CreateRouteMasterSchema,
  update: UpdateRouteMasterSchema,
};
