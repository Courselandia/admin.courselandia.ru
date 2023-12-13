import IColumn from '@/interfaces/molecules/table/column';
import TId from '@/types/id';

export default interface IDirection extends IColumn {
  id: TId;
  path: string;
  lastmod: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}
