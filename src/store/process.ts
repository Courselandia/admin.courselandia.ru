import { defineStore } from 'pinia';

import axios from '@/helpers/axios';
import toQuery from '@/helpers/toQuery';
import IProcess from '@/interfaces/modules/process/process';
import IProcessForm from '@/interfaces/modules/process/processForm';
import IFilters from '@/interfaces/molecules/table/filters';
import ISorts from '@/interfaces/molecules/table/sorts';
import { IResponseItem, IResponseItems } from '@/interfaces/response';
import access from '@/store/access';
import TId from '@/types/id';

export default defineStore('process', {
  state: () => ({
    items: null as IProcess[] | null,
    item: null as IProcess | null,
    total: null as number | null,
  }),
  actions: {
    async get(id: TId): Promise<IResponseItem<IProcess>> {
      try {
        const response = await axios.get<IResponseItem<IProcess>>(`/api/private/admin/process/get/${id}`, {
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
    ): Promise<IResponseItems<IProcess>> {
      try {
        const query = toQuery(offset, limit, sorts, filters);
        const response = await axios.get<IResponseItems<IProcess>>(`/api/private/admin/process/read?${query}`, {
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
    async create(data: IProcessForm): Promise<IResponseItem<IProcess>> {
      const response = await axios.post<IResponseItem<IProcess>>('/api/private/admin/process/create', data, {
        headers: {
          Authorization: access().accessToken || '',
        },
      });

      return response.data;
    },
    async update(data: IProcessForm): Promise<IResponseItem<IProcess>> {
      const response = await axios.put<IResponseItem<IProcess>>(`/api/private/admin/process/update/${data.id}`, data, {
        headers: {
          Authorization: access().accessToken || '',
        },
      });

      return response.data;
    },
    async status(id: TId, status: boolean): Promise<IResponseItem<IProcessForm>> {
      const response = await axios.put<IResponseItem<IProcessForm>>(`/api/private/admin/process/update/status/${id}`, {
        status,
      }, {
        headers: {
          Authorization: access().accessToken || '',
        },
      });

      return response.data;
    },
    async destroy(ids: Array<TId>): Promise<IResponseItem<IProcessForm>> {
      const response = await axios.delete<IResponseItem<IProcessForm>>('/api/private/admin/process/destroy', {
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
