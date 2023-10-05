import ERole from '@/enums/modules/user/role';
import TId from '@/types/id';

export default interface IUserForm {
  id?: TId;
  login: string | undefined;
  password: string | undefined;
  first_name: string | undefined;
  second_name: string | undefined;
  phone: string | undefined;
  two_factor: boolean;
  verified: boolean;
  invitation?: boolean;
  status: boolean;
  role: ERole | undefined;
  image: File | undefined;
}
