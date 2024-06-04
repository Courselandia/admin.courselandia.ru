import TId from '@/types/id';

export default interface IWidgetValue {
  id: TId;
  widget_id: TId,
  name: string;
  value: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}
