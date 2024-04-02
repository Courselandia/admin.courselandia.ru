import dayjs from 'dayjs';
import { defineStore } from 'pinia';

import axios from '@/helpers/axios';
import toQuery from '@/helpers/toQuery';
import ICollection from '@/interfaces/modules/collection/collection';
import ICollectionForm from '@/interfaces/modules/collection/collectionForm';
import IFilters from '@/interfaces/molecules/table/filters';
import ISorts from '@/interfaces/molecules/table/sorts';
import { IResponseItem, IResponseItems } from '@/interfaces/response';
import access from '@/stores/access';
import TId from '@/types/id';

export default defineStore('collection', {
  state: () => ({
    items: null as ICollection[] | null,
    item: null as ICollection | null,
    total: null as number | null,
  }),
  actions: {
    async get(id: TId): Promise<IResponseItem<ICollection>> {
      try {
        const response = await axios.get<IResponseItem<ICollection>>(`/api/private/admin/collection/get/${id}`, {
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
    ): Promise<IResponseItems<ICollection>> {
      try {
        const query = toQuery(offset, limit, sorts, filters);
        const response = await axios.get<IResponseItems<ICollection>>(`/api/private/admin/collection/read?${query}`, {
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
    async create(data: ICollectionForm): Promise<IResponseItem<ICollection>> {
      const formData = new FormData();
      const publishedAt = data.published_at as dayjs.Dayjs;
      formData.append('published_at', publishedAt?.format('YYYY-MM-DD HH:mm:ss ZZ') || '');
      formData.append('header', data.header || '');
      formData.append('link', data.link || '');
      formData.append('anons', data.anons || '');
      formData.append('article', data.article || '');
      formData.append('title', data.title || '');
      formData.append('description', data.description || '');
      formData.append('keywords', data.keywords || '');
      formData.append('status', data.status ? '1' : '0');
      formData.append('image', data.image || '');

      const response = await axios.post<IResponseItem<ICollection>>('/api/private/admin/collection/create', formData, {
        headers: {
          Authorization: access().accessToken || '',
        },
      });

      return response.data;
    },
    async update(data: ICollectionForm): Promise<IResponseItem<ICollection>> {
      const publishedAt = data.published_at as dayjs.Dayjs;

      const response = await axios.put<IResponseItem<ICollection>>(`/api/private/admin/collection/update/${data.id}`, {
        ...data,
        published_at: publishedAt?.format('YYYY-MM-DD HH:mm:ss ZZ'),
      }, {
        headers: {
          Authorization: access().accessToken || '',
        },
      });

      return response.data;
    },
    async status(id: TId, status: boolean): Promise<IResponseItem<ICollectionForm>> {
      const response = await axios.put<IResponseItem<ICollectionForm>>(`/api/private/admin/collection/update/status/${id}`, {
        status,
      }, {
        headers: {
          Authorization: access().accessToken || '',
        },
      });

      return response.data;
    },
    async destroy(ids: Array<TId>): Promise<IResponseItem<ICollectionForm>> {
      const response = await axios.delete<IResponseItem<ICollectionForm>>('/api/private/admin/collection/destroy', {
        params: {
          ids,
        },
        headers: {
          Authorization: access().accessToken || '',
        },
      });

      return response.data;
    },
    async imageUpdate(id: TId, file: File): Promise<IResponseItem<ICollection>> {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('_method', 'put');

      const response = await axios.post<IResponseItem<ICollection>>(`/api/private/admin/collection/update/image/${id}`, formData, {
        headers: {
          Authorization: access().accessToken || '',
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    },
    async imageDestroy(id: TId): Promise<IResponseItem<ICollection>> {
      const response = await axios.delete<IResponseItem<ICollection>>(`/api/private/admin/collection/destroy/image/${id}`, {
        headers: {
          Authorization: access().accessToken || '',
        },
      });

      return response.data;
    },
  },
});
