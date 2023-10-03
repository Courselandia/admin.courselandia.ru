import dayjs from 'dayjs';
import { defineStore } from 'pinia';

import axios from '@/helpers/axios';
import toQuery from '@/helpers/toQuery';
import ITeacher from '@/interfaces/modules/teacher/teacher';
import ITeacherForm from '@/interfaces/modules/teacher/teacherForm';
import IFilters from '@/interfaces/molecules/table/filters';
import ISorts from '@/interfaces/molecules/table/sorts';
import { IResponseItem, IResponseItems } from '@/interfaces/response';
import access from '@/stores/access';
import TId from '@/types/id';

export default defineStore('teacher', {
  state: () => ({
    items: null as ITeacher[] | null,
    item: null as ITeacher | null,
    total: null as number | null,
  }),
  actions: {
    async get(id: TId): Promise<IResponseItem<ITeacher>> {
      try {
        const response = await axios.get<IResponseItem<ITeacher>>(`/api/private/admin/teacher/get/${id}`, {
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
    ): Promise<IResponseItems<ITeacher>> {
      try {
        const query = toQuery(offset, limit, sorts, filters);
        const response = await axios.get<IResponseItems<ITeacher>>(`/api/private/admin/teacher/read?${query}`, {
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
    async create(data: ITeacherForm): Promise<IResponseItem<ITeacher>> {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('link', data.link);
      formData.append('text', data.text || '');
      formData.append('city', data.city || '');
      formData.append('comment', data.comment || '');
      formData.append('rating', data.rating ? String(data.rating) : '0');
      formData.append('title', data.title || '');
      formData.append('description', data.description || '');
      formData.append('title_template', data.title_template || '');
      formData.append('description_template', data.description_template || '');
      formData.append('keywords', data.keywords || '');
      formData.append('status', data.status ? '1' : '0');
      formData.append('copied', data.copied ? '1' : '0');
      formData.append('image', data.image || '');

      for (let i = 0; i < data.directions.length; i++) {
        formData.append(`directions[${i}]`, String(data.directions[i].key));
      }

      for (let i = 0; i < data.schools.length; i++) {
        formData.append(`schools[${i}]`, String(data.schools[i].key));
      }

      if (data.experiences) {
        for (let i = 0, z = 0; i < data.experiences.length; i++) {
          if (data.experiences[i].place && data.experiences[i].position) {
            const started = data.experiences[i].started as unknown as dayjs.Dayjs;
            const finished = data.experiences[i].finished as unknown as dayjs.Dayjs;

            formData.append(`experiences[${z}][place]`, data.experiences[i].place || '');
            formData.append(`experiences[${z}][position]`, data.experiences[i].position || '');
            formData.append(`experiences[${z}][started]`, started?.format('YYYY-MM-DD') || '');
            formData.append(`experiences[${z}][finished]`, finished?.format('YYYY-MM-DD') || '');
            formData.append(`experiences[${z}][weight]`, String(data.experiences[i].weight || 0));
            z++;
          }
        }
      }

      const response = await axios.post<IResponseItem<ITeacher>>('/api/private/admin/teacher/create', formData, {
        headers: {
          Authorization: access().accessToken || '',
        },
      });

      return response.data;
    },
    async update(data: ITeacherForm): Promise<IResponseItem<ITeacher>> {
      const response = await axios.put<IResponseItem<ITeacher>>(`/api/private/admin/teacher/update/${data.id}`, {
        ...data,
        rating: data.rating ? String(data.rating) : '0',
        directions: data.directions?.map((item) => item.key),
        schools: data.schools?.map((item) => item.key),
      }, {
        headers: {
          Authorization: access().accessToken || '',
        },
      });

      return response.data;
    },
    async status(id: TId, status: boolean): Promise<IResponseItem<ITeacherForm>> {
      const response = await axios.put<IResponseItem<ITeacherForm>>(`/api/private/admin/teacher/update/status/${id}`, {
        status,
      }, {
        headers: {
          Authorization: access().accessToken || '',
        },
      });

      return response.data;
    },
    async destroy(ids: Array<TId>): Promise<IResponseItem<ITeacherForm>> {
      const response = await axios.delete<IResponseItem<ITeacherForm>>('/api/private/admin/teacher/destroy', {
        params: {
          ids,
        },
        headers: {
          Authorization: access().accessToken || '',
        },
      });

      return response.data;
    },
    async imageUpdate(id: TId, file: File): Promise<IResponseItem<ITeacher>> {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('_method', 'put');

      const response = await axios.post<IResponseItem<ITeacher>>(`/api/private/admin/teacher/update/image/${id}`, formData, {
        headers: {
          Authorization: access().accessToken || '',
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    },
    async imageDestroy(id: TId): Promise<IResponseItem<ITeacher>> {
      const response = await axios.delete<IResponseItem<ITeacher>>(`/api/private/admin/teacher/destroy/image/${id}`, {
        headers: {
          Authorization: access().accessToken || '',
        },
      });

      return response.data;
    },
  },
});
