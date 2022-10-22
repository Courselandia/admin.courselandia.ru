import { Key } from 'ant-design-vue/lib/_util/type';
import { FilterValue } from 'ant-design-vue/lib/table/interface';

export default interface IFilters
  extends Record<string | number, FilterValue | boolean | Key | null> {

}
