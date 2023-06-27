import IColumn from '@/interfaces/molecules/table/column';
import TId from '@/types/id';

export default interface IRequest extends IColumn {
  id: TId;
}
