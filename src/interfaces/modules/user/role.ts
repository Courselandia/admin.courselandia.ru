import ERole from '@/enums/modules/user/role';
import TId from '@/types/id';

export default interface IRole {
  id: TId;
  user_id: TId;
  name: ERole;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}
