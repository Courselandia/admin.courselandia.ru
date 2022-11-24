import {
  FilterValue,
  SorterResult,
  SortOrder,
} from 'ant-design-vue/lib/table/interface';
import dayjs from 'dayjs';

import IState from '@/interfaces/helpers/state';
import ITableColumnType from '@/interfaces/molecules/table/tableColumnType';

const joinIsNotEmpty = (items: Array<any>, separator: string = ','): string => {
  let joined: string = '';

  Object.values(items).forEach((item) => {
    if (item !== null && item !== undefined) {
      if (joined !== '') {
        joined += separator;
      }

      joined += item;
    }
  });

  return joined;
};

const serialize = (params: Record<string | number, any>): string => {
  const str: Array<string> = [];

  Object.keys(params).forEach((name) => {
    if (params[name]) {
      if (name === 'filters') {
        Object.keys(params[name]).forEach((nameFilter) => {
          const value = params[name][nameFilter];

          if (value) {
            if (typeof value === 'object' && value.length) {
              const joinedValue = joinIsNotEmpty(value, ',');

              if (joinedValue) {
                str.push(`${name}[${encodeURIComponent(nameFilter as string)}]=${encodeURIComponent(joinedValue)}`);
              }
            } else if (typeof value !== 'object') {
              str.push(`${name}[${encodeURIComponent(nameFilter as string)}]=${encodeURIComponent(value)}`);
            }
          }
        });
      } else {
        str.push(`${encodeURIComponent(name)}=${encodeURIComponent(params[name])}`);
      }
    }
  });

  return str.join('&');
};

const stateSet = (
  offset: number,
  limit: number,
  sorter?: SorterResult | SorterResult[] | null,
  filters?: Record<string, any> | null,
  toFilterFields?: Record<string, string>,
): void => {
  const params: Record<string, any> = {
    page: offset / limit + 1,
    limit,
  };

  if (sorter) {
    const sorts: Array<string> = [];
    const sorterValue = Array.isArray(sorter) ? sorter : [sorter];

    Object.values(sorterValue).forEach((sort) => {
      if (sort && sort.order) {
        let name = sort.columnKey;

        if (sort.order === 'descend') {
          name = `-${name}`;
        }

        sorts.push(name as string);
      }
    });

    if (sorts.length) {
      params.sorts = sorts.join(',');
    }
  }

  if (filters && Object.keys(filters).length) {
    const result: Record<string, any> = {};

    Object.keys(filters).forEach((key) => {
      const filterField = (toFilterFields && toFilterFields[key]) ? toFilterFields[key] : key;

      if (typeof filters[key] === 'object' && filters[key]) {
        result[filterField] = [];

        for (let i = 0; i < filters[key].length; i++) {
          if (filters[key][i] instanceof dayjs) {
            result[filterField][i] = filters[key][i].format('YYYY-MM-DD');
          } else {
            result[filterField][i] = filters[key][i];
          }
        }
      } else {
        result[filterField] = filters[key];
      }
    });

    params.filters = result;
  }

  let url = window.location.href.split('?')[0];
  const query = serialize(params);

  if (query) {
    url = `${url}?${query}`;
  }

  window.sessionStorage.setItem(window.location.pathname, query);

  window.history.pushState([], '', url);
};

const stateParameters = (): Array<IState> => {
  const query = window.sessionStorage.getItem(window.location.pathname)
    ? window.sessionStorage.getItem(window.location.pathname) as string
    : window.location.search;

  const params: Array<IState> = [];
  const searchParams = new URLSearchParams(query);

  // eslint-disable-next-line no-restricted-syntax
  for (const key of searchParams.keys()) {
    let name = key as string;
    let param = key;
    let column;
    const value = searchParams.get(name);
    let resultValue: Array<string> | null = null;

    if (value?.indexOf(',') && value?.split(',').length > 1) {
      resultValue = value.split(',');
    } else if (value) {
      resultValue = [value];
    }

    if (name.indexOf('[') && name.indexOf(']')) {
      const regex = /(\w+)\[([A-Za-z0-9_.-]+)\]/;
      const found = name.match(regex);

      if (found) {
        [param, name, column] = found;
      }
    }

    params[params.length] = {
      param,
      name,
      value: resultValue,
      column,
    };
  }

  return params;
};

const stateParameter = (name: string, def: any = null): Array<IState> | null => {
  const params = stateParameters();
  const paramFound = params.filter((param) => param.name === name);

  if (paramFound) {
    return paramFound;
  }

  return def ?? null;
};

const stateSorts = <T>(
  columns?: ITableColumnType<T>[],
  def?: SorterResult[],
): SorterResult[] | null => {
  const parameters = stateParameter('sorts');

  if (parameters?.length) {
    const parameter = parameters[0];
    const result: Array<SorterResult> = [];

    if (typeof parameter.value === 'object') {
      parameter.value?.forEach((value) => {
        const columnKey = value.substring(0, 1) === '-' ? value.slice(1) : value;
        const allowed = columns ? columns.find((column) => column.key === columnKey) : true;

        if (allowed) {
          result[result.length] = {
            columnKey,
            order: value.substring(0, 1) === '-' ? 'descend' : 'ascend',
          };
        }
      });
    } else {
      let columnKey: string = String(parameter.value);
      columnKey = columnKey.substring(0, 1) === '-' ? columnKey.slice(1) : String(parameter.value);
      const allowed = columns ? columns.find((column) => column.key === columnKey) : true;

      if (allowed) {
        result[result.length] = {
          columnKey,
          order: String(parameter.value).substring(0, 1) === '-' ? 'descend' : 'ascend',
        };
      }
    }

    return result;
  }

  return def || null;
};

const statePage = (): number | null => {
  const parameters = stateParameter('page');

  return (parameters?.length && parameters[0].value) ? Number(parameters[0].value) : null;
};

const stateLimit = (): number | null => {
  const parameters = stateParameter('limit');

  return (parameters?.length && parameters[0].value) ? Number(parameters[0].value) : null;
};

const getColumnFieldName = (
  nameFilter: string | number | null,
  toFilterFields?: Record<string, string>,
): string | null => {
  if (toFilterFields) {
    const result = Object.keys(toFilterFields).find((key) => toFilterFields[key] === nameFilter);

    return result || null;
  }

  return null;
};

const stateFilters = <T>(
  columns?: ITableColumnType<T>[] | null,
  defaultSearches?: Record<string | number, any> | null,
  filterType?: string | null,
  toFilterFields?: Record<string, string>,
): Record<string, FilterValue | null> => {
  const parameters = stateParameter('filters');
  const result: Record<string, FilterValue | null> = {};

  if (parameters?.length) {
    Object.values(parameters).forEach((parameter) => {
      const columnField = getColumnFieldName(parameter.column || null, toFilterFields)
        || parameter.column;

      const columnFound = columns
        ? columns.find((column) => column.key === columnField)
        : true;
      const filterTypeFound = columnFound && columnFound !== true
        ? columnFound.filterType
        : filterType;

      if (columnField && columnFound && parameter.column) {
        if (typeof parameter.value === 'object') {
          const values = parameter.value;
          let valid = true;

          if (values) {
            for (let i = 0; i < values.length; i++) {
              if (filterTypeFound === 'dateRange') {
                const isValid = dayjs(values[i], 'YYYY-MM-DD', true).isValid();

                if (isValid) {
                  values[i] = dayjs(values[i], 'YYYY-MM-DD');
                } else {
                  valid = false;
                }
              } else if (filterTypeFound === 'number' || filterTypeFound === 'select' || filterTypeFound === 'slider') {
                values[i] = Number(values[i]);
              }
            }
          }

          if (valid) {
            result[columnField] = values;
          }
        } else {
          result[columnField] = [parameter.value];
        }
      }
    });
  }

  if (defaultSearches) {
    return {
      ...defaultSearches,
      ...result,
    };
  }

  return result;
};

const stateColumnSort = (
  name: string,
  sorter?: SorterResult | SorterResult[] | null,
  def?: SortOrder | null,
): SortOrder | undefined | null => {
  if (sorter) {
    const sorterValue = Array.isArray(sorter) ? sorter : [sorter];
    const sort = sorterValue?.find((item) => item.columnKey === name);

    return sort ? sort.order : null;
  }

  const statedSorts = stateSorts();
  const sort = statedSorts?.find((item) => item.columnKey === name);
  const result = sort ? sort.order : null;

  return result || def;
};

const stateColumnFilter = (
  name: string,
  filter?: Record<string, FilterValue | null> | null,
  filterType?: string | null,
): FilterValue | null => {
  if (filter && filter[name]) {
    return filter[name];
  }

  const statedFilters = stateFilters(null, null, filterType);
  return statedFilters && statedFilters[name] ? statedFilters[name] : null;
};

export {
  stateColumnFilter,
  stateColumnSort,
  stateFilters,
  stateLimit,
  statePage,
  stateParameter,
  stateParameters,
  stateSet,
  stateSorts,
};
