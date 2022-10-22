import IColumn from '@/interfaces/molecules/table/column';
import TId from '@/types/id';

export default interface IFeedback extends IColumn {
  id: TId;
  name: string;
  email: string;
  phone: number;
  message: string;
  created_at: string;
  updated_at: string;
  deleted_at: string
}
