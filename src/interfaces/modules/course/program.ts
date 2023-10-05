import IColumn from '@/interfaces/molecules/table/column';

export default interface IProgram extends IColumn {
  id?: number;
  name?: string;
  text?: string;
  children?: IProgram[];
}
