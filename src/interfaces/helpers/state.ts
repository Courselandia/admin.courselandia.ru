export default interface IState {
  name: string;
  value: Array<any> | null;
  column?: string | number;
  param?: string | number;
}
