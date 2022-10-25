import IMetatag from '@/interfaces/modules/metatag';
import IColumn from '@/interfaces/molecules/table/column';
import TId from '@/types/id';

export default interface IProfession extends IColumn {
  id: TId;
  metatag_id: TId;
  name: string;
  header: string | null;
  link: string;
  text: string | null;
  metatag: IMetatag;
  weight: number | null;
  status: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string
}
