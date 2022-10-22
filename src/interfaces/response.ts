import { AxiosResponse } from 'axios';

export interface IResponseItem<T> extends AxiosResponse {
  success: boolean
  data: T,
}

export interface IResponseItems<T> extends AxiosResponse {
  success: boolean
  items: T[],
  total: number,
}
