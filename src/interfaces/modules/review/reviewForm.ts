import EStatus from '@/enums/modules/review/status';
import IOption from '@/interfaces/molecules/autoComplete/option';
import TId from '@/types/id';

export default interface IReviewForm {
  id?: TId;
  school_id: TId | null;
  course_id: IOption | null;
  name: string;
  title: string | null;
  advantages: string | null;
  disadvantages: string | null;
  rating: number;
  status: EStatus;
}
