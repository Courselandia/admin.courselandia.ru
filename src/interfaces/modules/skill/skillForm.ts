import TId from '@/types/id';

export default interface ISkillForm {
  id?: TId;
  name: string;
  header: string | null;
  header_template: string | null;
  link: string;
  text: string | null;
  title: string | null;
  description: string | null;
  title_template: string | null;
  description_template: string | null;
  keywords: string | null;
  status: boolean;
}
