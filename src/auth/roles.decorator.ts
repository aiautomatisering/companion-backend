import { AllowedRoles } from '@prisma/client';

import { SetMetadata } from '@nestjs/common';
export const ROLES_KEY = 'roles';
export const Roles = (...roles: AllowedRoles[]) => {
  return SetMetadata(ROLES_KEY, roles);
};
