import TId from '@/types/id';

export default interface ISchoolForm {
  id?: TId;
  name: string | undefined;
  header: string | undefined;
  header_template: string | undefined;
  link: string | undefined;
  text: string | undefined;
  rating: number | string | undefined;
  site: string | undefined;
  imageLogo: File | undefined;
  imageSite: File | undefined;
  title: string | undefined;
  description: string | undefined;
  title_template: string | undefined;
  description_template: string | undefined;
  keywords: string | undefined;
  status: boolean;
}
