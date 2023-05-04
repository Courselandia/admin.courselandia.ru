import TId from '@/types/id';

export default interface IDirectionForm {
  id?: TId;
  name: string;
  header_template: string | null;
  header: string | null;
  link: string;
  text: string;
  weight: number | string;
  title_template: string | null;
  description_template: string | null;
  title: string | null;
  description: string | null;
  keywords: string | null;
  status: boolean;
}
