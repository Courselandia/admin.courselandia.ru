import TAlert from '@/types/alert';

export default interface IAlert {
  message: string | null,
  type: TAlert | undefined,
}
