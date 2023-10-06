<template>
  <Card :bordered="false">
    <template #title>
      <Lang value="user.name" />
    </template>

    <template #extra>
      <Space>
        <Button
          type="primary"
          @click="onClickCreate"
        >
          <template #icon>
            <PlusOutlined />
          </template>
          <span>
            <Lang value="dashboard.add" />
          </span>
        </Button>
        <Button
          :disabled="destroySelectedDisabled"
          :loading="destroySelectedLoading"
          danger
          type="primary"
          @click="onClickDestroySelected"
        >
          <template #icon>
            <DeleteOutlined />
          </template>
          <span>
            <Lang value="dashboard.destroy" />
          </span>
        </Button>
      </Space>
    </template>

    <TableTagsFilter
      v-model:filters="filteredInfo"
      :columns="columns"
      class="mb-10"
      @change="onTagsChange"
    />

    <Table
      :columns="columns"
      :data-source="items || undefined"
      :pagination="pagination as TablePaginationConfig"
      :loading="loading"
      :row-selection="rowSelection as TableRowSelection<any>"
      row-key="id"
      class="table--responsive"
      sticky
      @change="onChange"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'actions'">
          <Space>
            <Button
              v-if="record?.image_small_id?.path"
              :title="lang('dashboard.destroyImage') || ''"
              :loading="destroysImageLoading[record.id]"
              shape="circle"
              danger
              @click="onClickDestroyImage(record.id)"
            >
              <template #icon>
                <FileImageOutlined />
              </template>
            </Button>
            <Button
              :title="lang('dashboard.edit') || ''"
              type="primary"
              shape="circle"
              @click="onClickUpdate(record.id)"
            >
              <template #icon>
                <EditOutlined />
              </template>
            </Button>
            <Button
              v-if="record.id !== 1"
              :title="lang('dashboard.destroy') || ''"
              :loading="destroysLoading[record.id]"
              type="primary"
              shape="circle"
              danger
              @click="onClickDestroy(record.id)"
            >
              <template #icon>
                <DeleteOutlined />
              </template>
            </Button>
          </Space>
        </template>
        <template v-if="column.key === 'image_small_id'">
          <Image
            v-if="record?.image_small_id?.path"
            :src="record?.image_small_id?.path"
            :preview="{
              src: record?.image_big_id?.path,
            }"
            placeholder
            :width="90"
          />
        </template>
        <template v-if="column.key === 'status'">
          <template v-if="record.id === 1">
            <Tag
              :color="record.status === true ? 'green' : 'red'"
            >
              <template #icon>
                <template v-if="record.status === true">
                  <CheckOutlined />
                </template>
                <template v-else>
                  <CloseOutlined />
                </template>
              </template>
              {{ record.status === true
                ? lang('dashboard.active')
                : lang('dashboard.deactivated') }}
            </Tag>
          </template>
          <template v-else>
            <Tag
              :color="record.status === true ? 'green' : 'red'"
              class="cursor--pointer"
              @click="onClickStatus(record.id, !record.status)"
            >
              <template #icon>
                <template v-if="record.status === true">
                  <CheckOutlined />
                </template>
                <template v-else>
                  <CloseOutlined />
                </template>
              </template>
              {{ record.status === true
                ? lang('dashboard.active')
                : lang('dashboard.deactivated') }}
            </Tag>
          </template>
        </template>
        <template v-if="column.key === 'role-name'">
          <Tag>
            <template v-if="ERole.ADMIN === record.role?.name">
              <Lang value="dashboard.admin" />
            </template>
            <template v-else-if="ERole.MANAGER === record.role?.name">
              <Lang value="dashboard.manager" />
            </template>
            <template v-else-if="ERole.USER === record.role?.name">
              <Lang value="dashboard.user" />
            </template>
          </Tag>
        </template>
        <template v-if="column.key === 'created_at'">
          {{ dayjs.utc(record.created_at).tz(dayjs.tz.guess()).format('D MMMM YYYY, HH:mm:ss') }}
        </template>
      </template>
      <template
        #customFilterDropdown="{
          setSelectedKeys,
          selectedKeys,
          confirm,
          clearFilters,
          column,
          visible,
        }"
      >
        <TableColumnFilter
          :set-selected-keys="setSelectedKeys"
          :selected-keys="selectedKeys"
          :confirm="confirm"
          :clear-filters="clearFilters"
          :column="column"
          :type="column.filterType"
          :visible="visible"
        />
      </template>
      <template #customFilterIcon="{ filtered }">
        <SearchOutlined
          :style="{
            color: filtered ? '#0c80d7' : undefined,
            fontSize: filtered ? '18px' : '14px',
          }"
        />
      </template>
    </Table>
  </Card>
</template>

<script lang="ts" setup>
import {
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  FileImageOutlined,
  MehOutlined,
  PlusOutlined,
  SearchOutlined,
} from '@ant-design/icons-vue';
import type { TableProps } from 'ant-design-vue';
import { Key } from 'ant-design-vue/lib/_util/type';
import Button from 'ant-design-vue/lib/button';
import Card from 'ant-design-vue/lib/card';
import Image from 'ant-design-vue/lib/image';
import Modal from 'ant-design-vue/lib/modal';
import notification from 'ant-design-vue/lib/notification';
import Space from 'ant-design-vue/lib/space';
import Table from 'ant-design-vue/lib/table';
import {
  FilterValue,
  SorterResult, TablePaginationConfig, TableRowSelection,
} from 'ant-design-vue/lib/table/interface';
import Tag from 'ant-design-vue/lib/tag';
import dayjs from 'dayjs';
import { storeToRefs } from 'pinia';
import {
  computed,
  createVNode,
  h,
  onMounted,
  ref,
  watch,
} from 'vue';
import { useRoute, useRouter } from 'vue-router';

import Lang from '@/components/atoms/Lang.vue';
import TableColumnFilter from '@/components/molecules/TableColumnFilter.vue';
import TableTagsFilter from '@/components/molecules/TableTagsFilter.vue';
import ERole from '@/enums/modules/user/role';
import filters from '@/helpers/filters';
import lang from '@/helpers/lang';
import sorts from '@/helpers/sorts';
import {
  stateColumnFilter,
  stateColumnSort,
  stateFilters,
  stateLimit,
  statePage,
  stateSet,
  stateSorts,
} from '@/helpers/state';
import IUser from '@/interfaces/modules/user/user';
import ITableColumnType from '@/interfaces/molecules/table/tableColumnType';
import user from '@/stores/user';
import TId from '@/types/id';

const {
  read,
  status,
  destroy,
  imageDestroy,
} = user();
const {
  items,
  total,
} = storeToRefs(user());
const router = useRouter();
const route = useRoute();
const filteredInfo = ref<Record<string, FilterValue | null>>();
const sortedInfo = ref<SorterResult | SorterResult[] | null>();

const columns = computed<ITableColumnType<IUser>[]>(() => [
  {
    title: lang('dashboard.id'),
    dataIndex: 'id',
    key: 'id',
    sorter: {
      multiple: 1,
    },
    customFilterDropdown: true,
    sortOrder: stateColumnSort('id', sortedInfo.value),
    filteredValue: stateColumnFilter('id', filteredInfo.value, 'number'),
    filterType: 'number',
    width: 100,
  },
  {
    title: lang('dashboard.image'),
    dataIndex: 'image_small_id',
    key: 'image_small_id',
    sorter: false,
    width: 130,
  },
  {
    title: lang('user.name'),
    dataIndex: 'login',
    key: 'login',
    sorter: {
      multiple: 1,
    },
    customFilterDropdown: true,
    sortOrder: stateColumnSort('login', sortedInfo.value),
    filteredValue: stateColumnFilter('login', filteredInfo.value, 'string'),
  },
  {
    title: lang('user.role'),
    dataIndex: 'role-name',
    key: 'role-name',
    sorter: {
      multiple: 1,
    },
    sortOrder: stateColumnSort('role-name', sortedInfo.value),
    filteredValue: stateColumnFilter('role-name', filteredInfo.value, 'string'),
    filters: [
      {
        text: lang('dashboard.admin'),
        value: ERole.ADMIN,
      },
      {
        text: lang('dashboard.manager'),
        value: ERole.MANAGER,
      },
      {
        text: lang('dashboard.user'),
        value: ERole.USER,
      },
    ],
    width: 250,
  },
  {
    title: lang('user.createdAt'),
    dataIndex: 'created_at',
    key: 'created_at',
    sorter: {
      multiple: 1,
    },
    sortOrder: stateColumnSort('created_at', sortedInfo.value),
    customFilterDropdown: true,
    filterType: 'dateRange',
    filteredValue: stateColumnFilter('created_at', filteredInfo.value, 'dateRange'),
    width: 300,
  },
  {
    title: lang('dashboard.status'),
    dataIndex: 'status',
    key: 'status',
    sorter: {
      multiple: 1,
    },
    sortOrder: stateColumnSort('status', sortedInfo.value),
    filteredValue: stateColumnFilter('status', filteredInfo.value, 'boolean'),
    filterMultiple: false,
    filters: [
      {
        text: lang('dashboard.active'),
        value: true,
      },
      {
        text: lang('dashboard.deactivated'),
        value: false,
      },
    ],
    width: 200,
  },
  {
    key: 'actions',
    width: 150,
  },
]);
filteredInfo.value = stateFilters<IUser>(columns.value);
const loading = ref(false);
const pageSizeDefault = stateLimit() || 20;
const pageCurrentDefault = statePage() || 1;
const pagination = ref({
  total: total ?? 0,
  current: pageCurrentDefault,
  pageSize: pageSizeDefault,
  showTotal: (pagTotal: Number): string => `Всего ${pagTotal} записей`,
  position: ['topLeft', 'bottomLeft'],
  showSizeChanger: true,
});
const destroysLoading = ref<Record<TId, boolean>>({});
const selected = ref<Array<IUser>>();
const destroySelectedDisabled = ref(true);
const destroySelectedLoading = ref(false);
const destroysImageLoading = ref<Record<TId, boolean>>({});

const rowSelection: TableProps['rowSelection'] = {
  onChange: (selectedRowKeys: Key[], selectedRows: IUser[]): void => {
    selected.value = selectedRows;
  },
};

const defaultSorts: Array<SorterResult> = [
  {
    columnKey: 'created_at',
    order: 'descend',
  },
];
sortedInfo.value = stateSorts<IUser>(columns.value, defaultSorts);

const load = async (
  offset: number,
  limit: number,
  sorter?: SorterResult | SorterResult[] | null,
  filter?: Record<string, FilterValue | null> | null,
): Promise<void> => {
  loading.value = true;

  try {
    await read(offset, limit, sorts(sorter), filters(filter));
  } catch (error: Error | any) {
    notification.open({
      icon: () => h(MehOutlined, { style: 'color: #ff0000' }),
      message: lang('dashboard.error'),
      description: error.message,
      style: {
        color: '#ff0000',
      },
    });
  }

  loading.value = false;
};

onMounted(async (): Promise<void> => {
  await load(
    (pageCurrentDefault - 1) * pageSizeDefault,
    pageSizeDefault,
    sortedInfo.value,
    filteredInfo.value,
  );

  pagination.value.total = total.value || 0;
});

watch(route, (): void => {
  const currentRoute = router.getRoutes().find((item) => item.name === 'Users');

  if (route.path === currentRoute?.path) {
    const pageSize = stateLimit() || pageSizeDefault;
    const current = statePage() || pageCurrentDefault;
    const offset = (current - 1) * pageSize;

    pagination.value.current = current;
    pagination.value.pageSize = pageSize;
    sortedInfo.value = stateSorts<IUser>(columns.value);
    filteredInfo.value = stateFilters<IUser>(columns.value);

    load(offset, pageSize, sortedInfo.value, filteredInfo.value);
  }
});

watch(selected, () => {
  const hasAdmin = selected.value?.find((item) => item.id === 1);

  destroySelectedDisabled.value = selected.value?.length === 0 || hasAdmin !== undefined;
});

const onChange: TableProps<IUser>['onChange'] = async (pag, filter, sorter): Promise<void> => {
  filteredInfo.value = {
    ...filteredInfo.value,
    ...filter,
  };
  sortedInfo.value = sorter;
  const pageSize = pag.pageSize || pageSizeDefault;
  const current = pag.current || pageCurrentDefault;
  pagination.value.current = current;
  pagination.value.pageSize = pageSize;
  const offset = (current - 1) * pageSize;

  stateSet(offset, pageSize, sortedInfo.value, filteredInfo.value);
  await load(offset, pageSize, sortedInfo.value, filteredInfo.value);

  pagination.value.total = total.value || 0;
};

const reloadToFirstPagination = async (): Promise<void> => {
  const pageSize = pagination.value.pageSize || pageSizeDefault;
  const offset = 0;
  pagination.value.current = 1;

  stateSet(offset, pageSize, sortedInfo.value, filteredInfo.value);
  await load(offset, pageSize, sortedInfo.value, filteredInfo.value);

  pagination.value.total = total.value || 0;
};

const reload = async (): Promise<void> => {
  const pageSize = pagination.value.pageSize || pageSizeDefault;
  const current = statePage() || pageCurrentDefault;
  const offset = (current - 1) * pageSize;

  stateSet(offset, pageSize, sortedInfo.value, filteredInfo.value);
  await load(offset, pageSize, sortedInfo.value, filteredInfo.value);

  pagination.value.total = total.value || 0;
};

const onClickCreate = (): void => {
  router.push({
    name: 'UserCreate',
  });
};

const onClickUpdate = (id: TId): void => {
  router.push({
    name: 'UserUpdate',
    params: {
      id,
    },
  });
};

const destroyIds = async (ids: Array<TId>): Promise<void> => {
  try {
    await destroy(ids);
    await reload();
  } catch (error: Error | any) {
    notification.open({
      icon: () => h(MehOutlined, { style: 'color: #ff0000' }),
      message: lang('dashboard.error'),
      description: error.response.data.message ? error.response.data.message : error.message,
      style: {
        color: '#ff0000',
      },
    });
  }
};

const onClickDestroy = async (id: TId): Promise<void> => {
  Modal.confirm({
    title: lang('dashboard.alert'),
    icon: createVNode(ExclamationCircleOutlined),
    content: lang('dashboard.askDestroyRecord'),
    async onOk() {
      destroysLoading.value[id] = true;
      await destroyIds([id]);
      destroysLoading.value[id] = false;
    },
  });
};

const onClickDestroySelected = (): void => {
  Modal.confirm({
    title: lang('dashboard.alert'),
    icon: createVNode(ExclamationCircleOutlined),
    content: lang('dashboard.askDestroyRecords'),
    async onOk() {
      const ids = selected.value?.map((select) => select.id);

      if (ids) {
        destroySelectedLoading.value = true;
        await destroyIds(ids);
        destroySelectedLoading.value = false;
        destroySelectedDisabled.value = true;
      }
    },
  });
};

const onTagsChange = (): void => {
  reloadToFirstPagination();
};

const onClickStatus = async (id: TId, active: boolean): Promise<void> => {
  if (id !== 1) {
    Modal.confirm({
      title: lang('dashboard.alert'),
      icon: createVNode(ExclamationCircleOutlined),
      content: lang('dashboard.confirmChangeStatus'),
      async onOk() {
        loading.value = true;

        try {
          await status(id, active);
          await reload();
        } catch (error: Error | any) {
          notification.open({
            icon: () => h(MehOutlined, { style: 'color: #ff0000' }),
            message: lang('dashboard.error'),
            description: error.response.data.message ? error.response.data.message : error.message,
            style: {
              color: '#ff0000',
            },
          });
        }

        loading.value = false;
      },
    });
  } else {
    Modal.error({
      title: lang('dashboard.error'),
      content: lang('user.editStatusNotAllowed'),
    });
  }
};

const onClickDestroyImage = (id: TId) => {
  Modal.confirm({
    title: lang('dashboard.alert'),
    icon: createVNode(ExclamationCircleOutlined),
    content: lang('dashboard.confirmDestroyImage'),
    async onOk() {
      destroysImageLoading.value[id] = true;

      try {
        await imageDestroy(id as TId);
        await reload();
      } catch (error: Error | any) {
        notification.open({
          icon: () => h(MehOutlined, { style: 'color: #ff0000' }),
          message: lang('dashboard.error'),
          description: error.response.data.message ? error.response.data.message : error.message,
          style: {
            color: '#ff0000',
          },
        });
      }

      destroysImageLoading.value[id] = false;
    },
  });
};
</script>

<style lang="scss">
@import '@/assets/components/molecules/table.scss';
</style>
