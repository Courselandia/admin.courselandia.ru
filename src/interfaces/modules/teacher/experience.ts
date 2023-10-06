import { Dayjs } from 'dayjs';

import IColumn from '@/interfaces/molecules/table/column';
import TId from '@/types/id';

export default interface ITeacherExperience extends IColumn {
  id?: TId;
  place?: string | null;
  position?: string | null;
  started?: Dayjs | null;
  finished?: Dayjs | null;
  weight?: number | null | string;
}
