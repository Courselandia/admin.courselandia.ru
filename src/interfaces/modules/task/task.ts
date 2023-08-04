import EStatus from '@/enums/modules/task/status';
import IColumn from '@/interfaces/molecules/table/column';
import TId from '@/types/id';

export default interface ITask extends IColumn {
  id: TId;
  user_id: TId;
  name: string;
  reason: string | null;
  status: EStatus;
  launched_at: string | null;
  finished_at: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}
