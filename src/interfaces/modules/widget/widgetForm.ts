import TId from '@/types/id';

export default interface IWidgetForm {
  id?: TId;
  name: string | undefined;
  index: string;
  status: boolean;
  values: Record<string, Array<string | number> | string | number>,
}
