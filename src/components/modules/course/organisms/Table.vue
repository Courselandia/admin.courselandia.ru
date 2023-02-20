<template>
  <Card :bordered="false">
    <template #title>
      <Lang value="course.name" />
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
        <template v-if="column.key === 'school-name'">
          {{ record?.school?.name }}
        </template>
        <template v-if="column.key === 'price'">
          <template v-if="record.price">
            {{ money(record.price, 0, getCurrencyLabel(record.currency)) }}
          </template>
          <template v-else>
            <Tag>
              {{ lang('dashboard.free') }}
            </Tag>
          </template>
        </template>
        <template v-if="column.key === 'professions-name'">
          <template v-if="record?.professions">
            <Tag
              v-for="(item, key) in record.professions"
              :key="key"
            >
              {{ item.name }}
            </Tag>
          </template>
        </template>
        <template v-if="column.key === 'directions-name'">
          <template v-if="record?.directions">
            <Tag
              v-for="(item, key) in record.directions"
              :key="key"
            >
              {{ item.name }}
            </Tag>
          </template>
        </template>
        <template v-if="column.key === 'status'">
          <template v-if="record.status === EStatus.ACTIVE">
            <Tag color="green">
              {{ lang('dashboard.active') }}
            </Tag>
          </template>
          <template v-else-if="record.status === EStatus.DISABLED">
            <Tag color="red">
              {{ lang('dashboard.disabled') }}
            </Tag>
          </template>
          <template v-else-if="record.status === EStatus.DRAFT">
            <Tag color="yellow">
              {{ lang('dashboard.draft') }}
            </Tag>
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
  SorterResult,
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
import ECurrency from '@/enums/modules/course/currency';
import EStatus from '@/enums/modules/course/status';
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
import ICourse from '@/interfaces/modules/course/course';
import ISorts from '@/interfaces/molecules/table/sorts';
import ITableColumnType from '@/interfaces/molecules/table/tableColumnType';
import course from '@/stores/course';
import direction from '@/stores/direction';
import profession from '@/stores/profession';
import school from '@/stores/school';
import TId from '@/types/id';

const {
  read,
  destroy,
} = course();
const {
  items,
  total,
} = storeToRefs(course());
const router = useRouter();
const route = useRoute();
const filteredInfo = ref<Record<string, FilterValue | null> | null>();
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

const readSchools = school().read;
const schoolData = storeToRefs(school());
const schoolItems = schoolData.items;

const getSchoolsFilter = (): Array<ColumnFilterItem> => {
  const result: Array<ColumnFilterItem> = [];

  schoolItems.value?.forEach((item) => {
    result[result.length] = {
      text: item.name,
      value: item.id,
    };
  });

  return result;
};

const readDirections = direction().read;
const directionData = storeToRefs(direction());
const directionItems = directionData.items;

const getDirectionsFilter = (): Array<ColumnFilterItem> => {
  const result: Array<ColumnFilterItem> = [];

  directionItems.value?.forEach((item) => {
    result[result.length] = {
      text: item.name,
      value: item.id,
    };
  });

  return result;
};

const columns = computed<ITableColumnType<ICourse>[]>(() => [
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
    title: lang('course.school'),
    dataIndex: 'school-name',
    key: 'school-name',
    sorter: {
      multiple: 1,
    },
    customFilterDropdown: true,
    sortOrder: stateColumnSort('school-name', sortedInfo.value),
    filteredValue: stateColumnFilter('school-id', filteredInfo.value, 'number'),
    filterType: 'select',
    filters: getSchoolsFilter(),
  },
  {
    title: lang('course.header'),
    dataIndex: 'header',
    key: 'header',
    sorter: {
      multiple: 1,
    },
    customFilterDropdown: true,
    sortOrder: stateColumnSort('header', sortedInfo.value),
    filteredValue: stateColumnFilter('header', filteredInfo.value, 'string'),
  },
  {
    title: lang('course.price'),
    dataIndex: 'price',
    key: 'price',
    sorter: {
      multiple: 1,
    },
    customFilterDropdown: true,
    sortOrder: stateColumnSort('price', sortedInfo.value),
    filteredValue: stateColumnFilter('price', filteredInfo.value, 'number'),
    filterType: 'slider',
    min: 0,
    max: 400000,
    step: 10000,
  },
  {
    title: lang('course.professions'),
    dataIndex: 'professions-name',
    key: 'professions-name',
    sorter: {
      multiple: 1,
    },
    customFilterDropdown: true,
    sortOrder: stateColumnSort('professions-name', sortedInfo.value),
    filteredValue: stateColumnFilter('professions-id', filteredInfo.value, 'number'),
    filterType: 'select',
    filters: getProfessionsFilter(),
  },
  {
    title: lang('course.directions'),
    dataIndex: 'directions-name',
    key: 'directions-name',
    sorter: {
      multiple: 1,
    },
    customFilterDropdown: true,
    sortOrder: stateColumnSort('directions-name', sortedInfo.value),
    filteredValue: stateColumnFilter('directions-id', filteredInfo.value, 'number'),
    filterType: 'select',
    filters: getDirectionsFilter(),
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
        text: lang('dashboard.active'),
        value: EStatus.ACTIVE,
      },
      {
        text: lang('dashboard.draft'),
        value: EStatus.DRAFT,
      },
      {
        text: lang('dashboard.deactivated'),
        value: EStatus.DISABLED,
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
  'school-name': 'school-id',
  'professions-name': 'professions-id',
  'directions-name': 'directions-id',
};

filteredInfo.value = stateFilters<ICourse>(columns.value, null, null, toFilterFields);
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
const selected = ref<Array<ICourse>>();
const destroySelectedDisabled = ref(true);
const destroySelectedLoading = ref(false);

const rowSelection: TableProps['rowSelection'] = {
  onChange: (selectedRowKeys: Key[], selectedRows: ICourse[]): void => {
    selected.value = selectedRows;
  },
};

const defaultSorts: Array<SorterResult> = [
  {
    columnKey: 'school-name',
    order: 'ascend',
  },
  {
    columnKey: 'header',
    order: 'ascend',
  },
];
sortedInfo.value = stateSorts<ICourse>(columns.value, defaultSorts);

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

const loadSchools = async () => {
  try {
    await readSchools(null, null, { name: 'ASC' } as ISorts);
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

const loadDirections = async () => {
  try {
    await readDirections(null, null, { name: 'ASC' } as ISorts);
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

  await loadProfessions();
  await loadSchools();
  await loadDirections();
});

watch(route, (): void => {
  const currentRoute = router.getRoutes().find((item) => item.name === 'Salaries');

  if (route.path === currentRoute?.path) {
    const pageSize = stateLimit() || pageSizeDefault;
    const current = statePage() || pageCurrentDefault;
    const offset = (current - 1) * pageSize;

    pagination.value.current = current;
    pagination.value.pageSize = pageSize;
    sortedInfo.value = stateSorts<ICourse>(columns.value);
    filteredInfo.value = stateFilters<ICourse>(columns.value);

    load(offset, pageSize, sortedInfo.value, filteredInfo.value);
  }
});

watch(selected, () => {
  destroySelectedDisabled.value = selected.value?.length === 0;
});

const onChange: TableProps<ICourse>['onChange'] = async (pag, filter, sorter): Promise<void> => {
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
};

const reloadToFirstPagination = async (): Promise<void> => {
  const pageSize = pagination.value.pageSize || pageSizeDefault;
  const offset = 0;
  pagination.value.current = 1;

  stateSet(offset, pageSize, sortedInfo.value, filteredInfo.value, toFilterFields);
  await load(offset, pageSize, sortedInfo.value, filteredInfo.value);
};

const reload = async (): Promise<void> => {
  const pageSize = pagination.value.pageSize || pageSizeDefault;
  const current = statePage() || pageCurrentDefault;
  const offset = (current - 1) * pageSize;

  stateSet(offset, pageSize, sortedInfo.value, filteredInfo.value, toFilterFields);
  await load(offset, pageSize, sortedInfo.value, filteredInfo.value);
};

const onClickCreate = (): void => {
  router.push({
    name: 'CourseCreate',
  });
};

const onClickUpdate = (id: TId): void => {
  router.push({
    name: 'CourseUpdate',
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

const getCurrencyLabel = (currency: ECurrency): string | null => {
  if (currency === ECurrency.RUB) {
    return 'руб.';
  }

  if (currency === ECurrency.USD) {
    return '$';
  }

  if (currency === ECurrency.EUR) {
    return '€';
  }

  return null;
};
</script>

<style lang="scss">
@import '@/assets/components/molecules/table.scss';
</style>
