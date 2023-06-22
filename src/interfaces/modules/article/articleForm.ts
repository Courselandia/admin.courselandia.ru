import IAnalyzer from '@/interfaces/modules/course/analyzer';
import TId from '@/types/id';

export default interface IArticleForm {
  id?: TId;
  text: string | undefined;
  text_current: string | undefined,
  apply: boolean,
  analyzers: Array<IAnalyzer> | null;
}
