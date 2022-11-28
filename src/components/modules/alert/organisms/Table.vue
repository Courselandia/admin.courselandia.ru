<template>
  <Card :bordered="false">
    <template #title>
      <Lang value="alert.name" />
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

    <Table
      :columns="columns"
      :data-source="items"
      :pagination="pagination"
      :loading="loading"
      :row-selection="rowSelection"
      row-key="id"
      class="table--responsive"
      @change="onChange"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'actions'">
          <Space>
            <Button
              v-if="record.url"
              shape="circle"
              :title="lang('dashboard.go')"
              @click="onClickGo(record.url)"
            >
              <template #icon>
                <ArrowRightOutlined />
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
        <template v-if="column.key === 'tag'">
          <Tag :color="record.color">
            {{ record.tag }}
          </Tag>
        </template>
        <template v-if="column.key === 'title'">
          {{ record.title }}
          <div v-if="record.description">
            {{ record.description }}
          </div>
        </template>
        <template v-if="column.key === 'status'">
          <Tag
            :color="record.status === true ? 'red' : 'green'"
            class="cursor--pointer"
            @click="onClickStatus(record.id, !record.status)"
          >
            <template #icon>
              <template v-if="record.status === true">
                <CloseOutlined />
              </template>
              <template v-else>
                <CheckOutlined />
              </template>
            </template>
            {{ record.status === true
              ? lang('alert.active')
              : lang('alert.deactivated') }}
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
  ArrowRightOutlined,
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  MehOutlined,
  SearchOutlined,
} from '@ant-design/icons-vue/';
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
  SorterResult,
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
import lang from '@/helpers/lang';
import {
  stateFilters,
  stateLimit,
  statePage,
  stateSet,
  stateSorts,
} from '@/helpers/state';
import IAlert from '@/interfaces/modules/alert/alert';
import ITableColumnType from '@/interfaces/molecules/table/tableColumnType';
import alert from '@/store/alert';
import TId from '@/types/id';

const {
  read,
  countUnread,
  status,
  destroy,
} = alert();
const {
  items,
  total,
} = storeToRefs(alert());
const router = useRouter();
const route = useRoute();
const filteredInfo = ref<Record<string, FilterValue | null> | null>();
const sortedInfo = ref<SorterResult | SorterResult[] | null>();

const columns = computed<ITableColumnType<IAlert>[]>(() => [
  {
    title: lang('dashboard.id'),
    dataIndex: 'id',
    key: 'id',
    sorter: false,
    width: 100,
  },
  {
    title: lang('alert.tag'),
    dataIndex: 'tag',
    key: 'tag',
    sorter: false,
    width: 140,
  },
  {
    title: lang('alert.message'),
    dataIndex: 'title',
    key: 'title',
    sorter: false,
  },
  {
    title: lang('alert.createdAt'),
    dataIndex: 'created_at',
    key: 'created_at',
    sorter: false,
    width: 280,
  },
  {
    title: lang('dashboard.status'),
    dataIndex: 'status',
    key: 'status',
    sorter: false,
    width: 200,
  },
  {
    key: 'actions',
    width: 150,
  },
]);
filteredInfo.value = stateFilters<IAlert>(columns.value);
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
const selected = ref<Array<IAlert>>();
const destroySelectedDisabled = ref(true);
const destroySelectedLoading = ref(false);

const rowSelection: TableProps['rowSelection'] = {
  onChange: (selectedRowKeys: Key[], selectedRows: IAlert[]): void => {
    selected.value = selectedRows;
  },
};

const defaultSorts: Array<SorterResult> = [
  {
    columnKey: 'created_at',
    order: 'descend',
  },
];
sortedInfo.value = stateSorts<IAlert>(columns.value, defaultSorts);

const load = async (
  offset: number,
  limit: number,
): Promise<void> => {
  loading.value = true;

  try {
    await read(offset, limit);
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
  );
});

watch(route, (): void => {
  const currentRoute = router.getRoutes().find((item) => item.name === 'Alerts');

  if (route.path === currentRoute?.path) {
    const pageSize = stateLimit() || pageSizeDefault;
    const current = statePage() || pageCurrentDefault;
    const offset = (current - 1) * pageSize;

    pagination.value.current = current;
    pagination.value.pageSize = pageSize;
    sortedInfo.value = stateSorts<IAlert>(columns.value);
    filteredInfo.value = stateFilters<IAlert>(columns.value);

    load(offset, pageSize);
  }
});

watch(selected, () => {
  destroySelectedDisabled.value = selected.value?.length === 0;
});

const onChange: TableProps<IAlert>['onChange'] = async (pag, filter, sorter): Promise<void> => {
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
  await load(offset, pageSize);
};

const reload = async (): Promise<void> => {
  const pageSize = pagination.value.pageSize || pageSizeDefault;
  const current = statePage() || pageCurrentDefault;
  const offset = (current - 1) * pageSize;

  stateSet(offset, pageSize, sortedInfo.value, filteredInfo.value);
  await load(offset, pageSize);
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
      await countUnread();
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
        await countUnread();
        destroySelectedLoading.value = false;
        destroySelectedDisabled.value = true;
      }
    },
  });
};

const onClickStatus = async (id: TId, active: boolean): Promise<void> => {
  Modal.confirm({
    title: lang('dashboard.alert'),
    icon: createVNode(ExclamationCircleOutlined),
    content: lang('dashboard.confirmChangeStatus'),
    async onOk() {
      loading.value = true;

      try {
        await status(id, active);
        await reload();
        await countUnread();
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
};

const onClickGo = (url: string) => {
  router.push(url);
};
</script>

<style lang="scss">
@import '@/assets/components/molecules/table.scss';
</style>
