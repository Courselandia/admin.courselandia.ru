import dayjs from 'dayjs';

import EStatus from '@/enums/modules/review/status';
import IOption from '@/interfaces/molecules/select/option';
import TId from '@/types/id';

export default interface IReviewForm {
  id?: TId;
  school_id: IOption | undefined;
  course_id: IOption | undefined;
  source: number | undefined;
  name: string | undefined;
  title: string | undefined;
  review: string | undefined;
  advantages: string | undefined;
  disadvantages: string | undefined;
  rating: number | string | undefined;
  status: EStatus;
  created_at: dayjs.Dayjs | string | undefined;
}
