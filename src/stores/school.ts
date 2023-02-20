import { defineStore } from 'pinia';

import axios from '@/helpers/axios';
import toQuery from '@/helpers/toQuery';
import ISchool from '@/interfaces/modules/school/school';
import ISchoolForm from '@/interfaces/modules/school/schoolForm';
import IFilters from '@/interfaces/molecules/table/filters';
import ISorts from '@/interfaces/molecules/table/sorts';
import { IResponseItem, IResponseItems } from '@/interfaces/response';
import access from '@/stores/access';
import TId from '@/types/id';

export default defineStore('school', {
  state: () => ({
    items: null as ISchool[] | null,
    item: null as ISchool | null,
    total: null as number | null,
  }),
  actions: {
    async get(id: TId): Promise<IResponseItem<ISchool>> {
      try {
        const response = await axios.get<IResponseItem<ISchool>>(`/api/private/admin/school/get/${id}`, {
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
    ): Promise<IResponseItems<ISchool>> {
      try {
        const query = toQuery(offset, limit, sorts, filters);
        const response = await axios.get<IResponseItems<ISchool>>(`/api/private/admin/school/read?${query}`, {
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
    async create(data: ISchoolForm): Promise<IResponseItem<ISchool>> {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('header', data.header);
      formData.append('link', data.link);
      formData.append('text', data.text || '');
      formData.append('site', data.site || '');
      formData.append('rating', data.rating ? String(data.rating) : '0');
      formData.append('title', data.title || '');
      formData.append('description', data.description || '');
      formData.append('keywords', data.keywords || '');
      formData.append('status', data.status ? '1' : '0');
      formData.append('imageLogo', data.imageLogo || '');
      formData.append('imageSite', data.imageSite || '');

      const response = await axios.post<IResponseItem<ISchool>>('/api/private/admin/school/create', formData, {
        headers: {
          Authorization: access().accessToken || '',
        },
      });

      return response.data;
    },
    async update(data: ISchoolForm): Promise<IResponseItem<ISchool>> {
      const response = await axios.put<IResponseItem<ISchool>>(`/api/private/admin/school/update/${data.id}`, {
        ...data,
        rating: data.rating ? String(data.rating) : '0',
      }, {
        headers: {
          Authorization: access().accessToken || '',
        },
      });

      return response.data;
    },
    async status(id: TId, status: boolean): Promise<IResponseItem<ISchoolForm>> {
      const response = await axios.put<IResponseItem<ISchoolForm>>(`/api/private/admin/school/update/status/${id}`, {
        status,
      }, {
        headers: {
          Authorization: access().accessToken || '',
        },
      });

      return response.data;
    },
    async destroy(ids: Array<TId>): Promise<IResponseItem<ISchoolForm>> {
      const response = await axios.delete<IResponseItem<ISchoolForm>>('/api/private/admin/school/destroy', {
        params: {
          ids,
        },
        headers: {
          Authorization: access().accessToken || '',
        },
      });

      return response.data;
    },
    async imageUpdate(id: TId, type: string, file: File): Promise<IResponseItem<ISchool>> {
      const formData = new FormData();
      formData.append('type', type);
      formData.append('image', file);
      formData.append('_method', 'put');

      const response = await axios.post<IResponseItem<ISchool>>(`/api/private/admin/school/update/image/${id}`, formData, {
        headers: {
          Authorization: access().accessToken || '',
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    },
    async imageDestroy(id: TId, type: string): Promise<IResponseItem<ISchool>> {
      const response = await axios.delete<IResponseItem<ISchool>>(`/api/private/admin/school/destroy/image/${id}`, {
        params: {
          type,
        },
        headers: {
          Authorization: access().accessToken || '',
        },
      });

      return response.data;
    },
  },
});
