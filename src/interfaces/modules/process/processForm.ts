import TId from '@/types/id';

export default interface IProcessForm {
  id?: TId;
  name: string;
  text: string | null;
  status: boolean;
}
