import EStatus from '@/enums/modules/review/status';
import ISchool from '@/interfaces/modules/school/school';
import IColumn from '@/interfaces/molecules/table/column';
import TId from '@/types/id';

export default interface IReview extends IColumn {
  id: TId;
  school_id: TId;
  name: string;
  title: string | null;
  text: string;
  rating: number;
  school: ISchool;
  status: EStatus;
  created_at: string;
  updated_at: string;
  deleted_at: string
}
