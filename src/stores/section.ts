import { defineStore } from 'pinia';

import axios from '@/helpers/axios';
import toQuery from '@/helpers/toQuery';
import ISection from '@/interfaces/modules/section/section';
import ISectionForm from '@/interfaces/modules/section/sectionForm';
import IFilters from '@/interfaces/molecules/table/filters';
import ISorts from '@/interfaces/molecules/table/sorts';
import { IResponseItem, IResponseItems } from '@/interfaces/response';
import access from '@/stores/access';
import TId from '@/types/id';

export default defineStore('section', {
  state: () => ({
    items: null as ISection[] | null,
    item: null as ISection | null,
    total: null as number | null,
  }),
  actions: {
    async get(id: TId): Promise<IResponseItem<ISection>> {
      try {
        const response = await axios.get<IResponseItem<ISection>>(`/api/private/admin/section/get/${id}`, {
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
    ): Promise<IResponseItems<ISection>> {
      try {
        const query = toQuery(offset, limit, sorts, filters);
        const response = await axios.get<IResponseItems<ISection>>(`/api/private/admin/section/read?${query}`, {
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
    async create(data: ISectionForm): Promise<IResponseItem<ISection>> {
      const dataSend = {
        ...data,
        items: [] as any,
      };

      if (data.item_id_0 && data.item_type_0) {
        dataSend.items[0] = {
          id: data.item_id_0,
          type: data.item_type_0,
        };
      }

      if (data.item_id_1 && data.item_type_1) {
        dataSend.items[1] = {
          id: data.item_id_1,
          type: data.item_type_1,
        };
      }

      const response = await axios.post<IResponseItem<ISection>>('/api/private/admin/section/create', dataSend, {
        headers: {
          Authorization: access().accessToken || '',
        },
      });

      return response.data;
    },
    async update(data: ISectionForm): Promise<IResponseItem<ISection>> {
      const dataSend = {
        ...data,
        items: [] as any,
      };

      if (data.item_id_0 && data.item_type_0) {
        dataSend.items[0] = {
          id: data.item_id_0,
          type: data.item_type_0,
        };
      }

      if (data.item_id_1 && data.item_type_1) {
        dataSend.items[1] = {
          id: data.item_id_1,
          type: data.item_type_1,
        };
      }

      const response = await axios.put<IResponseItem<ISection>>(`/api/private/admin/section/update/${data.id}`, dataSend, {
        headers: {
          Authorization: access().accessToken || '',
        },
      });

      return response.data;
    },
    async status(id: TId, status: boolean): Promise<IResponseItem<ISectionForm>> {
      const response = await axios.put<IResponseItem<ISectionForm>>(`/api/private/admin/section/update/status/${id}`, {
        status,
      }, {
        headers: {
          Authorization: access().accessToken || '',
        },
      });

      return response.data;
    },
    async destroy(ids: Array<TId>): Promise<IResponseItem<ISectionForm>> {
      const response = await axios.delete<IResponseItem<ISectionForm>>('/api/private/admin/section/destroy', {
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
