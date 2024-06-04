import TId from '@/types/id';

export default interface IWidgetValue {
  id: TId;
  widget_id: TId,
  name: string;
  value: Array<string | number> | string | number | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}
