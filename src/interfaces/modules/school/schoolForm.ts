import TId from '@/types/id';

export default interface ISchoolForm {
  id?: TId;
  name: string;
  header: string;
  link: string;
  text: string | null;
  rating: number | null;
  site: string | null;
  imageLogo: File | null;
  imageSite: File | null;
  title: string | null;
  description: string | null;
  keywords: string | null;
  status: boolean;
}
