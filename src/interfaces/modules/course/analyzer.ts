import EStatus from '@/enums/modules/analyzer/status';
import IColumn from '@/interfaces/molecules/table/column';
import TId from '@/types/id';

export default interface IAnalyzer extends IColumn {
  id: TId,
  task_id: TId,
  category: string,
  category_name: string,
  category_label: string,
  unique: number | null,
  water: number | null,
  spam: number | null,
  text: string | null,
  params: Array<any> | null,
  tries: number,
  status: EStatus,
  analyzerable_id: number | null,
  analyzerable_type: string | null,
  created_at: string,
  updated_at: string,
  deleted_at: string | null,
}
