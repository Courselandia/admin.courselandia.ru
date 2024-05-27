import dayjs from 'dayjs';
import { defineStore } from 'pinia';

import axios from '@/helpers/axios';
import toQuery from '@/helpers/toQuery';
import IPromotion from '@/interfaces/modules/promotion/promotion';
import IPromotionForm from '@/interfaces/modules/promotion/promotionForm';
import IFilters from '@/interfaces/molecules/table/filters';
import ISorts from '@/interfaces/molecules/table/sorts';
import { IResponseItem, IResponseItems } from '@/interfaces/response';
import access from '@/stores/access';
import TId from '@/types/id';

export default defineStore('promotion', {
  state: () => ({
    items: null as IPromotion[] | null,
    item: null as IPromotion | null,
    total: null as number | null,
  }),
  actions: {
    async get(id: TId): Promise<IResponseItem<IPromotion>> {
      try {
        const response = await axios.get<IResponseItem<IPromotion>>(`/api/private/admin/promotion/get/${id}`, {
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
    ): Promise<IResponseItems<IPromotion>> {
      try {
        const query = toQuery(offset, limit, sorts, filters);
        const response = await axios.get<IResponseItems<IPromotion>>(`/api/private/admin/promotion/read?${query}`, {
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
    async create(data: IPromotionForm): Promise<IResponseItem<IPromotion>> {
      const dateStart = data.date_start as dayjs.Dayjs;
      const dateEnd = data.date_end as dayjs.Dayjs;

      const response = await axios.post<IResponseItem<IPromotion>>('/api/private/admin/promotion/create', {
        ...data,
        school_id: data.school_id?.key,
        date_start: dateStart?.format('YYYY-MM-DD ZZ'),
        date_end: dateEnd?.format('YYYY-MM-DD ZZ'),
      }, {
        headers: {
          Authorization: access().accessToken || '',
        },
      });

      return response.data;
    },
    async update(data: IPromotionForm): Promise<IResponseItem<IPromotion>> {
      const dateStart = data.date_start as dayjs.Dayjs;
      const dateEnd = data.date_end as dayjs.Dayjs;

      const response = await axios.put<IResponseItem<IPromotion>>(`/api/private/admin/promotion/update/${data.id}`, {
        ...data,
        school_id: data.school_id?.key,
        date_start: dateStart?.format('YYYY-MM-DD ZZ'),
        date_end: dateEnd?.format('YYYY-MM-DD ZZ'),
      }, {
        headers: {
          Authorization: access().accessToken || '',
        },
      });

      return response.data;
    },
    async status(id: TId, status: boolean): Promise<IResponseItem<IPromotionForm>> {
      const response = await axios.put<IResponseItem<IPromotionForm>>(`/api/private/admin/promotion/update/status/${id}`, {
        status,
      }, {
        headers: {
          Authorization: access().accessToken || '',
        },
      });

      return response.data;
    },
    async destroy(ids: Array<TId>): Promise<IResponseItem<IPromotionForm>> {
      const response = await axios.delete<IResponseItem<IPromotionForm>>('/api/private/admin/promotion/destroy', {
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
