import ELevel from '@/enums/level';
import TId from '@/types/id';

export default interface ISalaryForm {
  id?: TId;
  profession_id: TId | null;
  level: ELevel | null;
  salary: number | null;
  status: boolean;
}
