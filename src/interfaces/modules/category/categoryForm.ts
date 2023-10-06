import IOption from '@/interfaces/molecules/select/option';
import TId from '@/types/id';

export default interface ICategoryForm {
  id?: TId;
  name: string | undefined;
  header: string | undefined;
  header_template: string | undefined;
  link: string | undefined;
  text: string | undefined;
  title: string | undefined;
  title_template: string | undefined;
  description: string | undefined;
  description_template: string | undefined;
  keywords: string | undefined;
  directions: Array<IOption>;
  professions: Array<IOption>;
  status: boolean;
}
