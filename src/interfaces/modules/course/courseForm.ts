import ECurrency from '@/enums/modules/course/currency';
import EDuration from '@/enums/modules/course/duration';
import ELanguage from '@/enums/modules/course/language';
import EStatus from '@/enums/modules/course/status';
import IFeature from '@/interfaces/modules/course/feature';
import IOption from '@/interfaces/molecules/select/option';
import TId from '@/types/id';

export default interface ICourseForm {
  id?: TId;
  school_id: IOption | null;
  image: File | null;
  header: string;
  text: string | null;
  link: string;
  url: string;
  language: ELanguage | null;
  rating: number | null;
  price: number | null;
  price_old: number | null;
  price_recurrent: number | null;
  currency: ECurrency | null;
  online: boolean | null;
  employment: boolean | null;
  duration: number | null;
  duration_unit: EDuration | null;
  lessons_amount: number | null;
  modules_amount: number | null
  status: EStatus;

  template_title: string | null;
  template_description: string | null;
  keywords: string | null;

  directions: Array<IOption> | null;
  professions: Array<IOption> | null;
  categories: Array<IOption> | null;
  skills: Array<IOption> | null;
  teachers: Array<IOption> | null;
  tools: Array<IOption> | null;
  levels: Array<string> | null;
  learns: Array<string> | null;
  employments: Array<IOption> | null;
  processes: Array<IOption> | null;
  features: Array<IFeature> | null;
}
