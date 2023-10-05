import TId from '@/types/id';

export default interface IProfessionForm {
  id?: TId;
  name: string;
  header: string | null;

  header_template: string | undefined;
  link: string;
  text: string;
  title: string | undefined;
  description: string | undefined;
  title_template: string | undefined;
  description_template: string | undefined;
  keywords: string | undefined;
  status: boolean;
}
