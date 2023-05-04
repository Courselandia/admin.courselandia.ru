<template>
  <Card :bordered="false">
    <template #title>
      <Lang value="log.name" />
    </template>

    <template #extra>
      <Space>
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
      @change="onChange"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'actions'">
          <Space>
            <Button
              :title="lang('log.showLog')"
              type="primary"
              shape="circle"
              @click="onClickShow(record.id)"
            >
              <template #icon>
                <EditOutlined />
              </template>
            </Button>
            <Button
              :title="lang('dashboard.destroy')"
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
        <template v-if="column.key === 'level_name'">
          <Tag
            v-if="record.level_name === 'INFO'"
            color="green"
          >
            <template #icon>
              <CheckOutlined />
            </template>
            <Lang value="log.info" />
          </Tag>
          <Tag
            v-else-if="record.level_name === 'ALERT'"
            color="yellow"
          >
            <template #icon>
              <ExclamationOutlined />
            </template>
            <Lang value="log.alert" />
          </Tag>
          <Tag
            v-else-if="record.level_name === 'CRITICAL'"
            color="orange"
          >
            <template #icon>
              <AlertOutlined />
            </template>
            <Lang value="log.critical" />
          </Tag>
          <Tag
            v-else-if="record.level_name === 'DEBUG'"
            color="cyan"
          >
            <template #icon>
              <ApiOutlined />
            </template>
            <Lang value="log.debug" />
          </Tag>
          <Tag
            v-else-if="record.level_name === 'ERROR'"
            color="red"
          >
            <template #icon>
              <BugOutlined />
            </template>
            <Lang value="log.error" />
          </Tag>
          <Tag
            v-else-if="record.level_name === 'NOTICE'"
            color="cyan"
          >
            <template #icon>
              <QuestionCircleOutlined />
            </template>
            <Lang value="log.notice" />
          </Tag>
          <Tag
            v-else-if="record.level === 'WARNING'"
            color="purple"
          >
            <template #icon>
              <WarningOutlined />
            </template>
            <Lang value="log.warning" />
          </Tag>
        </template>
        <template v-if="column.key === 'created_at'">
          {{ dayjs(record.created_at).format('D MMMM YYYY, HH:mm:ss') }}
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
            fontSize: filtered ? '18px' : '14px'
          }"
          width="50"
          height="50"
        />
      </template>
    </Table>
  </Card>
</template>

<script lang="ts" setup>
import {
  AlertOutlined,
  ApiOutlined,
  BugOutlined,
  CheckOutlined,
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  ExclamationOutlined,
  MehOutlined,
  QuestionCircleOutlined,
  SearchOutlined,
  WarningOutlined,
} from '@ant-design/icons-vue';
import type { TableProps } from 'ant-design-vue';
import { Key } from 'ant-design-vue/lib/_util/type';
import Button from 'ant-design-vue/lib/button';
import Card from 'ant-design-vue/lib/card';
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
import ILog from '@/interfaces/modules/log/log';
import ITableColumnType from '@/interfaces/molecules/table/tableColumnType';
import log from '@/stores/log';
import TId from '@/types/id';

const {
  read,
  destroy,
} = log();
const {
  items,
  total,
} = storeToRefs(log());
const router = useRouter();
const route = useRoute();
const filteredInfo = ref<Record<string, FilterValue | null> | null>();
const sortedInfo = ref<SorterResult | SorterResult[] | null>();

const columns = computed<ITableColumnType<ILog>[]>(() => [
  {
    title: lang('log.level_name'),
    dataIndex: 'level_name',
    key: 'level_name',
    sorter: {
      multiple: 1,
    },
    sortOrder: stateColumnSort('level_name', sortedInfo.value),
    filteredValue: stateColumnFilter('level_name', filteredInfo.value, 'string'),
    filterMultiple: true,
    filters: [
      {
        text: lang('log.info'),
        value: 'INFO',
      },
      {
        text: lang('log.alert'),
        value: 'ALERT',
      },
      {
        text: lang('log.critical'),
        value: 'CRITICAL',
      },
      {
        text: lang('log.debug'),
        value: 'DEBUG',
      },
      {
        text: lang('log.error'),
        value: 'ERROR',
      },
      {
        text: lang('log.notice'),
        value: 'NOTICE',
      },
      {
        text: lang('log.warning'),
        value: 'WARNING',
      },
    ],
    width: 200,
  },
  {
    title: lang('log.created_at'),
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
    title: lang('log.message'),
    dataIndex: 'message',
    key: 'message',
    sorter: {
      multiple: 1,
    },
    customFilterDropdown: true,
    sortOrder: stateColumnSort('message', sortedInfo.value),
    filteredValue: stateColumnFilter('message', filteredInfo.value, 'string'),
  },
  {
    key: 'actions',
    width: 170,
  },
]);
filteredInfo.value = stateFilters<ILog>(columns.value);
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
const selected = ref<Array<ILog>>();
const destroySelectedDisabled = ref(true);
const destroySelectedLoading = ref(false);

const rowSelection: TableProps['rowSelection'] = {
  onChange: (selectedRowKeys: Key[], selectedRows: ILog[]): void => {
    selected.value = selectedRows;
  },
};

const defaultSorts: Array<SorterResult> = [
  {
    columnKey: 'created_at',
    order: 'descend',
  },
];
sortedInfo.value = stateSorts<ILog>(columns.value, defaultSorts);

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
});

watch(route, (): void => {
  const currentRoute = router.getRoutes().find((item) => item.name === 'Logs');

  if (route.path === currentRoute?.path) {
    const pageSize = stateLimit() || pageSizeDefault;
    const current = statePage() || pageCurrentDefault;
    const offset = (current - 1) * pageSize;

    pagination.value.current = current;
    pagination.value.pageSize = pageSize;
    sortedInfo.value = stateSorts<ILog>(columns.value);
    filteredInfo.value = stateFilters<ILog>(columns.value);

    load(offset, pageSize, sortedInfo.value, filteredInfo.value);
  }
});

watch(selected, () => {
  destroySelectedDisabled.value = selected.value?.length === 0;
});

const onChange: TableProps<ILog>['onChange'] = async (pag, filter, sorter): Promise<void> => {
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
};

const reloadToFirstPagination = async (): Promise<void> => {
  const pageSize = pagination.value.pageSize || pageSizeDefault;
  const offset = 0;
  pagination.value.current = 1;

  stateSet(offset, pageSize, sortedInfo.value, filteredInfo.value);
  await load(offset, pageSize, sortedInfo.value, filteredInfo.value);
};

const reload = async (): Promise<void> => {
  const pageSize = pagination.value.pageSize || pageSizeDefault;
  const current = statePage() || pageCurrentDefault;
  const offset = (current - 1) * pageSize;

  stateSet(offset, pageSize, sortedInfo.value, filteredInfo.value);
  await load(offset, pageSize, sortedInfo.value, filteredInfo.value);
};

const onClickShow = (id: TId): void => {
  router.push({
    name: 'LogShow',
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
</script>

<style lang="scss">
@import '@/assets/components/molecules/table.scss';
</style>
