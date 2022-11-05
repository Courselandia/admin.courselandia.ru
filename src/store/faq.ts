import { defineStore } from 'pinia';

import axios from '@/helpers/axios';
import toQuery from '@/helpers/toQuery';
import IFaq from '@/interfaces/modules/faq/faq';
import IFaqForm from '@/interfaces/modules/faq/faqForm';
import IFilters from '@/interfaces/molecules/table/filters';
import ISorts from '@/interfaces/molecules/table/sorts';
import { IResponseItem, IResponseItems } from '@/interfaces/response';
import access from '@/store/access';
import TId from '@/types/id';

export default defineStore('faq', {
  state: () => ({
    items: null as IFaq[] | null,
    item: null as IFaq | null,
    total: null as number | null,
  }),
  actions: {
    async get(id: TId): Promise<IResponseItem<IFaq>> {
      try {
        const response = await axios.get<IResponseItem<IFaq>>(`/api/private/admin/faq/get/${id}`, {
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
    ): Promise<IResponseItems<IFaq>> {
      try {
        const query = toQuery(offset, limit, sorts, filters);
        const response = await axios.get<IResponseItems<IFaq>>(`/api/private/admin/faq/read?${query}`, {
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
    async create(data: IFaqForm): Promise<IResponseItem<IFaq>> {
      const response = await axios.post<IResponseItem<IFaq>>('/api/private/admin/faq/create', data, {
        headers: {
          Authorization: access().accessToken || '',
        },
      });

      return response.data;
    },
    async update(data: IFaqForm): Promise<IResponseItem<IFaq>> {
      const response = await axios.put<IResponseItem<IFaq>>(`/api/private/admin/faq/update/${data.id}`, data, {
        headers: {
          Authorization: access().accessToken || '',
        },
      });

      return response.data;
    },
    async status(id: TId, status: boolean): Promise<IResponseItem<IFaqForm>> {
      const response = await axios.put<IResponseItem<IFaqForm>>(`/api/private/admin/faq/update/status/${id}`, {
        status,
      }, {
        headers: {
          Authorization: access().accessToken || '',
        },
      });

      return response.data;
    },
    async destroy(ids: Array<TId>): Promise<IResponseItem<IFaqForm>> {
      const response = await axios.delete<IResponseItem<IFaqForm>>('/api/private/admin/faq/destroy', {
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
