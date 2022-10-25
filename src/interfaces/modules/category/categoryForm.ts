import TId from '@/types/id';

export default interface ICategoryForm {
  id?: TId;
  name: string;
  header: string | null;
  link: string;
  text: string | null;
  title: string | null;
  description: string | null;
  keywords: string | null;
  directions: Array<number>;
  professions: Array<number>;
  status: boolean;
}
