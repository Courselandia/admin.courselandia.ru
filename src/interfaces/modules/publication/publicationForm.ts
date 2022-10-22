import dayjs from 'dayjs';

import TId from '@/types/id';

export default interface IPublicationForm {
  id?: TId;
  published_at: dayjs.Dayjs | null;
  header: string;
  link: string;
  anons: string | null;
  article: string | null;
  image: File | null;
  title: string | null;
  description: string | null;
  keywords: string | null;
  status: boolean;
}
