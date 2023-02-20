import { defineStore } from 'pinia';

import axios from '@/helpers/axios';
import toQuery from '@/helpers/toQuery';
import IDirection from '@/interfaces/modules/direction/direction';
import IDirectionForm from '@/interfaces/modules/direction/directionForm';
import IFilters from '@/interfaces/molecules/table/filters';
import ISorts from '@/interfaces/molecules/table/sorts';
import { IResponseItem, IResponseItems } from '@/interfaces/response';
import access from '@/stores/access';
import TId from '@/types/id';

export default defineStore('direction', {
  state: () => ({
    items: null as IDirection[] | null,
    item: null as IDirection | null,
    total: null as number | null,
  }),
  actions: {
    async get(id: TId): Promise<IResponseItem<IDirection>> {
      try {
        const response = await axios.get<IResponseItem<IDirection>>(`/api/private/admin/direction/get/${id}`, {
          headers: {
            Authorization: access().accessToken || '',
          },
        });

        this.item = response.data.data;

        return response.data;
      } catch (error) {
        this.item = null;

        throw error;
      }
    },
    async read(
      offset: number | null = null,
      limit: number | null = null,
      sorts: ISorts | null = null,
      filters: IFilters | null = null,
    ): Promise<IResponseItems<IDirection>> {
      try {
        const query = toQuery(offset, limit, sorts, filters);
        const response = await axios.get<IResponseItems<IDirection>>(`/api/private/admin/direction/read?${query}`, {
          headers: {
            Authorization: access().accessToken || '',
          },
        });

        this.items = response.data.data;
        this.total = response.data.total;

        return response.data;
      } catch (error) {
        this.items = null;
        this.total = null;

        throw error;
      }
    },
    async create(data: IDirectionForm): Promise<IResponseItem<IDirection>> {
      const response = await axios.post<IResponseItem<IDirection>>('/api/private/admin/direction/create', data, {
        headers: {
          Authorization: access().accessToken || '',
        },
      });

      return response.data;
    },
    async update(data: IDirectionForm): Promise<IResponseItem<IDirection>> {
      const response = await axios.put<IResponseItem<IDirection>>(`/api/private/admin/direction/update/${data.id}`, data, {
        headers: {
          Authorization: access().accessToken || '',
        },
      });

      return response.data;
    },
    async status(id: TId, status: boolean): Promise<IResponseItem<IDirectionForm>> {
      const response = await axios.put<IResponseItem<IDirectionForm>>(`/api/private/admin/direction/update/status/${id}`, {
        status,
      }, {
        headers: {
          Authorization: access().accessToken || '',
        },
      });

      return response.data;
    },
    async destroy(ids: Array<TId>): Promise<IResponseItem<IDirectionForm>> {
      const response = await axios.delete<IResponseItem<IDirectionForm>>('/api/private/admin/direction/destroy', {
        params: {
          ids,
        },
        headers: {
          Authorization: access().accessToken || '',
        },
      });

      return response.data;
    },
  },
});
