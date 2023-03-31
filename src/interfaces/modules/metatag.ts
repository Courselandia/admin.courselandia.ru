import TId from '@/types/id';

export default interface IMetatag {
  id: TId;
  description: string;
  keywords: string;
  title: string;
  template_title: string,
  template_description: string,
  created_at: string;
  updated_at: string;
  deleted_at: string
}
