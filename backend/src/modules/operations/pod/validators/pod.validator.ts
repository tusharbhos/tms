import { CreatePodSchema } from '../dto/create-pod.dto';
import { UpdatePodSchema } from '../dto/update-pod.dto';

// Thin re-export so callers can import validators from one place.
// Add cross-field / business-rule refinements here as the domain grows.
export const validators = {
  create: CreatePodSchema,
  update: UpdatePodSchema,
};
