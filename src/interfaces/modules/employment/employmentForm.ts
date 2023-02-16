import TId from '@/types/id';

export default interface IEmploymentForm {
  id?: TId;
  name: string;
  text: string | null;
  status: boolean;
}
