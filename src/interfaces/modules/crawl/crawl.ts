import EEngine from '@/enums/modules/crawl/engine';
import IPage from '@/interfaces/modules/page/page';
import IColumn from '@/interfaces/molecules/table/column';
import TId from '@/types/id';

export default interface IDirection extends IColumn {
  id: TId;
  page_id: TId;
  pushed_at: string;
  engine: EEngine;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  page: IPage;
}
