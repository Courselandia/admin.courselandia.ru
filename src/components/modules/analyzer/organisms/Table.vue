<template>
  <Card :bordered="false">
    <template #title>
      <Lang value="analyzer.name" />
    </template>

    <template #extra>
      <Space>
        <Button
          type="primary"
          @click="onClickAnalyze"
        >
          <template #icon>
            <RobotOutlined />
          </template>
          <span>
            <Lang value="analyzer.analyze" />
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
      class="table--responsive table--vertical-top"
      sticky
      @change="onChange"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'actions'">
          <Space>
            <Button
              v-if="
                record.status === EStatus.READY
                  || record.status === EStatus.FAILED
              "
              :title="lang('analyzer.reanalyze') || ''"
              shape="circle"
              :loading="reanalyzeLoading[record.id]"
              @click="onClickReanalyze(record.id)"
            >
              <template #icon>
                <SendOutlined />
              </template>
            </Button>
          </Space>
        </template>
        <template v-if="column.key === 'analyzerable_id'">
          <router-link
            :to="getLink(record.analyzerable_id, record.category) || ''"
          >
            {{ record.analyzerable_id }}
          </router-link>
        </template>
        <template v-if="column.key === 'category'">
          {{ record.category_name }}
          <template v-if="record.category_label">
            / {{ record.category_label }}
          </template>
        </template>
        <template v-if="column.key === 'text'">
          <div v-html="record.text" />
        </template>
        <template v-if="column.key === 'unique'">
          <Tag
            v-if="record.unique !== null"
            :color="record.unique >= EQuality.UNIQUE ? 'green' : 'red'"
          >
            {{ record.unique }}%
          </Tag>
        </template>
        <template v-if="column.key === 'water'">
          <Tag
            v-if="record.water !== null"
            :color="record.water <= EQuality.WATER ? 'green' : 'red'"
          >
            {{ record.water }}%
          </Tag>
        </template>
        <template v-if="column.key === 'spam'">
          <Tag
            v-if="record.spam !== null"
            :color="record.spam <= EQuality.SPAM ? 'green' : 'red'"
          >
            {{ record.spam }}%
          </Tag>
        </template>
        <template v-if="column.key === 'status'">
          <Tag
            v-if="record.status === EStatus.PENDING"
            color="cyan"
          >
            <Lang value="analyzer.pending" />
          </Tag>
          <Tag
            v-else-if="record.status === EStatus.READY"
            color="green"
          >
            <Lang value="analyzer.ready" />
          </Tag>
          <Tag
            v-else-if="record.status === EStatus.PROCESSING"
            color="orange"
          >
            <Lang value="analyzer.processing" />
          </Tag>
          <Tag
            v-else-if="record.status === EStatus.FAILED"
            color="red"
          >
            <Lang value="analyzer.failed" />
          </Tag>
          <Tag
            v-if="record.status === EStatus.SKIPPED"
            color="blue"
          >
            <Lang value="analyzer.skipped" />
          </Tag>
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
  ExclamationCircleOutlined,
  MehOutlined,
  RobotOutlined,
  SearchOutlined,
  SendOutlined,
  SisternodeOutlined,
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
import EQuality from '@/enums/modules/analyzer/quality';
import EStatus from '@/enums/modules/analyzer/status';
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
import IAnalyzer from '@/interfaces/modules/analyzer/analyzer';
import ITableColumnType from '@/interfaces/molecules/table/tableColumnType';
import analyzer from '@/stores/analyzer';
import TId from '@/types/id';

const {
  read,
  analyze,
} = analyzer();
const {
  items,
  total,
} = storeToRefs(analyzer());
const router = useRouter();
const route = useRoute();
const filteredInfo = ref<Record<string, FilterValue | null>>();
const sortedInfo = ref<SorterResult | SorterResult[] | null>();
const reanalyzeLoading = ref<Record<TId, boolean>>({});

const getLink = (id: TId, category: string): string | null => {
  if (category === 'course.text') {
    return `/dashboard/courses/${id}`;
  }

  if (category === 'skill.text') {
    return `/dashboard/skills/${id}`;
  }

  if (category === 'tool.text') {
    return `/dashboard/tools/${id}`;
  }

  if (category === 'article.text') {
    return `/dashboard/articles/${id}`;
  }

  return null;
};

const columns = computed<ITableColumnType<IAnalyzer>[]>(() => [
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
    title: lang('analyzer.ownId'),
    dataIndex: 'analyzerable_id',
    key: 'analyzerable_id',
    sorter: {
      multiple: 1,
    },
    sortable: false,
    customFilterDropdown: true,
    sortOrder: stateColumnSort('analyzerable_id', sortedInfo.value),
    filteredValue: stateColumnFilter('analyzerable_id', filteredInfo.value, 'number'),
    filterType: 'number',
    width: 150,
  },
  {
    title: lang('analyzer.category'),
    dataIndex: 'category',
    key: 'category',
    sorter: {
      multiple: 1,
    },
    sortable: false,
    sortOrder: stateColumnSort('category', sortedInfo.value),
    filteredValue: stateColumnFilter('category', filteredInfo.value, 'string'),
    width: 150,
    filterMultiple: true,
    filters: [
      {
        text: 'Курс / Описание',
        value: 'course.text',
      },
      {
        text: 'Навык / Описание',
        value: 'skill.text',
      },
      {
        text: 'Инструмент / Описание',
        value: 'tool.text',
      },
      {
        text: 'Статьи / Написанный текст',
        value: 'article.text',
      },
    ],
  },
  {
    title: lang('analyzer.text'),
    dataIndex: 'text',
    key: 'text',
    sorter: {
      multiple: 1,
    },
    sortable: false,
    customFilterDropdown: true,
    sortOrder: stateColumnSort('text', sortedInfo.value),
    filteredValue: stateColumnFilter('text', filteredInfo.value, 'string'),
  },
  {
    title: lang('analyzer.unique'),
    dataIndex: 'unique',
    key: 'unique',
    sorter: {
      multiple: 1,
    },
    sortable: false,
    customFilterDropdown: true,
    sortOrder: stateColumnSort('unique', sortedInfo.value),
    filteredValue: stateColumnFilter('unique', filteredInfo.value, 'number'),
    filterType: 'number',
    width: 170,
  },
  {
    title: lang('analyzer.spam'),
    dataIndex: 'spam',
    key: 'spam',
    sorter: {
      multiple: 1,
    },
    sortable: false,
    customFilterDropdown: true,
    sortOrder: stateColumnSort('spam', sortedInfo.value),
    filteredValue: stateColumnFilter('spam', filteredInfo.value, 'number'),
    filterType: 'number',
    width: 170,
  },
  {
    title: lang('analyzer.water'),
    dataIndex: 'water',
    key: 'water',
    sorter: {
      multiple: 1,
    },
    sortable: false,
    customFilterDropdown: true,
    sortOrder: stateColumnSort('water', sortedInfo.value),
    filteredValue: stateColumnFilter('water', filteredInfo.value, 'number'),
    filterType: 'number',
    width: 170,
  },
  {
    title: lang('dashboard.status'),
    dataIndex: 'status',
    key: 'status',
    sorter: {
      multiple: 1,
    },
    sortOrder: stateColumnSort('status', sortedInfo.value),
    filteredValue: stateColumnFilter('status', filteredInfo.value, 'string'),
    filterMultiple: false,
    filters: [
      {
        text: lang('analyzer.pending'),
        value: EStatus.PENDING,
      },
      {
        text: lang('analyzer.ready'),
        value: EStatus.READY,
      },
      {
        text: lang('analyzer.processing'),
        value: EStatus.PROCESSING,
      },
      {
        text: lang('analyzer.failed'),
        value: EStatus.FAILED,
      },
      {
        text: lang('analyzer.skipped'),
        value: EStatus.SKIPPED,
      },
    ],
    width: 200,
  },
  {
    key: 'actions',
    width: 100,
  },
]);
filteredInfo.value = stateFilters<IAnalyzer>(columns.value);
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
const selected = ref<Array<IAnalyzer>>();
const destroySelectedDisabled = ref(true);
const destroySelectedLoading = ref(false);

const rowSelection: TableProps['rowSelection'] = {
  onChange: (selectedRowKeys: Key[], selectedRows: IAnalyzer[]): void => {
    selected.value = selectedRows;
  },
};

const defaultSorts: Array<SorterResult> = [
  {
    columnKey: 'id',
    order: 'ascend',
  },
];
sortedInfo.value = stateSorts<IAnalyzer>(columns.value, defaultSorts);

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
  const currentRoute = router.getRoutes().find((item) => item.name === 'Analyzers');

  if (route.path === currentRoute?.path) {
    const pageSize = stateLimit() || pageSizeDefault;
    const current = statePage() || pageCurrentDefault;
    const offset = (current - 1) * pageSize;

    pagination.value.current = current;
    pagination.value.pageSize = pageSize;
    sortedInfo.value = stateSorts<IAnalyzer>(columns.value);
    filteredInfo.value = stateFilters<IAnalyzer>(columns.value);

    load(offset, pageSize, sortedInfo.value, filteredInfo.value);
  }
});

watch(selected, () => {
  destroySelectedDisabled.value = selected.value?.length === 0;
});

const onChange: TableProps<IAnalyzer>['onChange'] = async (pag, filter, sorter): Promise<void> => {
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

const onClickUpdate = (id: TId): void => {
  router.push({
    name: 'AnalyzerUpdate',
    params: {
      id,
    },
  });
};

const onClickAnalyze = (): void => {
  router.push({
    name: 'AnalyzerAnalyze',
  });
};

const onClickReanalyze = (id: TId): void => {
  Modal.confirm({
    title: lang('analyzer.reanalyze'),
    icon: createVNode(ExclamationCircleOutlined),
    content: lang('analyzer.askReanalyze'),
    async onOk() {
      reanalyzeLoading.value[id] = true;

      try {
        await analyze(id);

        notification.open({
          icon: () => h(SisternodeOutlined, { style: 'color: #108ee9' }),
          message: lang('task.launchTitle'),
          description: lang('task.launchText'),
        });

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

      reanalyzeLoading.value[id] = false;
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
