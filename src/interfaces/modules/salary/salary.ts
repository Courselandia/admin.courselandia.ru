import ELevel from '@/enums/modules/salary/level';
import IProfession from '@/interfaces/modules/profession/profession';
import IColumn from '@/interfaces/molecules/table/column';
import TId from '@/types/id';

export default interface ISalary extends IColumn {
  id: TId;
  profession_id: TId;
  level: ELevel;
  salary: number;
  profession: IProfession;
  status: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string
}
