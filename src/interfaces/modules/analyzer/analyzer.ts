import EStatus from '@/enums/modules/analyzer/status';
import ICourse from '@/interfaces/modules/course/course';
import IColumn from '@/interfaces/molecules/table/column';
import TId from '@/types/id';

export default interface IAnalyzer extends IColumn {
  id: TId;
  task_id: TId,
  category: string,
  text: string | null,
  category_name: string | null,
  category_label: string | null,
  unique: number | null,
  water: number | null,
  spam: number | null,
  params: Array<any> | null,
  tries: number,
  status: EStatus,
  analyzerable_id: TId,
  analyzerable: ICourse,
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}
