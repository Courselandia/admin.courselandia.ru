import IOption from '@/interfaces/molecules/select/option';
import TId from '@/types/id';

export default interface IFaqForm {
  id?: TId;
  school_id: IOption | undefined;
  question: string;
  answer: string | undefined;
  status: boolean;
}
