<template>
  <Card :bordered="false">
    <template #title>
      <Lang value="salary.name" />
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
              :title="lang('dashboard.edit')"
              type="primary"
              shape="circle"
              @click="onClickUpdate(record.id)"
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
        <template v-if="column.key === 'profession-name'">
          {{ record?.profession?.name }}
        </template>
        <template v-if="column.key === 'salary'">
          {{ money(record.salary) }}
        </template>
        <template v-if="column.key === 'level'">
          <Tag>
            <template v-if="record.level === ELevel.JUNIOR">
              <Lang value="salary.junior" />
            </template>
            <template v-if="record.level === ELevel.MIDDLE">
              <Lang value="salary.middle" />
            </template>
            <template v-if="record.level === ELevel.SENIOR">
              <Lang value="salary.senior" />
            </template>
          </Tag>
        </template>
        <template v-if="column.key === 'status'">
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
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  MehOutlined,
  PlusOutlined,
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
  ColumnFilterItem,
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
import ELevel from '@/enums/modules/salary/level';
import filters from '@/helpers/filters';
import lang from '@/helpers/lang';
import { money } from '@/helpers/number';
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
import ISalary from '@/interfaces/modules/salary/salary';
import ISorts from '@/interfaces/molecules/table/sorts';
import ITableColumnType from '@/interfaces/molecules/table/tableColumnType';
import profession from '@/stores/profession';
import salary from '@/stores/salary';
import TId from '@/types/id';

const {
  read,
  status,
  destroy,
} = salary();
const {
  items,
  total,
} = storeToRefs(salary());
const router = useRouter();
const route = useRoute();
const filteredInfo = ref<Record<string, FilterValue | null>>();
const sortedInfo = ref<SorterResult | SorterResult[] | null>();
const readProfessions = profession().read;
const professionData = storeToRefs(profession());
const professionItems = professionData.items;

const getProfessionsFilter = (): Array<ColumnFilterItem> => {
  const result: Array<ColumnFilterItem> = [];

  professionItems.value?.forEach((item) => {
    result[result.length] = {
      text: item.name,
      value: item.id,
    };
  });

  return result;
};

const columns = computed<ITableColumnType<ISalary>[]>(() => [
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
    title: lang('salary.profession'),
    dataIndex: 'profession-name',
    key: 'profession-name',
    sorter: {
      multiple: 1,
    },
    customFilterDropdown: true,
    sortOrder: stateColumnSort('profession-name', sortedInfo.value),
    filteredValue: stateColumnFilter('profession-id', filteredInfo.value, 'number'),
    filterType: 'select',
    filters: getProfessionsFilter(),
  },
  {
    title: lang('salary.level'),
    dataIndex: 'level',
    key: 'level',
    sorter: {
      multiple: 1,
    },
    sortOrder: stateColumnSort('level', sortedInfo.value),
    filteredValue: stateColumnFilter('level', filteredInfo.value, 'string'),
    filters: [
      {
        text: lang('salary.junior'),
        value: ELevel.JUNIOR,
      },
      {
        text: lang('salary.middle'),
        value: ELevel.MIDDLE,
      },
      {
        text: lang('salary.senior'),
        value: ELevel.SENIOR,
      },
    ],
  },
  {
    title: lang('salary.salary'),
    dataIndex: 'salary',
    key: 'salary',
    sorter: {
      multiple: 1,
    },
    customFilterDropdown: true,
    sortOrder: stateColumnSort('salary', sortedInfo.value),
    filteredValue: stateColumnFilter('salary', filteredInfo.value, 'number'),
    filterType: 'number',
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
    width: 170,
  },
]);

const toFilterFields: Record<string, string> = {
  'profession-name': 'profession-id',
};

filteredInfo.value = stateFilters<ISalary>(columns.value, null, null, toFilterFields);
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
const selected = ref<Array<ISalary>>();
const destroySelectedDisabled = ref(true);
const destroySelectedLoading = ref(false);

const rowSelection: TableProps['rowSelection'] = {
  onChange: (selectedRowKeys: Key[], selectedRows: ISalary[]): void => {
    selected.value = selectedRows;
  },
};

const defaultSorts: Array<SorterResult> = [
  {
    columnKey: 'profession-name',
    order: 'ascend',
  },
  {
    columnKey: 'level',
    order: 'ascend',
  },
];
sortedInfo.value = stateSorts<ISalary>(columns.value, defaultSorts);

const load = async (
  offset: number,
  limit: number,
  sorter?: SorterResult | SorterResult[] | null,
  filter?: Record<string, FilterValue | null> | null,
): Promise<void> => {
  loading.value = true;

  try {
    await read(offset, limit, sorts(sorter), filters(filter, toFilterFields));
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

const loadProfessions = async () => {
  try {
    await readProfessions(null, null, { name: 'ASC' } as ISorts);
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

  await loadProfessions();
});

watch(route, (): void => {
  const currentRoute = router.getRoutes().find((item) => item.name === 'Salaries');

  if (route.path === currentRoute?.path) {
    const pageSize = stateLimit() || pageSizeDefault;
    const current = statePage() || pageCurrentDefault;
    const offset = (current - 1) * pageSize;

    pagination.value.current = current;
    pagination.value.pageSize = pageSize;
    sortedInfo.value = stateSorts<ISalary>(columns.value);
    filteredInfo.value = stateFilters<ISalary>(columns.value);

    load(offset, pageSize, sortedInfo.value, filteredInfo.value);
  }
});

watch(selected, () => {
  destroySelectedDisabled.value = selected.value?.length === 0;
});

const onChange: TableProps<ISalary>['onChange'] = async (pag, filter, sorter): Promise<void> => {
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

  stateSet(offset, pageSize, sortedInfo.value, filteredInfo.value, toFilterFields);
  await load(offset, pageSize, sortedInfo.value, filteredInfo.value);

  pagination.value.total = total.value || 0;
};

const reloadToFirstPagination = async (): Promise<void> => {
  const pageSize = pagination.value.pageSize || pageSizeDefault;
  const offset = 0;
  pagination.value.current = 1;

  stateSet(offset, pageSize, sortedInfo.value, filteredInfo.value, toFilterFields);
  await load(offset, pageSize, sortedInfo.value, filteredInfo.value);

  pagination.value.total = total.value || 0;
};

const reload = async (): Promise<void> => {
  const pageSize = pagination.value.pageSize || pageSizeDefault;
  const current = statePage() || pageCurrentDefault;
  const offset = (current - 1) * pageSize;

  stateSet(offset, pageSize, sortedInfo.value, filteredInfo.value, toFilterFields);
  await load(offset, pageSize, sortedInfo.value, filteredInfo.value);

  pagination.value.total = total.value || 0;
};

const onClickCreate = (): void => {
  router.push({
    name: 'SalaryCreate',
  });
};

const onClickUpdate = (id: TId): void => {
  router.push({
    name: 'SalaryUpdate',
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
};
</script>

<style lang="scss">
@import '@/assets/components/molecules/table.scss';
</style>
