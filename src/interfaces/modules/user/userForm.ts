import ERole from '@/enums/modules/user/role';
import TId from '@/types/id';

export default interface IUserForm {
  id?: TId;
  login: string;
  password: string;
  first_name: string | null;
  second_name: string | null;
  phone: string | null;
  two_factor: boolean;
  verified: boolean;
  invitation?: boolean;
  status: boolean;
  role: ERole | null;
  image: File | null;
}
