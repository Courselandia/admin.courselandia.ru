import { defineStore } from 'pinia';

import ECourseSort from '@/enums/modules/collection/courseSort';
import axios from '@/helpers/axios';
import toQuery from '@/helpers/toQuery';
import ICollection from '@/interfaces/modules/collection/collection';
import ICollectionForm from '@/interfaces/modules/collection/collectionForm';
import ICount from '@/interfaces/modules/collection/count';
import IFilterForm from '@/interfaces/modules/collection/filters';
import IFilters from '@/interfaces/molecules/table/filters';
import ISorts from '@/interfaces/molecules/table/sorts';
import { IResponseItem, IResponseItems } from '@/interfaces/response';
import access from '@/stores/access';
import TId from '@/types/id';

export default defineStore('collection', {
  state: () => ({
    items: null as ICollection[] | null,
    item: null as ICollection | null,
    total: null as number | null,
  }),
  actions: {
    async get(id: TId): Promise<IResponseItem<ICollection>> {
      try {
        const response = await axios.get<IResponseItem<ICollection>>(`/api/private/admin/collection/get/${id}`, {
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
    ): Promise<IResponseItems<ICollection>> {
      try {
        const query = toQuery(offset, limit, sorts, filters);
        const response = await axios.get<IResponseItems<ICollection>>(`/api/private/admin/collection/read?${query}`, {
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
    async create(data: ICollectionForm): Promise<IResponseItem<ICollection>> {
      const formData = new FormData();
      formData.append('direction_id', String(data.direction_id?.value) || '');
      formData.append('name', data.name || '');
      formData.append('link', data.link || '');
      formData.append('text', data.text || '');
      formData.append('additional', data.additional || '');
      formData.append('amount', String(data.amount));
      formData.append('title', data.title || '');
      formData.append('description', data.description || '');
      formData.append('keywords', data.keywords || '');
      formData.append('status', data.status ? '1' : '0');
      formData.append('image', data.image || '');

      if (data.sort[0]) {
        if (data.sort[0].value === ECourseSort.ALPHABETIC) {
          formData.append('sort_field', 'name');
          formData.append('sort_direction', 'ASC');
        } else if (data.sort[0].value === ECourseSort.DATE) {
          formData.append('sort_field', 'id');
          formData.append('sort_direction', 'DESC');
        } else if (data.sort[0].value === ECourseSort.RATING) {
          formData.append('sort_field', 'rating');
          formData.append('sort_direction', 'DESC');
        } else if (data.sort[0].value === ECourseSort.PRICE_ASC) {
          formData.append('sort_field', 'price');
          formData.append('sort_direction', 'ASC');
        } else if (data.sort[0].value === ECourseSort.PRICE_DESC) {
          formData.append('sort_field', 'price');
          formData.append('sort_direction', 'desc');
        }
      }

      const filters: Array<{name: string, value: string}> = this.getFilters(data.filters);
      formData.append('filters', JSON.stringify(filters));

      const response = await axios.post<IResponseItem<ICollection>>('/api/private/admin/collection/create', formData, {
        headers: {
          Authorization: access().accessToken || '',
        },
      });

      return response.data;
    },
    async update(data: ICollectionForm): Promise<IResponseItem<ICollection>> {
      const response = await axios.put<IResponseItem<ICollection>>(`/api/private/admin/collection/update/${data.id}`, data, {
        headers: {
          Authorization: access().accessToken || '',
        },
      });

      return response.data;
    },
    async status(id: TId, status: boolean): Promise<IResponseItem<ICollectionForm>> {
      const response = await axios.put<IResponseItem<ICollectionForm>>(`/api/private/admin/collection/update/status/${id}`, {
        status,
      }, {
        headers: {
          Authorization: access().accessToken || '',
        },
      });

      return response.data;
    },
    async destroy(ids: Array<TId>): Promise<IResponseItem<ICollectionForm>> {
      const response = await axios.delete<IResponseItem<ICollectionForm>>('/api/private/admin/collection/destroy', {
        params: {
          ids,
        },
        headers: {
          Authorization: access().accessToken || '',
        },
      });

      return response.data;
    },
    async imageUpdate(id: TId, file: File): Promise<IResponseItem<ICollection>> {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('_method', 'put');

      const response = await axios.post<IResponseItem<ICollection>>(`/api/private/admin/collection/update/image/${id}`, formData, {
        headers: {
          Authorization: access().accessToken || '',
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    },
    async imageDestroy(id: TId): Promise<IResponseItem<ICollection>> {
      const response = await axios.delete<IResponseItem<ICollection>>(`/api/private/admin/collection/destroy/image/${id}`, {
        headers: {
          Authorization: access().accessToken || '',
        },
      });

      return response.data;
    },
    async count(filters: IFilterForm): Promise<IResponseItem<ICount>> {
      const response = await axios.get<IResponseItem<ICount>>('/api/private/admin/collection/count', {
        params: {
          filters: this.getFilters(filters),
        },
        headers: {
          Authorization: access().accessToken || '',
        },
      });

      return response.data;
    },
    getFilters(filters: IFilterForm): Array<{name: string, value: string}> {
      const result: Array<{name: string, value: string}> = [];

      Object.keys(filters).forEach((key) => {
        const item = filters[key];

        if ((key === 'credit' || key === 'free') && !item) {
          return;
        }

        if (Array.isArray(item)) {
          const value: Array<string | number> = [];

          Object.values(item || []).forEach((itmInside) => {
            if (typeof itmInside === 'string' || typeof itmInside === 'number') {
              value[value.length] = itmInside;
            } else {
              value[value.length] = itmInside.value;
            }
          });

          if ((key === 'online' || key === 'rating') && value[0] !== undefined) {
            result[result.length] = {
              name: key,
              value: JSON.stringify(value[0]),
            };
          } else if (key === 'price') {
            if (value[0] !== 0 || value[1] !== 1000000) {
              result[result.length] = {
                name: key,
                value: JSON.stringify(value),
              };
            }
          } else if (key === 'duration') {
            if (value[0] !== 0 || value[1] !== 50) {
              result[result.length] = {
                name: key,
                value: JSON.stringify(value),
              };
            }
          } else if (value.length) {
            result[result.length] = {
              name: key,
              value: JSON.stringify(value),
            };
          }
        } else if (typeof item === 'string' || typeof item === 'number') {
          result[result.length] = {
            name: key,
            value: JSON.stringify(item),
          };
        } else if (key === 'credit' || key === 'free') {
          result[result.length] = {
            name: key,
            value: '1',
          };
        } else if (item) {
          result[result.length] = {
            name: key,
            value: JSON.stringify(item.value),
          };
        }
      });

      return result;
    },
  },
});
