import IOption from '@/interfaces/molecules/select/option';
import TId from '@/types/id';

export default interface ITeacherForm {
  id?: TId;
  name: string;
  link: string;
  text: string | null;
  rating: number | null;
  image: File | null;
  directions: Array<IOption>;
  schools: Array<IOption>;
  title: string | null;
  description: string | null;
  keywords: string | null;
  status: boolean;
}
