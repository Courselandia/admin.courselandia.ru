import dayjs from 'dayjs';

import TId from '@/types/id';

export default interface ICollectionForm {
  id?: TId;
  published_at: dayjs.Dayjs | string | undefined;
  header: string | undefined;
  link: string | undefined;
  anons: string | undefined;
  article: string | undefined;
  image: File | undefined;
  title: string | undefined;
  description: string | undefined;
  keywords: string | undefined;
  status: boolean;
}
