import { defineStore } from 'pinia';

import axios from '@/helpers/axios';
import toQuery from '@/helpers/toQuery';
import ICategory from '@/interfaces/modules/category/category';
import ICategoryForm from '@/interfaces/modules/category/categoryForm';
import IFilters from '@/interfaces/molecules/table/filters';
import ISorts from '@/interfaces/molecules/table/sorts';
import { IResponseItem, IResponseItems } from '@/interfaces/response';
import access from '@/store/access';
import TId from '@/types/id';

export default defineStore('category', {
  state: () => ({
    items: null as ICategory[] | null,
    item: null as ICategory | null,
    total: null as number | null,
  }),
  actions: {
    async get(id: TId): Promise<IResponseItem<ICategory>> {
      try {
        const response = await axios.get<IResponseItem<ICategory>>(`/api/private/admin/category/get/${id}`, {
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
    ): Promise<IResponseItems<ICategory>> {
      try {
        const query = toQuery(offset, limit, sorts, filters);
        const response = await axios.get<IResponseItems<ICategory>>(`/api/private/admin/category/read?${query}`, {
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
    async create(data: ICategoryForm): Promise<IResponseItem<ICategory>> {
      const response = await axios.post<IResponseItem<ICategory>>('/api/private/admin/category/create', data, {
        headers: {
          Authorization: access().accessToken || '',
        },
      });

      return response.data;
    },
    async update(data: ICategoryForm): Promise<IResponseItem<ICategory>> {
      const response = await axios.put<IResponseItem<ICategory>>(`/api/private/admin/category/update/${data.id}`, data, {
        headers: {
          Authorization: access().accessToken || '',
        },
      });

      return response.data;
    },
    async status(id: TId, status: boolean): Promise<IResponseItem<ICategoryForm>> {
      const response = await axios.put<IResponseItem<ICategoryForm>>(`/api/private/admin/category/update/status/${id}`, {
        status,
      }, {
        headers: {
          Authorization: access().accessToken || '',
        },
      });

      return response.data;
    },
    async destroy(ids: Array<TId>): Promise<IResponseItem<ICategoryForm>> {
      const response = await axios.delete<IResponseItem<ICategoryForm>>('/api/private/admin/category/destroy', {
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
