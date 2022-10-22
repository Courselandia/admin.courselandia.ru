import IUser from '@/interfaces/modules/user/user';

export default interface IClient {
  user: IUser;
  secret: string;
}
