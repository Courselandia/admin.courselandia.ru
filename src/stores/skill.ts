import { defineStore } from 'pinia';

import axios from '@/helpers/axios';
import toQuery from '@/helpers/toQuery';
import ISkill from '@/interfaces/modules/skill/skill';
import ISkillForm from '@/interfaces/modules/skill/skillForm';
import IFilters from '@/interfaces/molecules/table/filters';
import ISorts from '@/interfaces/molecules/table/sorts';
import { IResponseItem, IResponseItems } from '@/interfaces/response';
import access from '@/stores/access';
import TId from '@/types/id';

export default defineStore('skill', {
  state: () => ({
    items: null as ISkill[] | null,
    item: null as ISkill | null,
    total: null as number | null,
  }),
  actions: {
    async get(id: TId): Promise<IResponseItem<ISkill>> {
      try {
        const response = await axios.get<IResponseItem<ISkill>>(`/api/private/admin/skill/get/${id}`, {
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
    ): Promise<IResponseItems<ISkill>> {
      try {
        const query = toQuery(offset, limit, sorts, filters);
        const response = await axios.get<IResponseItems<ISkill>>(`/api/private/admin/skill/read?${query}`, {
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
    async create(data: ISkillForm): Promise<IResponseItem<ISkill>> {
      const response = await axios.post<IResponseItem<ISkill>>('/api/private/admin/skill/create', data, {
        headers: {
          Authorization: access().accessToken || '',
        },
      });

      return response.data;
    },
    async update(data: ISkillForm): Promise<IResponseItem<ISkill>> {
      const response = await axios.put<IResponseItem<ISkill>>(`/api/private/admin/skill/update/${data.id}`, data, {
        headers: {
          Authorization: access().accessToken || '',
        },
      });

      return response.data;
    },
    async status(id: TId, status: boolean): Promise<IResponseItem<ISkillForm>> {
      const response = await axios.put<IResponseItem<ISkillForm>>(`/api/private/admin/skill/update/status/${id}`, {
        status,
      }, {
        headers: {
          Authorization: access().accessToken || '',
        },
      });

      return response.data;
    },
    async destroy(ids: Array<TId>): Promise<IResponseItem<ISkillForm>> {
      const response = await axios.delete<IResponseItem<ISkillForm>>('/api/private/admin/skill/destroy', {
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
