import IImage from '@/interfaces/modules/image';
import IMetatag from '@/interfaces/modules/metatag';
import IColumn from '@/interfaces/molecules/table/column';
import TId from '@/types/id';

export default interface IPublication extends IColumn {
  id: TId;
  metatag_id: TId;
  published_at: string;
  header: string;
  link: string;
  anons: string | null;
  article: string | null;
  image_small_id: IImage | null;
  image_middle_id: IImage | null;
  image_big_id: IImage | null;
  metatag: IMetatag;
  status: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string
}
