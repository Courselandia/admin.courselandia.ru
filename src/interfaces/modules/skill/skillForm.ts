import TId from '@/types/id';

export default interface ISkillForm {
  id?: TId;
  name: string;
  header: string | null;
  link: string;
  text: string | null;
  title: string | null;
  description: string | null;
  keywords: string | null;
  status: boolean;
}
