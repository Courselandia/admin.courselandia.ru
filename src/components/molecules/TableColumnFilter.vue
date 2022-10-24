<template>
  <div
    v-outside-click="onClickOutside"
    :class="{'table-column-filter': true, 'table-column-filter--big': type === 'dateRange'}"
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
      <template v-if="type === 'dateRange'">
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
    </div>
    <Divider class="mt-0 mb-0" />
    <div class="pa-8">
      <Button
        size="small"
        type="text"
        :disabled="!selectedKeys[0]"
        @click="onFilterReset"
      >
        <Lang value="dashboard.reset" />
      </Button>
      <Button
        type="primary"
        size="small"
        class="mr-8"
        @click="onFilterSearch(selectedKeys, column.key, type === 'dateRange')"
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
import Space from 'ant-design-vue/lib/space';
import {
  defineProps,
  PropType,
  reactive,
  toRefs,
} from 'vue';

import Lang from '@/components/atoms/Lang.vue';
import lang from '@/helpers/lang';

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
    type: Object as PropType<TableColumnType>,
    required: true,
  },
});

const filter = reactive({
  value: null as string | Array<string> | null,
  column: '' as Key,
});

const {
  confirm,
  clearFilters,
} = toRefs(props);

const onFilterSearch = (selectedKeys: any[], key: Key, multiple: boolean = false): void => {
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

  filter.column = key;
};

const onFilterReset = (): void => {
  clearFilters.value();
  filter.value = '';
};

const isDataPickerDropdown = (element: HTMLElement) => {
  const check = element.className.split(' ').indexOf('ant-picker-dropdown') !== -1;

  if (check) {
    return true;
  }

  if (element.parentElement) {
    const checkInside = isDataPickerDropdown(element.parentElement);

    if (checkInside) {
      return true;
    }
  }

  return false;
};

const onClickOutside = (event: PointerEvent): void => {
  const target = event?.target as HTMLDivElement;
  const { parentElement } = target;

  if (parentElement) {
    const check = isDataPickerDropdown(parentElement);

    if (check) {
      return;
    }
  }

  confirm.value();
  const { type, selectedKeys, column } = props;
  const multiple = type === 'dateRange';

  if (multiple) {
    filter.value = [];

    for (let i = 0; i < selectedKeys.length; i++) {
      filter.value[i] = selectedKeys[i];
    }
  } else {
    const [value] = selectedKeys;
    filter.value = value;
  }

  if (column.key) {
    filter.column = column.key;
  }
};
</script>

<style lang="scss">
@import '@/assets/components/molecules/tableColumnFilter.scss';
</style>
