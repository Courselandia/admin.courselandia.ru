import { defineStore } from 'pinia';

import axios from '@/helpers/axios';
import toQuery from '@/helpers/toQuery';
import IProfession from '@/interfaces/modules/profession/profession';
import IProfessionForm from '@/interfaces/modules/profession/professionForm';
import IFilters from '@/interfaces/molecules/table/filters';
import ISorts from '@/interfaces/molecules/table/sorts';
import { IResponseItem, IResponseItems } from '@/interfaces/response';
import access from '@/stores/access';
import TId from '@/types/id';

export default defineStore('profession', {
  state: () => ({
    items: null as IProfession[] | null,
    item: null as IProfession | null,
    total: null as number | null,
  }),
  actions: {
    async get(id: TId): Promise<IResponseItem<IProfession>> {
      try {
        const response = await axios.get<IResponseItem<IProfession>>(`/api/private/admin/profession/get/${id}`, {
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
    ): Promise<IResponseItems<IProfession>> {
      try {
        const query = toQuery(offset, limit, sorts, filters);
        const response = await axios.get<IResponseItems<IProfession>>(`/api/private/admin/profession/read?${query}`, {
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
    async create(data: IProfessionForm): Promise<IResponseItem<IProfession>> {
      const response = await axios.post<IResponseItem<IProfession>>('/api/private/admin/profession/create', data, {
        headers: {
          Authorization: access().accessToken || '',
        },
      });

      return response.data;
    },
    async update(data: IProfessionForm): Promise<IResponseItem<IProfession>> {
      const response = await axios.put<IResponseItem<IProfession>>(`/api/private/admin/profession/update/${data.id}`, data, {
        headers: {
          Authorization: access().accessToken || '',
        },
      });

      return response.data;
    },
    async status(id: TId, status: boolean): Promise<IResponseItem<IProfessionForm>> {
      const response = await axios.put<IResponseItem<IProfessionForm>>(`/api/private/admin/profession/update/status/${id}`, {
        status,
      }, {
        headers: {
          Authorization: access().accessToken || '',
        },
      });

      return response.data;
    },
    async destroy(ids: Array<TId>): Promise<IResponseItem<IProfessionForm>> {
      const response = await axios.delete<IResponseItem<IProfessionForm>>('/api/private/admin/profession/destroy', {
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
