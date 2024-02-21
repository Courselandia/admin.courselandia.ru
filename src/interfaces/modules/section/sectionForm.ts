import ILevel from '@/interfaces/modules/course/level';
import ISectionItemForm from '@/interfaces/modules/section/sectionItemForm';
import TId from '@/types/id';

export default interface ISectionForm {
  id?: TId;
  name: string | undefined;
  header: string | undefined;
  text: string | undefined;
  additional: string | undefined;
  level: ILevel | undefined;
  free: boolean;
  title: string | undefined;
  description: string | undefined;
  keywords: string | undefined;
  status: boolean;
  items: Array<ISectionItemForm>;
}
