import TId from '@/types/id';

export default interface IArticleRewriteForm {
  id: TId;
  request: string;
  text: string | null;
  text_current: string | null;
}
