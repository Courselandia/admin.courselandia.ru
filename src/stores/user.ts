import { defineStore } from 'pinia';

import axios from '@/helpers/axios';
import toQuery from '@/helpers/toQuery';
import IUser from '@/interfaces/modules/user/user';
import IUserForm from '@/interfaces/modules/user/userForm';
import IFilters from '@/interfaces/molecules/table/filters';
import ISorts from '@/interfaces/molecules/table/sorts';
import { IResponseItem, IResponseItems } from '@/interfaces/response';
import access from '@/stores/access';
import TId from '@/types/id';

export default defineStore('user', {
  state: () => ({
    items: null as IUser[] | null,
    item: null as IUser | null,
    total: null as number | null,
  }),
  actions: {
    async get(id: TId): Promise<IResponseItem<IUser>> {
      try {
        const response = await axios.get<IResponseItem<IUser>>(`/api/private/admin/user/get/${id}`, {
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
    ): Promise<IResponseItems<IUser>> {
      try {
        const query = toQuery(offset, limit, sorts, filters);
        const response = await axios.get<IResponseItems<IUser>>(`/api/private/admin/user/read?${query}`, {
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
    async create(data: IUserForm): Promise<IResponseItem<IUser>> {
      const formData = new FormData();
      formData.append('login', data.login || '');
      formData.append('password', data.password || '');
      formData.append('first_name', data.first_name || '');
      formData.append('second_name', data.second_name || '');
      formData.append('phone', data.phone || '');
      formData.append('two_factor', data.two_factor ? '1' : '0');
      formData.append('verified', data.verified ? '1' : '0');
      formData.append('invitation', data.invitation ? '1' : '0');
      formData.append('status', data.status ? '1' : '0');
      formData.append('role', data.role ? String(data.role) : '');
      formData.append('image', data.image || '');

      const response = await axios.post<IResponseItem<IUser>>('/api/private/admin/user/create', formData, {
        headers: {
          Authorization: access().accessToken || '',
        },
      });

      return response.data;
    },
    async update(data: IUserForm): Promise<IResponseItem<IUser>> {
      const response = await axios.put<IResponseItem<IUser>>(`/api/private/admin/user/update/${data.id}`, data, {
        headers: {
          Authorization: access().accessToken || '',
        },
      });

      return response.data;
    },
    async status(id: TId, status: boolean): Promise<IResponseItem<IUserForm>> {
      const response = await axios.put<IResponseItem<IUserForm>>(`/api/private/admin/user/update/status/${id}`, {
        status,
      }, {
        headers: {
          Authorization: access().accessToken || '',
        },
      });

      return response.data;
    },
    async destroy(ids: Array<TId>): Promise<IResponseItem<IUserForm>> {
      const response = await axios.delete<IResponseItem<IUserForm>>('/api/private/admin/user/destroy', {
        params: {
          ids,
        },
        headers: {
          Authorization: access().accessToken || '',
        },
      });

      return response.data;
    },
    async password(id: TId, password: string): Promise<IResponseItem<IUser>> {
      const response = await axios.put<IResponseItem<IUser>>(`/api/private/admin/user/password/${id}`, {
        password,
      }, {
        headers: {
          Authorization: access().accessToken || '',
        },
      });

      return response.data;
    },
    async imageUpdate(id: TId, file: File): Promise<IResponseItem<IUser>> {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('_method', 'put');

      const response = await axios.post<IResponseItem<IUser>>(`/api/private/admin/user/image/update/${id}`, formData, {
        headers: {
          Authorization: access().accessToken || '',
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    },
    async imageDestroy(id: TId): Promise<IResponseItem<IUser>> {
      const response = await axios.delete<IResponseItem<IUser>>(`/api/private/admin/user/image/destroy/${id}`, {
        headers: {
          Authorization: access().accessToken || '',
        },
      });

      return response.data;
    },
  },
});
