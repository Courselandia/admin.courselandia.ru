import EDiscountType from '@/enums/modules/promocode/discountType';
import EType from '@/enums/modules/promocode/type';
import ISchool from '@/interfaces/modules/school/school';
import IColumn from '@/interfaces/molecules/table/column';
import TId from '@/types/id';

export default interface IPromocode extends IColumn {
  id: TId;
  school_id: TId;
  uuid: string | null;
  code: string;
  title: string;
  description: string | null;
  min_price: number | null;
  discount: number | null;
  discount_type: EDiscountType | null;
  date_start: string | null;
  date_end: string | null;
  type: EType;
  url: string;
  status: boolean;
  applicable: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  school: ISchool;
}
