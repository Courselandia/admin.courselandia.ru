<template>
  <Card :bordered="false">
    <template #title>
      <Lang value="task.name" />
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
        <template v-if="column.key === 'user-id'">
          <router-link
            v-if="record?.user?.id && hasRole([ERole.ADMIN])"
            :to="`/dashboard/users/${record.user?.id}`"
          >
            {{ record?.user?.login }}
          </router-link>
          <template
            v-else-if="record?.user?.login"
          >
            {{ record?.user?.login }}
          </template>
        </template>
        <template v-if="column.key === 'status'">
          <template v-if="record.status === EStatus.WAITING">
            <Tag color="cyan">
              {{ lang('task.waiting') }}
            </Tag>
          </template>
          <template v-else-if="record.status === EStatus.PROCESSING">
            <Tag color="orange">
              {{ lang('task.processing') }}
            </Tag>
          </template>
          <template v-else-if="record.status === EStatus.FINISHED">
            <Tag color="green">
              {{ lang('task.finished') }}
            </Tag>
          </template>
          <template v-else-if="record.status === EStatus.FAILED">
            <Tag color="red">
              {{ lang('task.failed') }}
            </Tag>
          </template>
        </template>
        <template v-if="column.key === 'created_at'">
          {{ record.created_at
            ? dayjs.utc(record.created_at).tz(dayjs.tz.guess()).format('D MMMM YYYY, HH:mm:ss')
            : '' }}
        </template>
        <template v-if="column.key === 'launched_at'">
          {{ record.launched_at
            ? dayjs.utc(record.launched_at).tz(dayjs.tz.guess()).format('D MMMM YYYY, HH:mm:ss')
            : '' }}
        </template>
        <template v-if="column.key === 'finished_at'">
          {{ record.finished_at
            ? dayjs.utc(record.finished_at).tz(dayjs.tz.guess()).format('D MMMM YYYY, HH:mm:ss')
            : '' }}
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
            width: '50px',
            height: '50px',
          }"
        />
      </template>
    </Table>
  </Card>
</template>

<script lang="ts" setup>
import {
  MehOutlined,
  SearchOutlined,
} from '@ant-design/icons-vue';
import type { TableProps } from 'ant-design-vue';
import { Key } from 'ant-design-vue/lib/_util/type';
import Card from 'ant-design-vue/lib/card';
import notification from 'ant-design-vue/lib/notification';
import Table from 'ant-design-vue/lib/table';
import {
  ColumnFilterItem,
  FilterValue,
  SorterResult,
  TablePaginationConfig,
  TableRowSelection,
} from 'ant-design-vue/lib/table/interface';
import Tag from 'ant-design-vue/lib/tag';
import dayjs from 'dayjs';
import { storeToRefs } from 'pinia';
import {
  computed,
  h,
  onMounted,
  ref,
  watch,
} from 'vue';
import {
  useRoute,
  useRouter,
} from 'vue-router';

import Lang from '@/components/atoms/Lang.vue';
import TableColumnFilter from '@/components/molecules/TableColumnFilter.vue';
import TableTagsFilter from '@/components/molecules/TableTagsFilter.vue';
import EStatus from '@/enums/modules/task/status';
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
import ITask from '@/interfaces/modules/task/task';
import ISorts from '@/interfaces/molecules/table/sorts';
import ITableColumnType from '@/interfaces/molecules/table/tableColumnType';
import access from '@/stores/access';
import task from '@/stores/task';
import user from '@/stores/user';
import TId from '@/types/id';

const {
  read,
} = task();
const {
  items,
  total,
} = storeToRefs(task());
const router = useRouter();
const route = useRoute();
const filteredInfo = ref<Record<string, FilterValue | null>>();
const sortedInfo = ref<SorterResult | SorterResult[] | null>();

const readUsers = user().read;
const userData = storeToRefs(user());
const userItems = userData.items;
const { role } = storeToRefs(access());

const getUsersFilter = (): Array<ColumnFilterItem> => {
  const result: Array<ColumnFilterItem> = [];

  userItems.value?.forEach((item) => {
    result[result.length] = {
      text: item.login,
      value: item.id,
    };
  });

  return result;
};

const columns = computed<ITableColumnType<ITask>[]>(() => [
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
    title: lang('task.nameField'),
    dataIndex: 'name',
    key: 'name',
    sorter: {
      multiple: 1,
    },
    customFilterDropdown: true,
    sortOrder: stateColumnSort('name', sortedInfo.value),
    filteredValue: stateColumnFilter('name', filteredInfo.value, 'string'),
  },
  {
    title: lang('task.user'),
    dataIndex: 'user-id',
    key: 'user-id',
    sorter: {
      multiple: 1,
    },
    customFilterDropdown: true,
    sortOrder: stateColumnSort('user-login', sortedInfo.value),
    filteredValue: stateColumnFilter('user-id', filteredInfo.value, 'number'),
    filterType: 'select',
    filters: getUsersFilter(),
  },
  {
    title: lang('task.createdAt'),
    dataIndex: 'created_at',
    key: 'created_at',
    sorter: {
      multiple: 1,
    },
    sortOrder: stateColumnSort('created_at', sortedInfo.value),
    customFilterDropdown: true,
    filterType: 'dateRange',
    filteredValue: stateColumnFilter('created_at', filteredInfo.value, 'dateRange'),
    width: 200,
  },
  {
    title: lang('task.launchedAt'),
    dataIndex: 'launched_at',
    key: 'launched_at',
    sorter: {
      multiple: 1,
    },
    sortOrder: stateColumnSort('launched_at', sortedInfo.value),
    customFilterDropdown: true,
    filterType: 'dateRange',
    filteredValue: stateColumnFilter('launched_at', filteredInfo.value, 'dateRange'),
    width: 200,
  },
  {
    title: lang('task.finishedAt'),
    dataIndex: 'finished_at',
    key: 'finished_at',
    sorter: {
      multiple: 1,
    },
    sortOrder: stateColumnSort('finished_at', sortedInfo.value),
    customFilterDropdown: true,
    filterType: 'dateRange',
    filteredValue: stateColumnFilter('finished_at', filteredInfo.value, 'dateRange'),
    width: 200,
  },
  {
    title: lang('task.reason'),
    dataIndex: 'reason',
    key: 'reason',
    sorter: {
      multiple: 1,
    },
    customFilterDropdown: true,
    sortOrder: stateColumnSort('reason', sortedInfo.value),
    filteredValue: stateColumnFilter('reason', filteredInfo.value, 'string'),
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
        text: lang('task.waiting'),
        value: EStatus.WAITING,
      },
      {
        text: lang('task.processing'),
        value: EStatus.PROCESSING,
      },
      {
        text: lang('task.finished'),
        value: EStatus.FINISHED,
      },
      {
        text: lang('task.failed'),
        value: EStatus.FAILED,
      },
    ],
    width: 200,
  },
]);
filteredInfo.value = stateFilters<ITask>(columns.value);
const loading = ref(false);
const pageSizeDefault = stateLimit() || 20;
const pageCurrentDefault = statePage() || 1;
const pagination = ref<TablePaginationConfig>({
  total: total.value ?? 0,
  current: pageCurrentDefault,
  pageSize: pageSizeDefault,
  showTotal: (pagTotal: Number): string => `Всего ${pagTotal} записей`,
  position: ['topLeft', 'bottomLeft'],
  showSizeChanger: true,
});
const destroysLoading = ref<Record<TId, boolean>>({});
const selected = ref<Array<ITask>>();
const destroySelectedDisabled = ref(true);
const destroySelectedLoading = ref(false);

const rowSelection: TableProps['rowSelection'] = {
  onChange: (selectedRowKeys: Key[], selectedRows: ITask[]): void => {
    selected.value = selectedRows;
  },
};

const defaultSorts: Array<SorterResult> = [
  {
    columnKey: 'created_at',
    order: 'descend',
  },
];
sortedInfo.value = stateSorts<ITask>(columns.value, defaultSorts);

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

const loadUsers = async () => {
  try {
    await readUsers(null, null, { login: 'ASC' } as ISorts);
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
};

onMounted(async (): Promise<void> => {
  await load(
    (pageCurrentDefault - 1) * pageSizeDefault,
    pageSizeDefault,
    sortedInfo.value,
    filteredInfo.value,
  );

  pagination.value.total = total.value || 0;

  await loadUsers();
});

watch(route, (): void => {
  const currentRoute = router.getRoutes().find((item) => item.name === 'Tasks');

  if (route.path === currentRoute?.path) {
    const pageSize = stateLimit() || pageSizeDefault;
    const current = statePage() || pageCurrentDefault;
    const offset = (current - 1) * pageSize;

    pagination.value.current = current;
    pagination.value.pageSize = pageSize;
    sortedInfo.value = stateSorts<ITask>(columns.value);
    filteredInfo.value = stateFilters<ITask>(columns.value);

    load(offset, pageSize, sortedInfo.value, filteredInfo.value);

    pagination.value.total = total.value || 0;
  }
});

watch(selected, () => {
  destroySelectedDisabled.value = selected.value?.length === 0;
});

const onChange: TableProps<ITask>['onChange'] = async (pag, filter, sorter): Promise<void> => {
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

const onTagsChange = (): void => {
  reloadToFirstPagination();
};

const hasRole = (roles: Array<ERole>) => {
  if (role?.value) {
    return roles.indexOf(role?.value) !== -1;
  }

  return false;
};

window.setInterval(async () => {
  await reload();
}, 10000);
</script>

<style lang="scss">
@import '@/assets/components/molecules/table.scss';
</style>
