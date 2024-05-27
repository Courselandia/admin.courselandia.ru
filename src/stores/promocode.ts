import dayjs from 'dayjs';
import { defineStore } from 'pinia';

import axios from '@/helpers/axios';
import toQuery from '@/helpers/toQuery';
import IPromocode from '@/interfaces/modules/promocode/promocode';
import IPromocodeForm from '@/interfaces/modules/promocode/promocodeForm';
import IFilters from '@/interfaces/molecules/table/filters';
import ISorts from '@/interfaces/molecules/table/sorts';
import { IResponseItem, IResponseItems } from '@/interfaces/response';
import access from '@/stores/access';
import TId from '@/types/id';

export default defineStore('promocode', {
  state: () => ({
    items: null as IPromocode[] | null,
    item: null as IPromocode | null,
    total: null as number | null,
  }),
  actions: {
    async get(id: TId): Promise<IResponseItem<IPromocode>> {
      try {
        const response = await axios.get<IResponseItem<IPromocode>>(`/api/private/admin/promocode/get/${id}`, {
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
    ): Promise<IResponseItems<IPromocode>> {
      try {
        const query = toQuery(offset, limit, sorts, filters);
        const response = await axios.get<IResponseItems<IPromocode>>(`/api/private/admin/promocode/read?${query}`, {
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
    async create(data: IPromocodeForm): Promise<IResponseItem<IPromocode>> {
      const dateStart = data.date_start as dayjs.Dayjs;
      const dateEnd = data.date_end as dayjs.Dayjs;

      const response = await axios.post<IResponseItem<IPromocode>>('/api/private/admin/promocode/create', {
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
    async update(data: IPromocodeForm): Promise<IResponseItem<IPromocode>> {
      const dateStart = data.date_start as dayjs.Dayjs;
      const dateEnd = data.date_end as dayjs.Dayjs;

      const response = await axios.put<IResponseItem<IPromocode>>(`/api/private/admin/promocode/update/${data.id}`, {
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
    async status(id: TId, status: boolean): Promise<IResponseItem<IPromocodeForm>> {
      const response = await axios.put<IResponseItem<IPromocodeForm>>(`/api/private/admin/promocode/update/status/${id}`, {
        status,
      }, {
        headers: {
          Authorization: access().accessToken || '',
        },
      });

      return response.data;
    },
    async destroy(ids: Array<TId>): Promise<IResponseItem<IPromocodeForm>> {
      const response = await axios.delete<IResponseItem<IPromocodeForm>>('/api/private/admin/promocode/destroy', {
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
