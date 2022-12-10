import IOption from '@/interfaces/molecules/select/option';
import TId from '@/types/id';

export default interface IFaqForm {
  id?: TId;
  school_id: IOption | null;
  question: string;
  answer: string | null;
  status: boolean;
}
