import IUser from '@/interfaces/modules/user/user';

export default interface IToken {
  accessToken: string;
  refreshToken: string;
  user: IUser;
}
