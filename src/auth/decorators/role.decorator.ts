import { SetMetadata } from '@nestjs/common';

import { ROLE } from '../models/role.model';

export const ROLE_KEY = 'role';

export const Role = (...role: ROLE[]) => SetMetadata(ROLE_KEY, role);
