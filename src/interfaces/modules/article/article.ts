import EStatus from '@/enums/modules/article/status';
import IAnalyzer from '@/interfaces/modules/course/analyzer';
import ICourse from '@/interfaces/modules/course/course';
import IColumn from '@/interfaces/molecules/table/column';
import TId from '@/types/id';

export default interface IArticle extends IColumn {
  id: TId;
  task_id: TId,
  category: string,
  request: string,
  request_template: string,
  text: string | null,
  text_current: string | null,
  category_label: string | null,
  params: Array<any> | null,
  tries: number,
  status: EStatus,
  articleable_id: TId,
  articleable: ICourse,
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  analyzers: Array<IAnalyzer> | null;
}
