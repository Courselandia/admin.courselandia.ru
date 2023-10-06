import ESocialMedia from '@/enums/modules/teacher/socialMedia';
import IColumn from '@/interfaces/molecules/table/column';
import TId from '@/types/id';

export default interface ISocialMedia extends IColumn {
  id?: TId;
  name?: ESocialMedia | string | undefined;
  value?: string | undefined;
}
