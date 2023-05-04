import IOption from '@/interfaces/molecules/select/option';
import TId from '@/types/id';

export default interface ICategoryForm {
  id?: TId;
  name: string;
  header: string | null;
  header_template: string | null;
  link: string;
  text: string | undefined;
  title: string | null;
  title_template: string | null;
  description: string | null;
  description_template: string | null;
  keywords: string | null;
  directions: Array<IOption>;
  professions: Array<IOption>;
  status: boolean;
}
