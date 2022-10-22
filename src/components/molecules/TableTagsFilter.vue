<template>
  <div v-if="hasFilters()">
    <span :style="{ marginRight: '10px' }">
      Фильтры:
    </span>
    <template
      v-for="(filter, field) in filters"
      :key="field"
    >
      <template v-if="filter && !isException(field) && getValue(field, filter)">
        <Tag
          closable
          @close="onTagClose(field)"
        >
          {{ getTitle(field) }}: {{ getValue(field, filter) }}
        </Tag>
      </template>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { TableColumnType } from 'ant-design-vue';
import { FilterValue } from 'ant-design-vue/lib/table/interface';
import Tag from 'ant-design-vue/lib/tag';
import dayjs from 'dayjs';
import { defineProps, PropType, toRefs } from 'vue';

import IColumn from '@/interfaces/molecules/table/column';

const props = defineProps({
  columns: {
    type: Array as PropType<Array<TableColumnType<IColumn>>>,
    required: true,
  },
  filters: {
    type: Object as PropType<Record<string, FilterValue | null>>,
    required: false,
    default: null,
  },
  exceptions: {
    type: Object as PropType<Array<string>>,
    required: false,
    default: null,
  },
});

const emit = defineEmits({
  'update:filters': (_: Record<string, FilterValue | null>) => true,
  change: (_: Record<string, FilterValue | null>) => true,
});

const { columns, filters, exceptions } = toRefs(props);

const getTitle = (field: string): string|null => {
  const foundColumn = columns.value.find((column) => field === column.key);

  return foundColumn ? foundColumn.title as string : null;
};

const getValue = (
  field: string,
  value: any | Array<any> | null,
): string | dayjs.Dayjs => {
  if (value === null) {
    return '';
  }

  if (typeof value === 'object') {
    if (value instanceof dayjs) {
      return value as dayjs.Dayjs;
    }

    const valueCurrent = value.map((item: any) => getValue(field, item));

    if (valueCurrent) {
      let isDateFormat = false;

      for (let i = 0; i < valueCurrent.length; i++) {
        if (valueCurrent[i] instanceof dayjs) {
          valueCurrent[i] = valueCurrent[i].format('D MMMM YYYY');
          isDateFormat = true;
        }
      }

      return valueCurrent?.join(isDateFormat ? ' – ' : ', ');
    }
  }

  const foundColumn = columns.value.find((column) => field === column.key);

  if (foundColumn?.filters) {
    const filter = foundColumn?.filters?.find((flt) => flt.value === value);

    return filter?.text as string;
  }

  if (foundColumn?.customFilterDropdown) {
    return value as string;
  }

  return value as string;
};

const onTagClose = (field: string): void => {
  if (filters?.value) {
    Object.keys(filters.value).forEach((name) => {
      if (filters.value && name === field) {
        filters.value[name] = null;
      }
    });

    emit('update:filters', filters.value);
    emit('change', filters.value);
  }
};

const isException = (field: string): boolean => {
  if (!exceptions?.value) {
    return false;
  }

  return !exceptions.value.indexOf(field);
};

const hasFilters = (): boolean => {
  if (!filters?.value) {
    return false;
  }

  const value = filters?.value;

  return !!Object.keys(value).find((field) => {
    if (isException(field)) {
      return false;
    }

    const insideValues = value[field];

    if (insideValues && typeof insideValues === 'object') {
      return !!Object.values(insideValues).find((valueInside) => !!valueInside);
    }

    return !!insideValues;
  });
};
</script>
