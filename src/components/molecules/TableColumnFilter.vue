<template>
  <div
    :class="{
      'table-column-filter': true,
      'table-column-filter--big': isMultiple,
    }"
  >
    <div class="pa-8 display--block">
      <template v-if="type === 'text'">
        <Input
          :value="selectedKeys[0]"
          :placeholder="lang('dashboard.search')"
          class="width--wide"
          @change="e => setSelectedKeys(e.target.value ? [e.target.value] : [])"
          @press-enter="onFilterSearch(selectedKeys, column.key)"
        />
      </template>
      <template v-else-if="type === 'number'">
        <InputNumber
          :value="selectedKeys[0]"
          :placeholder="lang('dashboard.search')"
          class="width--wide"
          @change="value => setSelectedKeys(value ? [value] : [])"
          @press-enter="onFilterSearch(selectedKeys, column.key)"
        />
      </template>
      <template v-else-if="type === 'dateRange'">
        <Space
          direction="vertical"
          :size="12"
        >
          <RangePicker
            :value="selectedKeys"
            format="DD.MM.YYYY"
            @change="value => setSelectedKeys(value ? value : [])"
            @press-enter="onFilterSearch(selectedKeys, column.key, true)"
          />
        </Space>
      </template>
      <template v-else-if="type === 'select'">
        <Select
          :value="selectedKeys"
          mode="multiple"
          class="width--80"
          show-search
          :filter-option="filterOption"
          :options="column.filters?.map((itm) => ({ value: itm.value, label: itm.text }))"
          @change="value => setSelectedKeys(value ? value : [])"
        />
      </template>
      <template v-else-if="type === 'slider'">
        <Slider
          :value="selectedKeys.length ? selectedKeys : [column.min, column.max]"
          :min="column.min"
          :max="column.max"
          :step="column.step"
          range
          @change="value => setSelectedKeys(value ? value : [])"
        />
      </template>
    </div>
    <Divider class="mt-0 mb-0" />
    <div class="pa-8 align--right">
      <Button
        size="small"
        type="text"
        :disabled="(type !== 'slider' && !selectedKeys[0]) ||
          (type === 'slider' && selectedKeys[0] === column.min && selectedKeys[1] === column.max)"
        @click="onFilterReset"
      >
        <Lang value="dashboard.reset" />
      </Button>
      <Button
        type="primary"
        size="small"
        class="mr-8"
        @click="onFilterSearch(selectedKeys, column.key, isMultiple)"
      >
        <Lang value="dashboard.ok" />
      </Button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { TableColumnType } from 'ant-design-vue';
import { Key } from 'ant-design-vue/lib/_util/type';
import Button from 'ant-design-vue/lib/button';
import DatePicker from 'ant-design-vue/lib/date-picker';
import Divider from 'ant-design-vue/lib/divider';
import Input from 'ant-design-vue/lib/input';
import InputNumber from 'ant-design-vue/lib/input-number';
import Select from 'ant-design-vue/lib/select';
import Slider from 'ant-design-vue/lib/slider';
import Space from 'ant-design-vue/lib/space';
import {
  PropType,
  reactive,
  toRefs,
} from 'vue';

import Lang from '@/components/atoms/Lang.vue';
import lang from '@/helpers/lang';
import ITableColumnType from '@/interfaces/molecules/table/tableColumnType';

const { RangePicker } = DatePicker;

const props = defineProps({
  type: {
    type: String,
    required: false,
    default: 'text',
  },
  setSelectedKeys: {
    type: Function,
    required: true,
  },
  selectedKeys: {
    type: Array as PropType<Array<any>>,
    required: true,
  },
  confirm: {
    type: Function,
    required: true,
  },
  clearFilters: {
    type: Function,
    required: true,
  },
  column: {
    type: Object as PropType<ITableColumnType<any>>,
    required: true,
  },
  visible: {
    type: Boolean,
    required: false,
    default: false,
  },
});

const filter = reactive({
  value: null as string | Array<string> | null,
  column: '' as Key,
});

const {
  confirm,
  clearFilters,
  visible,
  type,
} = toRefs(props);

const isMultiple = type.value === 'dateRange' || type.value === 'select' || type.value === 'slider';

const onFilterSearch = (selectedKeys: any[], key?: Key, multiple: boolean = false): void => {
  confirm.value();

  if (multiple) {
    filter.value = [];

    for (let i = 0; i < selectedKeys.length; i++) {
      filter.value[i] = selectedKeys[i];
    }
  } else {
    const [value] = selectedKeys;
    filter.value = value;
  }

  if (key) {
    filter.column = key;
  }
};

const onFilterReset = (): void => {
  clearFilters.value();
  filter.value = '';
};

const filterOption = (input: string, option: any) => option
  ?.text
  ?.toLowerCase()
  ?.indexOf(input.toLowerCase()) >= 0;
</script>

<style lang="scss">
@import '@/assets/components/molecules/tableColumnFilter.scss';
</style>
