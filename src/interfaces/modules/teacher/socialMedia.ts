import IColumn from '@/interfaces/molecules/table/column';
import TId from '@/types/id';

export default interface ISocialMedia extends IColumn {
  id?: TId;
  name?: string | null;
  value?: string | null;
}
