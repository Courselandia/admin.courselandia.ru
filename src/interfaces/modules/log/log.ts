import IColumn from '@/interfaces/molecules/table/column';
import TId from '@/types/id';

export default interface ILog extends IColumn {
  id: TId;
  channel: string;
  created_at: string;
  level: number;
  updated_at: string;
  context: string;
  datetime: number;
  level_name: number;
  message: number;
  unix_time: number;
}
