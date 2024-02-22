import TId from '@/types/id';

export default interface ISectionForm {
  id?: TId;
  name: string | undefined;
  header: string | undefined;
  text: string | undefined;
  additional: string | undefined;
  level: string | undefined;
  free: boolean;
  title: string | undefined;
  description: string | undefined;
  keywords: string | undefined;
  status: boolean;
  item_id_1?: TId;
  item_type_1?: string;
  item_id_2?: TId;
  item_type_2?: string;
}
