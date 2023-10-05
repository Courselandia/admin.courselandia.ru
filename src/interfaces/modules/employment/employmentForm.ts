import TId from '@/types/id';

export default interface IEmploymentForm {
  id?: TId;
  name: string | undefined;
  text: string | undefined;
  status: boolean;
}
