import ITeacherExperience from '@/interfaces/modules/teacher/experience';
import ISocialMedia from '@/interfaces/modules/teacher/socialMedia';
import IOption from '@/interfaces/molecules/select/option';
import TId from '@/types/id';

export default interface ITeacherForm {
  id?: TId;
  name: string | undefined;
  link: string | undefined;
  text: string | undefined;
  city: string | undefined;
  rating: number | string | undefined;
  image: File | undefined;
  imageCropped: File | string | undefined;
  directions: Array<IOption> | undefined;
  schools: Array<IOption> | undefined;
  title: string | undefined;
  description: string | undefined;
  title_template: string | undefined;
  description_template: string | undefined;
  keywords: string | undefined;
  status: boolean;
  copied: boolean;
  comment: string | undefined;
  experiences: ITeacherExperience[];
  socialMedias: ISocialMedia[];
}
