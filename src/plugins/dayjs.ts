import 'dayjs/locale/ru';

import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayjs.locale('ru');
dayjs.extend(utc);
dayjs.extend(timezone);
