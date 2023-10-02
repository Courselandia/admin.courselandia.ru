import IOption from '@/interfaces/molecules/select/option';
import TId from '@/types/id';

export default interface ITeacherForm {
  id?: TId;
  name: string;
  link: string;
  text: string;
  city: string;
  rating: number | string;
  image: File | null;
  directions: Array<IOption>;
  schools: Array<IOption>;
  title: string | null;
  description: string | null;
  title_template: string | null;
  description_template: string | null;
  keywords: string | null;
  status: boolean;
  copied: boolean;
  comment: string;
}
