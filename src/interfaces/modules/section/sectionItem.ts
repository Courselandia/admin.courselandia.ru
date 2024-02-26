import ISectionItemable from '@/interfaces/modules/section/sectionItemable';
import IColumn from '@/interfaces/molecules/table/column';
import TId from '@/types/id';

export default interface ISectionItem extends IColumn {
  id: TId;
  section_id: TId;
  weight: number;
  itemable_id: TId;
  itemable_type: string;
  itemable: ISectionItemable;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}
