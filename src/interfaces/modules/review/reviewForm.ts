import EStatus from '@/enums/modules/review/status';
import ISchool from '@/interfaces/modules/school/school';
import TId from '@/types/id';

export default interface IReviewForm {
  id?: TId;
  school_id: TId | null;
  name: string;
  title: string | null;
  text: string;
  rating: number;
  school: ISchool;
  status: EStatus;
}
