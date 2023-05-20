import { defineStore } from 'pinia';

import axios from '@/helpers/axios';
import IRequest from '@/interfaces/modules/writer/request';
import IResult from '@/interfaces/modules/writer/result';
import { IResponseItem } from '@/interfaces/response';
import access from '@/stores/access';
import TId from '@/types/id';

export default defineStore('writer', {
  state: () => ({
    id: null as TId | null,
    text: null as string | null,
  }),
  actions: {
    async request(request: string): Promise<IResponseItem<IRequest>> {
      try {
        const response = await axios.post<IResponseItem<IRequest>>('/api/private/admin/writer/request', {
          request,
        }, {
          headers: {
            Authorization: access().accessToken || '',
          },
        });

        this.id = response.data.data.id;

        return response.data;
      } catch (error) {
        this.id = null;

        throw error;
      }
    },
    async result(id: TId): Promise<IResponseItem<IResult>> {
      try {
        const response = await axios.get<IResponseItem<IResult>>(`/api/private/admin/writer/result/${id}`, {
          headers: {
            Authorization: access().accessToken || '',
          },
        });

        this.text = response.data.data.text;

        return response.data;
      } catch (error) {
        this.text = null;

        throw error;
      }
    },
  },
});
