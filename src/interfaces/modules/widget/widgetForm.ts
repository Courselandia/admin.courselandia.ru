import IWidgetValueForm from '@/interfaces/modules/widget/widgetValueForm';
import TId from '@/types/id';

export default interface IWidgetForm {
  id?: TId;
  name: string | undefined;
  status: boolean;
  values: Array<IWidgetValueForm>,
}
