import IImage from '@/interfaces/modules/image';
import IRole from '@/interfaces/modules/user/role';
import IVerification from '@/interfaces/modules/user/verification';
import IColumn from '@/interfaces/molecules/table/column';
import TId from '@/types/id';

export default interface IUser extends IColumn {
  id: TId;
  image_small_id: IImage | null;
  image_middle_id: IImage | null;
  image_big_id: IImage | null;
  login: string;
  password: string | null;
  remember_token: string | null;
  first_name: string | null;
  second_name: string | null;
  phone: string | null;
  two_factor: boolean;
  status: boolean;
  flags: Record<string, string | number | null>;
  recovery: string | null;
  verification: IVerification;
  role: IRole;
  created_at: string;
  updated_at: string;
  deleted_at: string
}
