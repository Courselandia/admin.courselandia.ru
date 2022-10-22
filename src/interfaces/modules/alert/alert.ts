import IColumn from '@/interfaces/molecules/table/column';
import TId from '@/types/id';

export default interface IAlert extends IColumn {
  id: TId;
  title: string;
  description: string;
  icon: string;
  link: string;
  color: string;
  url: string | null;
  status: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string
}
