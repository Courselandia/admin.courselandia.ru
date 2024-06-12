<template>
  <Card :bordered="false">
    <template #title>
      <Lang value="crawl.name" />
    </template>

    <template #extra>
      <Space>
        <Button
          type="primary"
          :loading="loadingPlan"
          @click="onClickPlan"
        >
          <template #icon>
            <PlusOutlined />
          </template>
          <span>
            <Lang value="crawl.plan" />
          </span>
        </Button>
        <Button
          :title="lang('dashboard.reload') || ''"
          :disabled="loading"
          shape="circle"
          @click="onClickReload"
        >
          <template #icon>
            <ReloadOutlined />
          </template>
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
      row-key="id"
      class="table--responsive"
      sticky
      @change="onChange"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'page-path'">
          {{ record.page.path }}
        </template>
        <template v-if="column.key === 'page-lastmod'">
          {{ record.page.lastmod
            ? dayjs.utc(record.page.lastmod).tz(dayjs.tz.guess()).format('D MMMM YYYY, HH:mm:ss')
            : '' }}
        </template>
        <template v-if="column.key === 'pushed_at'">
          {{ record.pushed_at
            ? dayjs.utc(record.pushed_at).tz(dayjs.tz.guess()).format('D MMMM YYYY, HH:mm:ss')
            : '' }}
        </template>
        <template v-if="column.key === 'engine'">
          <template
            v-if="record.engine === EEngine.YANDEX"
          >
            {{ lang('crawl.yandex') }}
          </template>
          <template
            v-else-if="record.engine === EEngine.GOOGLE"
          >
            {{ lang('crawl.google') }}
          </template>
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
  ExclamationCircleOutlined,
  MehOutlined,
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
} from '@ant-design/icons-vue';
import type { TableProps } from 'ant-design-vue';
import Button from 'ant-design-vue/lib/button';
import Card from 'ant-design-vue/lib/card';
import Modal from 'ant-design-vue/lib/modal';
import notification from 'ant-design-vue/lib/notification';
import Space from 'ant-design-vue/lib/space';
import Table from 'ant-design-vue/lib/table';
import {
  FilterValue,
  SorterResult,
  TablePaginationConfig,
} from 'ant-design-vue/lib/table/interface';
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
import EEngine from '@/enums/modules/crawl/engine';
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
import ICrawl from '@/interfaces/modules/crawl/crawl';
import ITableColumnType from '@/interfaces/molecules/table/tableColumnType';
import crawl from '@/stores/crawl';

const {
  read,
  plan,
} = crawl();
const {
  items,
  total,
} = storeToRefs(crawl());
const router = useRouter();
const route = useRoute();
const filteredInfo = ref<Record<string, FilterValue | null>>();
const sortedInfo = ref<SorterResult | SorterResult[] | null>();

const columns = computed<ITableColumnType<ICrawl>[]>(() => [
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
    title: lang('crawl.path'),
    dataIndex: 'page-path',
    key: 'page-path',
    sorter: {
      multiple: 1,
    },
    customFilterDropdown: true,
    sortOrder: stateColumnSort('page-path', sortedInfo.value),
    filteredValue: stateColumnFilter('page-path', filteredInfo.value, 'string'),
  },
  {
    title: lang('crawl.lastmod'),
    dataIndex: 'page-lastmod',
    key: 'page-lastmod',
    sorter: {
      multiple: 1,
    },
    sortOrder: stateColumnSort('page-lastmod', sortedInfo.value),
    customFilterDropdown: true,
    filterType: 'dateRange',
    filteredValue: stateColumnFilter('page-lastmod', filteredInfo.value, 'dateRange'),
    width: 280,
  },
  {
    title: lang('crawl.engine'),
    dataIndex: 'engine',
    key: 'engine',
    sorter: {
      multiple: 1,
    },
    sortOrder: stateColumnSort('engine', sortedInfo.value),
    filteredValue: stateColumnFilter('engine', filteredInfo.value, 'string'),
    filterMultiple: false,
    filters: [
      {
        text: lang('crawl.yandex'),
        value: EEngine.YANDEX,
      },
      {
        text: lang('crawl.google'),
        value: EEngine.GOOGLE,
      },
    ],
    width: 280,
  },
  {
    title: lang('crawl.pushedAt'),
    dataIndex: 'pushed_at',
    key: 'pushed_at',
    sorter: {
      multiple: 1,
    },
    sortOrder: stateColumnSort('pushed_at', sortedInfo.value),
    customFilterDropdown: true,
    filterType: 'dateRange',
    filteredValue: stateColumnFilter('pushed_at', filteredInfo.value, 'dateRange'),
    width: 280,
  },
]);
filteredInfo.value = stateFilters<ICrawl>(columns.value);
const loading = ref(false);
const loadingPlan = ref(false);
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
const selected = ref<Array<ICrawl>>();
const destroySelectedDisabled = ref(true);

const defaultSorts: Array<SorterResult> = [
  {
    columnKey: 'page-path',
    order: 'ascend',
  },
];
sortedInfo.value = stateSorts<ICrawl>(columns.value, defaultSorts);

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
  const currentRoute = router.getRoutes().find((item) => item.name === 'Crawls');

  if (route.path === currentRoute?.path) {
    const pageSize = stateLimit() || pageSizeDefault;
    const current = statePage() || pageCurrentDefault;
    const offset = (current - 1) * pageSize;

    pagination.value.current = current;
    pagination.value.pageSize = pageSize;
    sortedInfo.value = stateSorts<ICrawl>(columns.value);
    filteredInfo.value = stateFilters<ICrawl>(columns.value);

    load(offset, pageSize, sortedInfo.value, filteredInfo.value);
  }
});

watch(selected, () => {
  destroySelectedDisabled.value = selected.value?.length === 0;
});

const onChange: TableProps<ICrawl>['onChange'] = async (pag, filter, sorter): Promise<void> => {
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

const onTagsChange = (): void => {
  reloadToFirstPagination();
};

const onClickPlan = (): void => {
  Modal.confirm({
    title: lang('dashboard.alert'),
    icon: createVNode(ExclamationCircleOutlined),
    content: lang('crawl.askPlanMessage'),
    async onOk() {
      loadingPlan.value = true;
      await plan();
      await reloadToFirstPagination();
      loadingPlan.value = false;
    },
  });
};

const reload = async (): Promise<void> => {
  const pageSize = pagination.value.pageSize || pageSizeDefault;
  const current = statePage() || pageCurrentDefault;
  const offset = (current - 1) * pageSize;

  stateSet(offset, pageSize, sortedInfo.value, filteredInfo.value);
  await load(offset, pageSize, sortedInfo.value, filteredInfo.value);

  pagination.value.total = total.value || 0;
};

const onClickReload = (): void => {
  reload();
};
</script>

<style lang="scss">
@import '@/assets/components/molecules/table.scss';
</style>
