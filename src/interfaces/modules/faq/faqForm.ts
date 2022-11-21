import TId from '@/types/id';

export default interface IFaqForm {
  id?: TId;
  school_id: TId | null;
  question: string;
  answer: string | null;
  status: boolean;
}
