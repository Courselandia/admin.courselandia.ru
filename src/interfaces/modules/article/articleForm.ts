import TId from '@/types/id';

export default interface IArticleForm {
  id?: TId;
  text: string | undefined;
  text_current: string | undefined,
  apply: boolean,
}
