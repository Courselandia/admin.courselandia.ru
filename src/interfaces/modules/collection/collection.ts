import IFilter from '@/interfaces/modules/collection/filter';
import IAnalyzer from '@/interfaces/modules/course/analyzer';
import ICourse from '@/interfaces/modules/course/course';
import IDirection from '@/interfaces/modules/direction/direction';
import IImage from '@/interfaces/modules/image';
import IMetatag from '@/interfaces/modules/metatag';
import IColumn from '@/interfaces/molecules/table/column';
import TId from '@/types/id';

export default interface ICollection extends IColumn {
  id: TId;
  metatag_id: TId;
  direction_id: TId;
  name: string;
  link: string;
  text: string | null;
  additional: string | null;
  amount: number | null;
  sort_field: string;
  sort_direction: string;
  image_small_id: IImage | null;
  image_middle_id: IImage | null;
  image_big_id: IImage | null;
  status: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  metatag: IMetatag;
  direction: IDirection;
  filters: Array<IFilter>,
  courses: Array<ICourse> | null;
  analyzers: Array<IAnalyzer> | null;
  copied: boolean;
}
