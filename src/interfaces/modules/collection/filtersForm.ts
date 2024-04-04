import IOption from '@/interfaces/molecules/select/option';

export default interface IFiltersForm {
  'directions-id'?: number,
  'school-id': Array<IOption>,
  'categories-id': Array<IOption>,
  'professions-id': Array<IOption>,
  'teachers-id': Array<IOption>,
  'skills-id': Array<IOption>,
  'tools-id': Array<IOption>,
  'levels-level': Array<IOption>,
  online: IOption | undefined,
  rating: IOption | undefined,
  credit: boolean | undefined,
  free: boolean | undefined,
  price: [number, number],
  duration: [number, number],
}
