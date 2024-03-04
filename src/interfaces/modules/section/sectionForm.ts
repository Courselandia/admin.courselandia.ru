import ELevel from '@/enums/modules/salary/level';
import IOption from '@/interfaces/molecules/select/option';
import TId from '@/types/id';

export default interface ISectionForm {
  id?: TId;
  name: string | undefined;
  header: string | undefined;
  text: string | undefined;
  additional: string | undefined;
  level: ELevel | undefined;
  free: boolean;
  title: string | undefined;
  description: string | undefined;
  keywords: string | undefined;
  status: boolean;
  url: string | undefined;
  item_id_0?: IOption;
  item_type_0?: string;
  item_id_1?: IOption | undefined;
  item_type_1?: string | undefined;
}
