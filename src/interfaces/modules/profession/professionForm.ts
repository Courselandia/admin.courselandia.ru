import dayjs from 'dayjs';

import TId from '@/types/id';

export default interface IProfessionForm {
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
