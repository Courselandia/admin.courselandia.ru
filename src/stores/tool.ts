import { defineStore } from 'pinia';

import axios from '@/helpers/axios';
import toQuery from '@/helpers/toQuery';
import ITool from '@/interfaces/modules/tool/tool';
import IToolForm from '@/interfaces/modules/tool/toolForm';
import IFilters from '@/interfaces/molecules/table/filters';
import ISorts from '@/interfaces/molecules/table/sorts';
import { IResponseItem, IResponseItems } from '@/interfaces/response';
import access from '@/stores/access';
import TId from '@/types/id';

export default defineStore('tool', {
  state: () => ({
    items: null as ITool[] | null,
    item: null as ITool | null,
    total: null as number | null,
  }),
  actions: {
    async get(id: TId): Promise<IResponseItem<ITool>> {
      try {
        const response = await axios.get<IResponseItem<ITool>>(`/api/private/admin/tool/get/${id}`, {
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
    ): Promise<IResponseItems<ITool>> {
      try {
        const query = toQuery(offset, limit, sorts, filters);
        const response = await axios.get<IResponseItems<ITool>>(`/api/private/admin/tool/read?${query}`, {
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
    async create(data: IToolForm): Promise<IResponseItem<ITool>> {
      const response = await axios.post<IResponseItem<ITool>>('/api/private/admin/tool/create', data, {
        headers: {
          Authorization: access().accessToken || '',
        },
      });

      return response.data;
    },
    async update(data: IToolForm): Promise<IResponseItem<ITool>> {
      const response = await axios.put<IResponseItem<ITool>>(`/api/private/admin/tool/update/${data.id}`, data, {
        headers: {
          Authorization: access().accessToken || '',
        },
      });

      return response.data;
    },
    async status(id: TId, status: boolean): Promise<IResponseItem<IToolForm>> {
      const response = await axios.put<IResponseItem<IToolForm>>(`/api/private/admin/tool/update/status/${id}`, {
        status,
      }, {
        headers: {
          Authorization: access().accessToken || '',
        },
      });

      return response.data;
    },
    async destroy(ids: Array<TId>): Promise<IResponseItem<IToolForm>> {
      const response = await axios.delete<IResponseItem<IToolForm>>('/api/private/admin/tool/destroy', {
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
