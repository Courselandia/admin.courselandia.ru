import TId from '@/types/id';

export default interface IFilter {
  id: TId,
  collection_id: TId,
  name: string,
  value: string,
  created_at: string,
  updated_at: string,
  deleted_at: string | null,
}
