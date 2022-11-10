import ECurrency from '@/enums/modules/course/currency';
import EDuration from '@/enums/modules/course/duration';
import ELanguage from '@/enums/modules/course/language';
import EStatus from '@/enums/modules/course/status';
import IFeatureForm from '@/interfaces/modules/course/featureForm';
import TId from '@/types/id';

export default interface IPublicationForm {
  id?: TId;
  school_id: TId;
  image: File | null;
  header: string;
  text: string | null;
  link: string;
  url: string;
  language: ELanguage | null;
  rating: number | null;
  price: number | null;
  price_discount: number | null;
  price_recurrent_price: number | null;
  currency: ECurrency | null;
  online: boolean | null;
  employment: boolean | null;
  duration: number;
  duration_unit: EDuration | null;
  lessons_amount: number;
  modules_amount: number;
  status: EStatus;

  title: string | null;
  description: string | null;
  keywords: string | null;

  directions: Array<string> | null;
  professions: Array<string> | null;
  categories: Array<string> | null;
  skills: Array<string> | null;
  teachers: Array<string> | null;
  tools: Array<string> | null;
  levels: Array<string> | null;
  learns: Array<string> | null;
  employments: Array<string> | null;
  features: Array<IFeatureForm> | null;
}
