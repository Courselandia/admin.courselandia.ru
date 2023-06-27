import { defineStore } from 'pinia';

import axios from '@/helpers/axios';
import IRequest from '@/interfaces/modules/plagiarism/request';
import IResult from '@/interfaces/modules/plagiarism/result';
import { IResponseItem } from '@/interfaces/response';
import access from '@/stores/access';
import TId from '@/types/id';

export default defineStore('plagiarism', {
  state: () => ({
    id: null as TId | null,
    text: null as string | null,
  }),
  actions: {
    async request(text: string): Promise<IResponseItem<IRequest>> {
      try {
        const response = await axios.post<IResponseItem<IRequest>>('/api/private/admin/plagiarism/request', {
          text,
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
        const response = await axios.get<IResponseItem<IResult>>(`/api/private/admin/plagiarism/result/${id}`, {
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
