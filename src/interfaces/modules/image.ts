import TId from '@/types/id';

export default interface IImage {
  id: TId,
  byte: string | null,
  folder: string,
  format: string,
  cache: string,
  width: number,
  height: number,
  path: string,
  pathCache: string,
  pathSource: string
}
