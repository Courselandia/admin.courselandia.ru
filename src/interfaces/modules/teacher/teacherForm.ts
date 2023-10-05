import IOption from '@/interfaces/molecules/select/option';
import TId from '@/types/id';

export default interface ITeacherForm {
  id?: TId;
  name: string | undefined;
  link: string | undefined;
  text: string | undefined;
  rating: number | string | undefined;
  image: File | undefined;
  directions: Array<IOption> | undefined;
  schools: Array<IOption> | undefined;
  title: string | undefined;
  description: string | undefined;
  title_template: string | undefined;
  description_template: string | undefined;
  keywords: string | undefined;
  status: boolean;
}
