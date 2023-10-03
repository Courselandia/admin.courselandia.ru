import IColumn from '@/interfaces/molecules/table/column';
import TId from '@/types/id';

export default interface ITeacherExperience extends IColumn {
  id?: TId;
  place?: string | null;
  position?: string | null;
  started?: string | null;
  finished?: string | null;
  weight?: number | null | string;
}
