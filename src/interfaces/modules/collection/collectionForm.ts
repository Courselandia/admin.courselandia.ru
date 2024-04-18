import IFiltersForm from '@/interfaces/modules/collection/filtersForm';
import IAnalyzer from '@/interfaces/modules/course/analyzer';
import IOption from '@/interfaces/molecules/select/option';
import TId from '@/types/id';

export default interface ICollectionForm {
  id?: TId;
  direction_id: IOption | undefined;
  name: string | undefined;
  link: string | undefined;
  amount: number | undefined;
  text: string | undefined;
  additional: string | undefined;
  image: File | undefined;
  title: string | undefined;
  description: string | undefined;
  keywords: string | undefined;
  status: boolean;
  filters: IFiltersForm,
  sort: IOption,
  analyzers?: Array<IAnalyzer> | undefined;
  copied: boolean;
}
