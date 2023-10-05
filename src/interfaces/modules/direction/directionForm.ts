import TId from '@/types/id';

export default interface IDirectionForm {
  id?: TId;
  name: string | undefined;
  header_template: string | undefined;
  header: string | undefined;
  link: string | undefined;
  text: string | undefined;
  weight: number | string | undefined;
  title_template: string | undefined;
  description_template: string | undefined;
  title: string | undefined;
  description: string | undefined;
  keywords: string | undefined;
  status: boolean;
}
