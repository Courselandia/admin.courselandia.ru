import ECurrency from '@/enums/modules/course/currency';
import EDuration from '@/enums/modules/course/duration';
import ELanguage from '@/enums/modules/course/language';
import EStatus from '@/enums/modules/course/status';
import IAnalyzer from '@/interfaces/modules/course/analyzer';
import IFeature from '@/interfaces/modules/course/feature';
import IProgram from '@/interfaces/modules/course/program';
import IOption from '@/interfaces/molecules/select/option';
import TId from '@/types/id';

export default interface ICourseForm {
  id?: TId;
  school_id: IOption | undefined;
  image: File | null;
  name: string | undefined;
  header_template: string | undefined;
  header: string | undefined;
  text: string | undefined;
  link: string | undefined;
  url: string | undefined;
  language: ELanguage | undefined;
  rating: number | string | undefined;
  price: number | string | undefined;
  price_old: number | string | undefined;
  price_recurrent: number | string | undefined;
  currency: ECurrency | undefined;
  online: boolean | undefined;
  employment: boolean;
  duration: number | string | undefined;
  duration_unit: EDuration | undefined;
  lessons_amount: number | string | undefined;
  modules_amount: number | string | undefined
  status: EStatus;

  title_template: string | undefined;
  description_template: string | undefined;
  title: string | undefined;
  description: string | undefined;
  keywords: string | undefined;

  directions: Array<IOption>;
  professions: Array<IOption>;
  categories: Array<IOption>;
  skills: Array<IOption>;
  teachers: Array<IOption>;
  tools: Array<IOption>;
  levels: Array<string>;
  learns: Array<string>;
  employments: Array<IOption>;
  processes: Array<IOption>;
  features: Array<IFeature>;
  program: Array<IProgram>;

  analyzers?: Array<IAnalyzer> | undefined;
}
