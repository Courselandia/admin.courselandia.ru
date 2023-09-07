import IAnalyzer from '@/interfaces/modules/course/analyzer';
import ICourse from '@/interfaces/modules/course/course';
import TId from '@/types/id';

export default interface IArticleForm {
  id?: TId;
  text: string | undefined;
  text_current: string | undefined,
  apply: boolean,
  analyzers: Array<IAnalyzer> | null;
  articleable: ICourse | null;
  category: string | null;
  category_name: string | null;
  category_label: string | null;
}
