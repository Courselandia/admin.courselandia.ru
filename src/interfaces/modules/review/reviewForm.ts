import dayjs from 'dayjs';

import EStatus from '@/enums/modules/review/status';
import IOption from '@/interfaces/molecules/select/option';
import TId from '@/types/id';

export default interface IReviewForm {
  id?: TId;
  school_id: IOption | null;
  course_id: IOption | null;
  source: number | null;
  name: string | null;
  title: string | null;
  review: string | null;
  advantages: string | null;
  disadvantages: string | null;
  rating: number | null;
  status: EStatus;
  created_at: dayjs.Dayjs | null;
}
