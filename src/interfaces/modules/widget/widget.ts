import IWidgetValue from '@/interfaces/modules/widget/widgetValue';
import IColumn from '@/interfaces/molecules/table/column';
import TId from '@/types/id';

export default interface IWidget extends IColumn {
  id: TId;
  name: string;
  index: string;
  status: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  values: Record<string, Array<string | number>| string | number> | null;
}
