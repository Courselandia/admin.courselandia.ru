import EStatus from '@/enums/modules/article/status';
import IAnalyzer from '@/interfaces/modules/course/analyzer';
import ICourse from '@/interfaces/modules/course/course';
import TId from '@/types/id';

export default interface IArticleForm {
  id?: TId;
  text: string | undefined;
  text_current: string | undefined,
  apply: boolean,
  analyzers: Array<IAnalyzer> | undefined;
  articleable: ICourse | undefined;
  category: string | undefined;
  category_name: string | undefined;
  category_label: string | undefined;
  status: EStatus | undefined,
}
