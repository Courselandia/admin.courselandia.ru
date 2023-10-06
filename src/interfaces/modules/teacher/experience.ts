import { Dayjs } from 'dayjs';

import IColumn from '@/interfaces/molecules/table/column';
import TId from '@/types/id';

export default interface ITeacherExperience extends IColumn {
  id?: TId;
  place?: string | undefined;
  position?: string | undefined;
  started?: Dayjs | undefined;
  finished?: Dayjs | undefined;
  weight?: number | string | undefined;
}
