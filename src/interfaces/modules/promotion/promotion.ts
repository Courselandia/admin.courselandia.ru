import ISchool from '@/interfaces/modules/school/school';
import IColumn from '@/interfaces/molecules/table/column';
import TId from '@/types/id';

export default interface IPromotion extends IColumn {
  id: TId;
  school_id: TId;
  uuid: string | null;
  title: string;
  description: string | null;
  date_start: string | null;
  date_end: string | null;
  url: string;
  status: boolean;
  applicable: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  school: ISchool;
}
