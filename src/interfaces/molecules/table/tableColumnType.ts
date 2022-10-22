import type { TableColumnType } from 'ant-design-vue';

export default interface ITableColumnType<T> extends TableColumnType<T> {
  filterType?: string;
}
