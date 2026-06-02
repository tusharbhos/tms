import { CreateStationCoverageSchema } from '../dto/create-station-coverage.dto';
import { UpdateStationCoverageSchema } from '../dto/update-station-coverage.dto';

// Thin re-export so callers can import validators from one place.
// Add cross-field / business-rule refinements here as the domain grows.
export const validators = {
  create: CreateStationCoverageSchema,
  update: UpdateStationCoverageSchema,
};
