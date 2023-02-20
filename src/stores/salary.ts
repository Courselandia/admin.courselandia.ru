import { defineStore } from 'pinia';

import axios from '@/helpers/axios';
import toQuery from '@/helpers/toQuery';
import ISalary from '@/interfaces/modules/salary/salary';
import ISalaryForm from '@/interfaces/modules/salary/salaryForm';
import IFilters from '@/interfaces/molecules/table/filters';
import ISorts from '@/interfaces/molecules/table/sorts';
import { IResponseItem, IResponseItems } from '@/interfaces/response';
import access from '@/stores/access';
import TId from '@/types/id';

export default defineStore('salary', {
  state: () => ({
    items: null as ISalary[] | null,
    item: null as ISalary | null,
    total: null as number | null,
  }),
  actions: {
    async get(id: TId): Promise<IResponseItem<ISalary>> {
      try {
        const response = await axios.get<IResponseItem<ISalary>>(`/api/private/admin/salary/get/${id}`, {
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
    ): Promise<IResponseItems<ISalary>> {
      try {
        const query = toQuery(offset, limit, sorts, filters);
        const response = await axios.get<IResponseItems<ISalary>>(`/api/private/admin/salary/read?${query}`, {
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
    async create(data: ISalaryForm): Promise<IResponseItem<ISalary>> {
      const response = await axios.post<IResponseItem<ISalary>>('/api/private/admin/salary/create', {
        ...data,
        profession_id: data.profession_id?.key,
      }, {
        headers: {
          Authorization: access().accessToken || '',
        },
      });

      return response.data;
    },
    async update(data: ISalaryForm): Promise<IResponseItem<ISalary>> {
      const response = await axios.put<IResponseItem<ISalary>>(`/api/private/admin/salary/update/${data.id}`, {
        ...data,
        profession_id: data.profession_id?.key,
      }, {
        headers: {
          Authorization: access().accessToken || '',
        },
      });

      return response.data;
    },
    async status(id: TId, status: boolean): Promise<IResponseItem<ISalaryForm>> {
      const response = await axios.put<IResponseItem<ISalaryForm>>(`/api/private/admin/salary/update/status/${id}`, {
        status,
      }, {
        headers: {
          Authorization: access().accessToken || '',
        },
      });

      return response.data;
    },
    async destroy(ids: Array<TId>): Promise<IResponseItem<ISalaryForm>> {
      const response = await axios.delete<IResponseItem<ISalaryForm>>('/api/private/admin/salary/destroy', {
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
