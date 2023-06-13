import IColumn from '@/interfaces/molecules/table/column';
import TId from '@/types/id';

export default interface IResult extends IColumn {
  unique: number;
  water: number;
  spam: number;
}
