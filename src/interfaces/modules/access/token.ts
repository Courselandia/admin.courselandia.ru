import IClient from '@/interfaces/modules/access/client';

export default interface IToken extends IClient {
  accessToken: string;
  refreshToken: string;
}
