import { SorterResult } from 'ant-design-vue/lib/table/interface';

import ISorts from '@/interfaces/molecules/table/sorts';

export default function sorts(sorter?: SorterResult | SorterResult[] | null): ISorts {
  const result: ISorts = {};

  if (sorter) {
    const sorterValue = Array.isArray(sorter) ? sorter : [sorter];

    Object.values(sorterValue).forEach((sort) => {
      if (sort.columnKey && sort.order) {
        result[sort.columnKey] = sort.order === 'ascend' ? 'ASC' : 'DESC';
      }
    });
  }

  return result;
}
