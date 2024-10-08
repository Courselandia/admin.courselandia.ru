import { defineStore } from 'pinia';

import axios from '@/helpers/axios';
import toQuery from '@/helpers/toQuery';
import ICourse from '@/interfaces/modules/course/course';
import ICourseForm from '@/interfaces/modules/course/courseForm';
import IFilters from '@/interfaces/molecules/table/filters';
import ISorts from '@/interfaces/molecules/table/sorts';
import { IResponseItem, IResponseItems } from '@/interfaces/response';
import access from '@/stores/access';
import TId from '@/types/id';

export default defineStore('course', {
  state: () => ({
    items: null as ICourse[] | null,
    item: null as ICourse | null,
    total: null as number | null,
  }),
  actions: {
    async get(id: TId): Promise<IResponseItem<ICourse>> {
      try {
        const response = await axios.get<IResponseItem<ICourse>>(`/api/private/admin/course/get/${id}`, {
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
    ): Promise<IResponseItems<ICourse>> {
      try {
        const query = toQuery(offset, limit, sorts, filters);
        const response = await axios.get<IResponseItems<ICourse>>(`/api/private/admin/course/read?${query}`, {
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
    async create(data: ICourseForm): Promise<IResponseItem<ICourse>> {
      const formData = new FormData();
      formData.append('name', data.name || '');
      formData.append('header_template', data.header_template || '');
      formData.append('school_id', data.school_id?.key as string);
      formData.append('text', data.text || '');
      formData.append('link', data.link || '');
      formData.append('url', data.url || '');
      formData.append('language', data.language || '');
      formData.append('rating', data.rating ? String(data.rating) : '');
      formData.append('price', data.price ? String(data.price) : '');
      formData.append('price_old', data.price_old ? String(data.price_old) : '');
      formData.append('price_recurrent', data.price_recurrent ? String(data.price_recurrent) : '');
      formData.append('currency', data.currency ? String(data.currency) : '');
      formData.append('online', data.online ? '1' : '0');
      formData.append('employment', data.employment ? '1' : '0');
      formData.append('duration', data.duration ? String(data.duration) : '');
      formData.append('duration_unit', data.duration_unit ? String(data.duration_unit) : '');
      formData.append('lessons_amount', data.lessons_amount ? String(data.lessons_amount) : '');
      formData.append('modules_amount', data.modules_amount ? String(data.modules_amount) : '');
      formData.append('status', data.status ? String(data.status) : '');
      formData.append('title_template', data.title_template || '');
      formData.append('description_template', data.description_template || '');
      formData.append('keywords', data.keywords || '');
      formData.append('image', data.image || '');

      if (data.directions) {
        for (let i = 0; i < data.directions.length; i++) {
          formData.append(`directions[${i}]`, data.directions[i].key as string);
        }
      }

      if (data.professions) {
        for (let i = 0; i < data.professions.length; i++) {
          formData.append(`professions[${i}]`, data.professions[i].key as string);
        }
      }

      if (data.categories) {
        for (let i = 0; i < data.categories.length; i++) {
          formData.append(`categories[${i}]`, data.categories[i].key as string);
        }
      }

      if (data.skills) {
        for (let i = 0; i < data.skills.length; i++) {
          formData.append(`skills[${i}]`, data.skills[i].key as string);
        }
      }

      if (data.teachers) {
        for (let i = 0; i < data.teachers.length; i++) {
          formData.append(`teachers[${i}]`, data.teachers[i].key as string);
        }
      }

      if (data.tools) {
        for (let i = 0; i < data.tools.length; i++) {
          formData.append(`tools[${i}]`, data.tools[i].key as string);
        }
      }

      if (data.employments) {
        for (let i = 0; i < data.employments.length; i++) {
          formData.append(`employments[${i}]`, data.employments[i].key as string);
        }
      }

      if (data.processes) {
        for (let i = 0; i < data.processes.length; i++) {
          formData.append(`processes[${i}]`, data.processes[i].key as string);
        }
      }

      if (data.levels) {
        for (let i = 0; i < data.levels.length; i++) {
          formData.append(`levels[${i}]`, data.levels[i]);
        }
      }

      if (data.learns) {
        for (let i = 0; i < data.learns.length; i++) {
          formData.append(`learns[${i}]`, data.learns[i]);
        }
      }

      if (data.features) {
        for (let i = 0; i < data.features.length; i++) {
          formData.append(`features[${i}][icon]`, data.features[i].icon || '');
          formData.append(`features[${i}][text]`, data.features[i].text || '');
        }
      }

      if (data.program) {
        formData.append('program', JSON.stringify(data.program));
      }

      const response = await axios.post<IResponseItem<ICourse>>('/api/private/admin/course/create', formData, {
        headers: {
          Authorization: access().accessToken || '',
        },
      });

      return response.data;
    },
    async update(data: ICourseForm): Promise<IResponseItem<ICourse>> {
      const response = await axios.put<IResponseItem<ICourse>>(`/api/private/admin/course/update/${data.id}`, {
        ...data,
        directions: data.directions?.map((item) => item.key),
        professions: data.professions?.map((item) => item.key),
        categories: data.categories?.map((item) => item.key),
        skills: data.skills?.map((item) => item.key),
        teachers: data.teachers?.map((item) => item.key),
        tools: data.tools?.map((item) => item.key),
        employments: data.employments?.map((item) => item.key),
        processes: data.processes?.map((item) => item.key),
        school_id: data.school_id?.key,
        program: JSON.stringify(data.program),
      }, {
        headers: {
          Authorization: access().accessToken || '',
        },
      });

      return response.data;
    },
    async destroy(ids: Array<TId>): Promise<IResponseItem<ICourseForm>> {
      const response = await axios.delete<IResponseItem<ICourseForm>>('/api/private/admin/course/destroy', {
        params: {
          ids,
        },
        headers: {
          Authorization: access().accessToken || '',
        },
      });

      return response.data;
    },
    async imageUpdate(id: TId, file: File): Promise<IResponseItem<ICourse>> {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('_method', 'put');

      const response = await axios.post<IResponseItem<ICourse>>(`/api/private/admin/course/update/image/${id}`, formData, {
        headers: {
          Authorization: access().accessToken || '',
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    },
    async imageDestroy(id: TId): Promise<IResponseItem<ICourse>> {
      const response = await axios.delete<IResponseItem<ICourse>>(`/api/private/admin/course/destroy/image/${id}`, {
        headers: {
          Authorization: access().accessToken || '',
        },
      });

      return response.data;
    },
  },
});
