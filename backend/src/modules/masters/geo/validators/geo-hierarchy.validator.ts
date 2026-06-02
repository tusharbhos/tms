import { CreateGeoHierarchySchema } from '../dto/create-geo-hierarchy.dto';
import { UpdateGeoHierarchySchema } from '../dto/update-geo-hierarchy.dto';

// Thin re-export so callers can import validators from one place.
// Add cross-field / business-rule refinements here as the domain grows.
export const validators = {
  create: CreateGeoHierarchySchema,
  update: UpdateGeoHierarchySchema,
};
