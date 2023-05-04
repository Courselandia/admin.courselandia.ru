import { LabeledValue } from 'ant-design-vue/lib/select';

export default interface IOption extends LabeledValue {
  key?: string,
  value: string | number,
  label?: any
}
