import TId from '@/types/id';

export default interface IProcessForm {
  id?: TId;
  name: string | undefined;
  text: string | undefined;
  status: boolean;
}
