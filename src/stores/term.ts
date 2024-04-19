import { defineStore } from 'pinia';

import axios from '@/helpers/axios';
import toQuery from '@/helpers/toQuery';
import ITerm from '@/interfaces/modules/term/term';
import ITermForm from '@/interfaces/modules/term/termForm';
import IFilters from '@/interfaces/molecules/table/filters';
import ISorts from '@/interfaces/molecules/table/sorts';
import { IResponseItem, IResponseItems } from '@/interfaces/response';
import access from '@/stores/access';
import TId from '@/types/id';

export default defineStore('term', {
  state: () => ({
    items: null as ITerm[] | null,
    item: null as ITerm | null,
    total: null as number | null,
  }),
  actions: {
    async get(id: TId): Promise<IResponseItem<ITerm>> {
      try {
        const response = await axios.get<IResponseItem<ITerm>>(`/api/private/admin/term/get/${id}`, {
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
    ): Promise<IResponseItems<ITerm>> {
      try {
        const query = toQuery(offset, limit, sorts, filters);
        const response = await axios.get<IResponseItems<ITerm>>(`/api/private/admin/term/read?${query}`, {
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
    async create(data: ITermForm): Promise<IResponseItem<ITerm>> {
      const response = await axios.post<IResponseItem<ITerm>>('/api/private/admin/term/create', data, {
        headers: {
          Authorization: access().accessToken || '',
        },
      });

      return response.data;
    },
    async update(data: ITermForm): Promise<IResponseItem<ITerm>> {
      const response = await axios.put<IResponseItem<ITerm>>(`/api/private/admin/term/update/${data.id}`, data, {
        headers: {
          Authorization: access().accessToken || '',
        },
      });

      return response.data;
    },
    async status(id: TId, status: boolean): Promise<IResponseItem<ITermForm>> {
      const response = await axios.put<IResponseItem<ITermForm>>(`/api/private/admin/term/update/status/${id}`, {
        status,
      }, {
        headers: {
          Authorization: access().accessToken || '',
        },
      });

      return response.data;
    },
    async destroy(ids: Array<TId>): Promise<IResponseItem<ITermForm>> {
      const response = await axios.delete<IResponseItem<ITermForm>>('/api/private/admin/term/destroy', {
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
