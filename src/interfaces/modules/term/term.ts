import IColumn from '@/interfaces/molecules/table/column';
import TId from '@/types/id';

export default interface IFaq extends IColumn {
  id: TId;
  variant: string;
  term: string;
  status: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}
