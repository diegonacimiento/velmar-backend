import { ROLE } from './role.model';

export interface PayloadToken {
  role: ROLE;
  sub: number;
}
