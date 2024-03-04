import ELevel from '@/enums/modules/salary/level';
import IMetatag from '@/interfaces/modules/metatag';
import ISectionItem from '@/interfaces/modules/section/sectionItem';
import IColumn from '@/interfaces/molecules/table/column';
import TId from '@/types/id';

export default interface ISection extends IColumn {
  id: TId;
  metatag_id: TId;
  name: string;
  header: string | null;
  text: string | null;
  additional: string | null;
  metatag: IMetatag;
  level: ELevel | null;
  free: boolean;
  status: boolean;
  created_at: string;
  updated_at: string;
  url: string | null;
  deleted_at: string | null;
  items: Array<ISectionItem>;
}
