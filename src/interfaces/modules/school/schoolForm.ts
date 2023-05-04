import TId from '@/types/id';

export default interface ISchoolForm {
  id?: TId;
  name: string;
  header: string;
  header_template: string;
  link: string;
  text: string;
  rating: number | string;
  site: string | null;
  imageLogo: File | null;
  imageSite: File | null;
  title: string | null;
  description: string | null;
  title_template: string | null;
  description_template: string | null;
  keywords: string | null;
  status: boolean;
}
