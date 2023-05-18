import { defineStore } from 'pinia';

import EStatus from '@/enums/modules/article/status';
import axios from '@/helpers/axios';
import toQuery from '@/helpers/toQuery';
import IArticle from '@/interfaces/modules/article/article';
import IArticleForm from '@/interfaces/modules/article/articleForm';
import IFilters from '@/interfaces/molecules/table/filters';
import ISorts from '@/interfaces/molecules/table/sorts';
import { IResponseItem, IResponseItems } from '@/interfaces/response';
import access from '@/stores/access';
import TId from '@/types/id';

export default defineStore('article', {
  state: () => ({
    items: null as IArticle[] | null,
    item: null as IArticle | null,
    total: null as number | null,
  }),
  actions: {
    async get(id: TId): Promise<IResponseItem<IArticle>> {
      try {
        const response = await axios.get<IResponseItem<IArticle>>(`/api/private/admin/article/get/${id}`, {
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
    ): Promise<IResponseItems<IArticle>> {
      try {
        const query = toQuery(offset, limit, sorts, filters);
        const response = await axios.get<IResponseItems<IArticle>>(`/api/private/admin/article/read?${query}`, {
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
    async update(data: IArticleForm): Promise<IResponseItem<IArticle>> {
      const response = await axios.put<IResponseItem<IArticle>>(`/api/private/admin/article/update/${data.id}`, data, {
        headers: {
          Authorization: access().accessToken || '',
        },
      });

      return response.data;
    },
    async status(id: TId, status: EStatus): Promise<IResponseItem<IArticle>> {
      const response = await axios.put<IResponseItem<IArticle>>(`/api/private/admin/article/update/status/${id}`, {
        status,
      }, {
        headers: {
          Authorization: access().accessToken || '',
        },
      });

      return response.data;
    },
    async rewrite(id: TId, request: string): Promise<IResponseItem<IArticle>> {
      const response = await axios.put<IResponseItem<IArticle>>(`/api/private/admin/article/rewrite/${id}`, {
        request,
      }, {
        headers: {
          Authorization: access().accessToken || '',
        },
      });

      return response.data;
    },
    async apply(id: TId): Promise<IResponseItem<IArticle>> {
      const response = await axios.put<IResponseItem<IArticle>>(`/api/private/admin/article/apply/${id}`, {}, {
        headers: {
          Authorization: access().accessToken || '',
        },
      });

      return response.data;
    },
  },
});
