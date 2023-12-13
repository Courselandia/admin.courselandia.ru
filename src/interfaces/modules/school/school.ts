import IAnalyzer from '@/interfaces/modules/course/analyzer';
import IImage from '@/interfaces/modules/image';
import IMetatag from '@/interfaces/modules/metatag';
import IColumn from '@/interfaces/molecules/table/column';
import TId from '@/types/id';

export default interface ISchool extends IColumn {
  id: TId;
  metatag_id: TId;
  name: string;
  header: string;
  link: string;
  text: string | null;
  rating: number;
  site: string | null;
  status: boolean;
  metatag: IMetatag;
  image_logo_id: IImage | null;
  image_site_id: IImage | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  analyzers: Array<IAnalyzer> | null;
}
