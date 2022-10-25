import IDirection from '@/interfaces/modules/direction/direction';
import IMetatag from '@/interfaces/modules/metatag';
import IProfession from '@/interfaces/modules/profession/profession';
import IColumn from '@/interfaces/molecules/table/column';
import TId from '@/types/id';

export default interface ICategory extends IColumn {
  id: TId;
  metatag_id: TId;
  name: string;
  header: string | null;
  link: string;
  text: string | null;
  metatag: IMetatag;
  directions?: Array<IDirection>;
  professions?: Array<IProfession>;
  status: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string;
}
