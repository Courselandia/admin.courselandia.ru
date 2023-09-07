<template>
  <Card :bordered="false">
    <template #title>
      <Lang value="article.name" />
    </template>

    <template #extra>
      <Space>
        <Button
          type="primary"
          @click="onClickWrite"
        >
          <template #icon>
            <RobotOutlined />
          </template>
          <span>
            <Lang value="article.write" />
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
              v-if="record.status === EStatus.READY"
              :title="lang('article.apply')"
              :loading="appliesLoading[record.id]"
              type="primary"
              shape="circle"
              @click="onClickApply(record.id)"
            >
              <template #icon>
                <CheckOutlined />
              </template>
            </Button>
            <Button
              :title="lang('dashboard.edit')"
              shape="circle"
              @click="onClickUpdate(record.id)"
            >
              <template #icon>
                <EditOutlined />
              </template>
            </Button>
            <Button
              v-if="
                record.status === EStatus.READY
                  || record.status === EStatus.FAILED
                  || record.status === EStatus.DISABLED
                  || record.status === EStatus.APPLIED
              "
              :title="lang('article.rewrite')"
              shape="circle"
              @click="onClickRewrite(record.id)"
            >
              <template #icon>
                <HighlightOutlined />
              </template>
            </Button>
            <Button
              v-if="record.status === EStatus.READY"
              :title="lang('article.disable')"
              :loading="disablesLoading[record.id]"
              danger
              shape="circle"
              @click="onClickDisable(record.id)"
            >
              <template #icon>
                <CloseOutlined />
              </template>
            </Button>
          </Space>
        </template>
        <template v-if="column.key === 'articleable_id'">
          <router-link
            :to="getLink(record.articleable_id, record.category)"
          >
            {{ record.articleable_id }}
          </router-link>
        </template>
        <template v-if="column.key === 'category'">
          {{ record.category_name }}
          <template v-if="record.category_label">
            / {{ record.category_label }}
          </template>
        </template>
        <template v-if="column.key === 'text_current'">
          <div v-html="record.text_current" />
          <div
            v-if="record.text_current?.length"
          >
            <Tag
              color="purple"
              style="margin-top: 20px"
            >
              <Lang value="article.lengthText" />
              {{ record.text_current ? countLength(record.text_current) : 0 }}
            </Tag>
            <Info
              :analyzers="record.articleable.analyzers"
              :category="record.category"
            />
          </div>
        </template>
        <template v-if="column.key === 'text'">
          <div v-html="record.text" />

          <div style="margin-top: 20px">
            <Tag
              v-if="record.text?.length"
              color="purple"
              style="margin-bottom: 5px"
            >
              <Lang value="article.lengthText" />
              {{ record.text ? countLength(record.text) : 0 }}
            </Tag>
            <Info
              :analyzers="record.analyzers"
              category="article.text"
            />
          </div>
        </template>

        <template v-if="column.key === 'status'">
          <Tag
            v-if="record.status === EStatus.PENDING"
            color="cyan"
          >
            <Lang value="article.pending" />
          </Tag>
          <Tag
            v-else-if="record.status === EStatus.READY"
            color="blue"
          >
            <Lang value="article.ready" />
          </Tag>
          <Tag
            v-else-if="record.status === EStatus.PROCESSING"
            color="orange"
          >
            <Lang value="article.processing" />
          </Tag>
          <Tag
            v-else-if="record.status === EStatus.FAILED"
            color="red"
          >
            <Lang value="article.failed" />
          </Tag>
          <Tag
            v-else-if="record.status === EStatus.DISABLED"
            color="pink"
          >
            <Lang value="article.disabled" />
          </Tag>
          <Tag
            v-else-if="record.status === EStatus.APPLIED"
            color="green"
          >
            <Lang value="article.applied" />
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
  CheckOutlined,
  CloseOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  HighlightOutlined,
  MehOutlined,
  RobotOutlined,
  SearchOutlined,
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
import trim from 'lodash/trim';
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
import Info from '@/components/modules/analyzer/organisms/Info.vue';
import getLink from '@/components/modules/article/getLink';
import TableColumnFilter from '@/components/molecules/TableColumnFilter.vue';
import TableTagsFilter from '@/components/molecules/TableTagsFilter.vue';
import EStatus from '@/enums/modules/article/status';
import countLength from '@/helpers/countLength';
import filters from '@/helpers/filters';
import { stripTags } from '@/helpers/format';
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
import IArticle from '@/interfaces/modules/article/article';
import ITableColumnType from '@/interfaces/molecules/table/tableColumnType';
import article from '@/stores/article';
import TId from '@/types/id';

const {
  read,
  status,
  apply,
} = article();
const {
  items,
  total,
} = storeToRefs(article());
const router = useRouter();
const route = useRoute();
const filteredInfo = ref<Record<string, FilterValue | null>>();
const sortedInfo = ref<SorterResult | SorterResult[] | null>();

const columns = computed<ITableColumnType<IArticle>[]>(() => [
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
    title: lang('article.ownId'),
    dataIndex: 'articleable_id',
    key: 'articleable_id',
    sorter: {
      multiple: 1,
    },
    sortable: false,
    customFilterDropdown: true,
    sortOrder: stateColumnSort('articleable_id', sortedInfo.value),
    filteredValue: stateColumnFilter('articleable_id', filteredInfo.value, 'number'),
    filterType: 'number',
    width: 150,
  },
  {
    title: lang('article.category'),
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
    ],
  },
  {
    title: lang('article.textCurrent'),
    dataIndex: 'text_current',
    key: 'text_current',
    sorter: false,
  },
  {
    title: lang('article.text'),
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
        text: lang('article.pending'),
        value: EStatus.PENDING,
      },
      {
        text: lang('article.ready'),
        value: EStatus.READY,
      },
      {
        text: lang('article.processing'),
        value: EStatus.PROCESSING,
      },
      {
        text: lang('article.failed'),
        value: EStatus.FAILED,
      },
      {
        text: lang('article.disabled'),
        value: EStatus.DISABLED,
      },
      {
        text: lang('article.applied'),
        value: EStatus.APPLIED,
      },
    ],
    width: 200,
  },
  {
    key: 'actions',
    width: 190,
  },
]);
filteredInfo.value = stateFilters<IArticle>(columns.value);
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
const appliesLoading = ref<Record<TId, boolean>>({});
const disablesLoading = ref<Record<TId, boolean>>({});
const selected = ref<Array<IArticle>>();
const destroySelectedDisabled = ref(true);
const destroySelectedLoading = ref(false);

const rowSelection: TableProps['rowSelection'] = {
  onChange: (selectedRowKeys: Key[], selectedRows: IArticle[]): void => {
    selected.value = selectedRows;
  },
};

const defaultSorts: Array<SorterResult> = [
  {
    columnKey: 'id',
    order: 'ascend',
  },
];
sortedInfo.value = stateSorts<IArticle>(columns.value, defaultSorts);

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
  const currentRoute = router.getRoutes().find((item) => item.name === 'Articles');

  if (route.path === currentRoute?.path) {
    const pageSize = stateLimit() || pageSizeDefault;
    const current = statePage() || pageCurrentDefault;
    const offset = (current - 1) * pageSize;

    pagination.value.current = current;
    pagination.value.pageSize = pageSize;
    sortedInfo.value = stateSorts<IArticle>(columns.value);
    filteredInfo.value = stateFilters<IArticle>(columns.value);

    load(offset, pageSize, sortedInfo.value, filteredInfo.value);
  }
});

watch(selected, () => {
  destroySelectedDisabled.value = selected.value?.length === 0;
});

const onChange: TableProps<IArticle>['onChange'] = async (pag, filter, sorter): Promise<void> => {
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
    name: 'ArticleUpdate',
    params: {
      id,
    },
  });
};

const onClickApply = (id: TId): void => {
  Modal.confirm({
    title: lang('article.apply'),
    icon: createVNode(ExclamationCircleOutlined),
    content: lang('article.askApplyRecord'),
    async onOk() {
      appliesLoading.value[id] = true;

      try {
        await apply(id);
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

      appliesLoading.value[id] = false;
    },
  });
};

const onClickRewrite = (id: TId): void => {
  router.push({
    name: 'ArticleRewrite',
    params: {
      id,
    },
  });
};

const onClickDisable = (id: TId): void => {
  Modal.confirm({
    title: lang('article.disable'),
    icon: createVNode(ExclamationCircleOutlined),
    content: lang('article.askDisableRecord'),
    async onOk() {
      disablesLoading.value[id] = true;

      try {
        await status(id, EStatus.DISABLED);
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

      disablesLoading.value[id] = false;
    },
  });
};

const onTagsChange = (): void => {
  reloadToFirstPagination();
};

const onClickWrite = (): void => {
  router.push({
    name: 'ArticleWrite',
  });
};
</script>

<style lang="scss">
@import '@/assets/components/molecules/table.scss';
</style>
