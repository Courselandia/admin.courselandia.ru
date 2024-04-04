import IOption from '@/interfaces/molecules/select/option';

export default interface IFilterForm {
  'directions-id'?: number,
  'school-id': Array<IOption>,
  'categories-id': Array<IOption>,
  'professions-id': Array<IOption>,
  'teachers-id': Array<IOption>,
  'skills-id': Array<IOption>,
  'levels-level': Array<IOption>,
  online: Array<IOption>,
  rating: Array<IOption>,
  credit: number | undefined,
  free: number | undefined,
  price: [number, number],
  duration: [number, number],
}
