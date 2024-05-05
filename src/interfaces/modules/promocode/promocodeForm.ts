import dayjs from 'dayjs';

import EDiscountType from '@/enums/modules/promocode/discountType';
import EType from '@/enums/modules/promocode/type';
import IOption from '@/interfaces/molecules/select/option';
import TId from '@/types/id';

export default interface IPromocodeForm {
  id?: TId;
  school_id: IOption | undefined;
  uuid: string | undefined;
  code: string | undefined;
  title: string | undefined;
  description: string | undefined;
  min_price: number | undefined;
  discount: number | undefined;
  discount_type: EDiscountType | undefined;
  date_start: dayjs.Dayjs | string | undefined;
  date_end: dayjs.Dayjs | string | undefined;
  type: EType | undefined;
  url: string | undefined;
  status: boolean;
}
