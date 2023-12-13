import TId from '@/types/id';

export default interface IMetatag {
  id: TId;
  description: string;
  keywords: string;
  title: string;
  title_template: string,
  description_template: string,
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}
