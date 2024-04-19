import TId from '@/types/id';

export default interface IFaqForm {
  id?: TId;
  variant: string | undefined;
  term: string | undefined;
  status: boolean;
}
