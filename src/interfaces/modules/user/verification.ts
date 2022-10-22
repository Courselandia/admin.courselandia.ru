import TId from '@/types/id';

export default interface IVerification {
  id: TId;
  user_id: TId;
  code: string;
  status: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string
}
