import IColumn from '@/interfaces/molecules/table/column';
import TId from '@/types/id';

export default interface IEmployment extends IColumn {
  id?: TId;
  course_id?: TId;
  text: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}
