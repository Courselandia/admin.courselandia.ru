import { defineStore } from 'pinia';

import axios from '@/helpers/axios';
import toQuery from '@/helpers/toQuery';
import IEmployment from '@/interfaces/modules/employment/employment';
import IEmploymentForm from '@/interfaces/modules/employment/employmentForm';
import IFilters from '@/interfaces/molecules/table/filters';
import ISorts from '@/interfaces/molecules/table/sorts';
import { IResponseItem, IResponseItems } from '@/interfaces/response';
import access from '@/store/access';
import TId from '@/types/id';

export default defineStore('employment', {
  state: () => ({
    items: null as IEmployment[] | null,
    item: null as IEmployment | null,
    total: null as number | null,
  }),
  actions: {
    async get(id: TId): Promise<IResponseItem<IEmployment>> {
      try {
        const response = await axios.get<IResponseItem<IEmployment>>(`/api/private/admin/employment/get/${id}`, {
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
    ): Promise<IResponseItems<IEmployment>> {
      try {
        const query = toQuery(offset, limit, sorts, filters);
        const response = await axios.get<IResponseItems<IEmployment>>(`/api/private/admin/employment/read?${query}`, {
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
    async create(data: IEmploymentForm): Promise<IResponseItem<IEmployment>> {
      const response = await axios.post<IResponseItem<IEmployment>>('/api/private/admin/employment/create', data, {
        headers: {
          Authorization: access().accessToken || '',
        },
      });

      return response.data;
    },
    async update(data: IEmploymentForm): Promise<IResponseItem<IEmployment>> {
      const response = await axios.put<IResponseItem<IEmployment>>(`/api/private/admin/employment/update/${data.id}`, data, {
        headers: {
          Authorization: access().accessToken || '',
        },
      });

      return response.data;
    },
    async status(id: TId, status: boolean): Promise<IResponseItem<IEmploymentForm>> {
      const response = await axios.put<IResponseItem<IEmploymentForm>>(`/api/private/admin/employment/update/status/${id}`, {
        status,
      }, {
        headers: {
          Authorization: access().accessToken || '',
        },
      });

      return response.data;
    },
    async destroy(ids: Array<TId>): Promise<IResponseItem<IEmploymentForm>> {
      const response = await axios.delete<IResponseItem<IEmploymentForm>>('/api/private/admin/employment/destroy', {
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
