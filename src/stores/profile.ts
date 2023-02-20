import { defineStore } from 'pinia';

import axios from '@/helpers/axios';
import IUser from '@/interfaces/modules/user/user';
import { IResponseItem } from '@/interfaces/response';
import access from '@/stores/access';

export default defineStore('profile', {
  actions: {
    async update(
      firstName: string,
      secondName: string,
      phone: string,
    ): Promise<IResponseItem<IUser>> {
      const response = await axios.put<IResponseItem<IUser>>('/api/private/admin/user/profile/update', {
        first_name: firstName,
        second_name: secondName,
        phone,
      }, {
        headers: {
          Authorization: access().accessToken || '',
        },
      });

      return response.data;
    },
    async imageUpdate(file: File): Promise<IResponseItem<IUser>> {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('_method', 'put');

      const response = await axios.post<IResponseItem<IUser>>('/api/private/admin/user/profile/image/update', formData, {
        headers: {
          Authorization: access().accessToken || '',
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    },
    async imageDestroy(): Promise<IResponseItem<IUser>> {
      const response = await axios.delete<IResponseItem<IUser>>('/api/private/admin/user/profile/image/destroy', {
        headers: {
          Authorization: access().accessToken || '',
        },
      });

      return response.data;
    },
    async password(password: string): Promise<IResponseItem<IUser>> {
      const response = await axios.put<IResponseItem<IUser>>('/api/private/admin/user/profile/password', {
        password,
      }, {
        headers: {
          Authorization: access().accessToken || '',
        },
      });

      return response.data;
    },
  },
});
