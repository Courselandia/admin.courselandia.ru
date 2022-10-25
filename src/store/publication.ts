import { defineStore } from 'pinia';

import axios from '@/helpers/axios';
import toQuery from '@/helpers/toQuery';
import IPublication from '@/interfaces/modules/publication/publication';
import IPublicationForm from '@/interfaces/modules/publication/publicationForm';
import IFilters from '@/interfaces/molecules/table/filters';
import ISorts from '@/interfaces/molecules/table/sorts';
import { IResponseItem, IResponseItems } from '@/interfaces/response';
import access from '@/store/access';
import TId from '@/types/id';

export default defineStore('publication', {
  state: () => ({
    items: null as IPublication[] | null,
    item: null as IPublication | null,
    total: null as number | null,
  }),
  actions: {
    async get(id: TId): Promise<IResponseItem<IPublication>> {
      try {
        const response = await axios.get<IResponseItem<IPublication>>(`/api/private/admin/publication/get/${id}`, {
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
    ): Promise<IResponseItems<IPublication>> {
      try {
        const query = toQuery(offset, limit, sorts, filters);
        const response = await axios.get<IResponseItems<IPublication>>(`/api/private/admin/publication/read?${query}`, {
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
    async create(data: IPublicationForm): Promise<IResponseItem<IPublication>> {
      const formData = new FormData();
      formData.append('published_at', data.published_at?.format('YYYY-MM-DD HH:mm:ss ZZ') || '');
      formData.append('header', data.header);
      formData.append('link', data.link);
      formData.append('anons', data.anons || '');
      formData.append('article', data.article || '');
      formData.append('title', data.title || '');
      formData.append('description', data.description || '');
      formData.append('keywords', data.keywords || '');
      formData.append('status', data.status ? '1' : '0');
      formData.append('image', data.image || '');

      const response = await axios.post<IResponseItem<IPublication>>('/api/private/admin/publication/create', formData, {
        headers: {
          Authorization: access().accessToken || '',
        },
      });

      return response.data;
    },
    async update(data: IPublicationForm): Promise<IResponseItem<IPublication>> {
      const response = await axios.put<IResponseItem<IPublication>>(`/api/private/admin/publication/update/${data.id}`, {
        ...data,
        published_at: data.published_at?.format('YYYY-MM-DD HH:mm:ss ZZ'),
      }, {
        headers: {
          Authorization: access().accessToken || '',
        },
      });

      return response.data;
    },
    async status(id: TId, status: boolean): Promise<IResponseItem<IPublicationForm>> {
      const response = await axios.put<IResponseItem<IPublicationForm>>(`/api/private/admin/publication/update/status/${id}`, {
        status,
      }, {
        headers: {
          Authorization: access().accessToken || '',
        },
      });

      return response.data;
    },
    async destroy(ids: Array<TId>): Promise<IResponseItem<IPublicationForm>> {
      const response = await axios.delete<IResponseItem<IPublicationForm>>('/api/private/admin/publication/destroy', {
        params: {
          ids: JSON.stringify(ids),
        },
        headers: {
          Authorization: access().accessToken || '',
        },
      });

      return response.data;
    },
    async imageUpdate(id: TId, file: File): Promise<IResponseItem<IPublication>> {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('_method', 'put');

      const response = await axios.post<IResponseItem<IPublication>>(`/api/private/admin/publication/update/image/${id}`, formData, {
        headers: {
          Authorization: access().accessToken || '',
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    },
    async imageDestroy(id: TId): Promise<IResponseItem<IPublication>> {
      const response = await axios.delete<IResponseItem<IPublication>>(`/api/private/admin/publication/destroy/image/${id}`, {
        headers: {
          Authorization: access().accessToken || '',
        },
      });

      return response.data;
    },
  },
});
