import dayjs from 'dayjs';
import { defineStore } from 'pinia';

import axios from '@/helpers/axios';
import toQuery from '@/helpers/toQuery';
import IReview from '@/interfaces/modules/review/review';
import IReviewForm from '@/interfaces/modules/review/reviewForm';
import IFilters from '@/interfaces/molecules/table/filters';
import ISorts from '@/interfaces/molecules/table/sorts';
import { IResponseItem, IResponseItems } from '@/interfaces/response';
import access from '@/stores/access';
import TId from '@/types/id';

export default defineStore('review', {
  state: () => ({
    items: null as IReview[] | null,
    item: null as IReview | null,
    total: null as number | null,
  }),
  actions: {
    async get(id: TId): Promise<IResponseItem<IReview>> {
      try {
        const response = await axios.get<IResponseItem<IReview>>(`/api/private/admin/review/get/${id}`, {
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
    ): Promise<IResponseItems<IReview>> {
      try {
        const query = toQuery(offset, limit, sorts, filters);
        const response = await axios.get<IResponseItems<IReview>>(`/api/private/admin/review/read?${query}`, {
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
    async create(data: IReviewForm): Promise<IResponseItem<IReview>> {
      const createdAt = data.created_at as dayjs.Dayjs;
      const response = await axios.post<IResponseItem<IReview>>('/api/private/admin/review/create', {
        ...data,
        course_id: data.course_id?.key,
        school_id: data.school_id?.key,
        created_at: createdAt?.format('YYYY-MM-DD HH:mm:ss ZZ') || '',
      }, {
        headers: {
          Authorization: access().accessToken || '',
        },
      });

      return response.data;
    },
    async update(data: IReviewForm): Promise<IResponseItem<IReview>> {
      const createdAt = data.created_at as dayjs.Dayjs;

      const response = await axios.put<IResponseItem<IReview>>(`/api/private/admin/review/update/${data.id}`, {
        ...data,
        course_id: data.course_id?.key,
        school_id: data.school_id?.key,
        created_at: createdAt?.format('YYYY-MM-DD HH:mm:ss ZZ') || '',
      }, {
        headers: {
          Authorization: access().accessToken || '',
        },
      });

      return response.data;
    },
    async destroy(ids: Array<TId>): Promise<IResponseItem<IReviewForm>> {
      const response = await axios.delete<IResponseItem<IReviewForm>>('/api/private/admin/review/destroy', {
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
