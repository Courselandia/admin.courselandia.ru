import IColumn from '@/interfaces/molecules/table/column';
import TId from '@/types/id';

export default interface IAlertForm extends IColumn {
  id: TId;
  title: string;
  description: string;
  icon: string;
  link: string;
  color: string;
  url: string | null;
  status: boolean;
}
