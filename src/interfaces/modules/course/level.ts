import ELevel from '@/enums/modules/salary/level';
import IColumn from '@/interfaces/molecules/table/column';
import TId from '@/types/id';

export default interface ILevel extends IColumn {
  id: TId;
  course_id: TId;
  level: ELevel;
  created_at: string;
  updated_at: string;
  deleted_at: string;
}
