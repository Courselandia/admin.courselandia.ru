import dayjs from 'dayjs';

import IOption from '@/interfaces/molecules/select/option';
import TId from '@/types/id';

export default interface IPromotionForm {
  id?: TId;
  school_id: IOption | undefined;
  uuid: string | undefined;
  title: string | undefined;
  description: string | undefined;
  date_start: dayjs.Dayjs | string | undefined;
  date_end: dayjs.Dayjs | string | undefined;
  url: string | undefined;
  status: boolean;
}
