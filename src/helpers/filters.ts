import { FilterValue } from 'ant-design-vue/lib/table/interface';
import dayjs from 'dayjs';

import IFilters from '@/interfaces/molecules/table/filters';

const isNotEmpty = (values: FilterValue | null): boolean => {
  if (!values) {
    return false;
  }

  const result = Object.values(values).findIndex((value) => value !== null && value !== undefined && value !== '');

  return result !== -1;
};

export default function filters(
  filter?: Record<string, any> | null,
): IFilters {
  const result: IFilters = {};

  if (filter) {
    Object.keys(filter).forEach((column) => {
      if (isNotEmpty(filter[column])) {
        const value = filter[column];

        if (value?.length === 1) {
          const [firstValue] = value;
          result[column] = firstValue;
        } else {
          const values: Array<string> = [];

          Object.values(filter[column]).forEach((item) => {
            if (item instanceof dayjs) {
              const itemValue = item as dayjs.Dayjs;
              values[values.length] = itemValue.format('YYYY-MM-DD ZZ');
            } else {
              values[values.length] = item as string;
            }
          });

          result[column] = values;
        }
      }
    });
  }

  return result;
}
