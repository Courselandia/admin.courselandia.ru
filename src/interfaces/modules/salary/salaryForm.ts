import ELevel from '@/enums/modules/salary/level';
import IOption from '@/interfaces/molecules/select/option';
import TId from '@/types/id';

export default interface ISalaryForm {
  id?: TId;
  profession_id: IOption | null;
  level: ELevel | null;
  salary: number | string;
  status: boolean;
}
