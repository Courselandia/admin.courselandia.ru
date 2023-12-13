import IAnalyzer from '@/interfaces/modules/course/analyzer';
import IDirection from '@/interfaces/modules/direction/direction';
import IImage from '@/interfaces/modules/image';
import IMetatag from '@/interfaces/modules/metatag';
import ISchool from '@/interfaces/modules/school/school';
import ITeacherExperience from '@/interfaces/modules/teacher/experience';
import ITeacherSocialMedia from '@/interfaces/modules/teacher/socialMedia';
import IOptions from '@/interfaces/molecules/croppie/options';
import IColumn from '@/interfaces/molecules/table/column';
import TId from '@/types/id';

export default interface ITeacher extends IColumn {
  id: TId;
  metatag_id: TId;
  name: string;
  link: string;
  comment: string;
  text: string | null;
  rating: number;
  status: boolean;
  metatag: IMetatag;
  directions?: Array<IDirection>;
  schools?: Array<ISchool>;
  image_small_id: IImage | null;
  image_middle_id: IImage | null;
  image_big_id: IImage | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  experiences: ITeacherExperience[];
  social_medias: ITeacherSocialMedia[];
  image_cropped_options: IOptions | undefined;
  analyzers: Array<IAnalyzer> | null;
  copied: boolean;
}
