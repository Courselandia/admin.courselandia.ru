import ISchool from '@/interfaces/modules/school/school';
import IColumn from '@/interfaces/molecules/table/column';
import TId from '@/types/id';

export default interface IFaq extends IColumn {
  id: TId;
  school_id: TId;
  question: string;
  answer: string;
  school: ISchool;
  status: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}
