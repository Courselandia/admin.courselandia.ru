import IAnalyzer from '@/interfaces/modules/course/analyzer';
import ICourse from '@/interfaces/modules/course/course';
import TId from '@/types/id';

export default interface IArticleRewriteForm {
  id: TId;
  request: string;
  text: string | null;
  text_current: string | null;
  analyzers: Array<IAnalyzer> | null;
  articleable: ICourse | null;
  category: string | null;
}
