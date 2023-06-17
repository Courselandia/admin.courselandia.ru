<template>
  <template
    v-if="analyzer"
  >
    <Tag
      v-if="analyzer.unique"
      :color="analyzer.unique >= EQuality.UNIQUE ? 'green' : 'red'"
    >
      <Lang value="analyzer.unique" />
      {{ analyzer.unique }}%
    </Tag>
    <Tag
      v-if="analyzer.water"
      :color="analyzer.water <= EQuality.WATER ? 'green' : 'red'"
    >
      <Lang value="analyzer.water" />
      {{ analyzer.water }}%
    </Tag>
    <Tag
      v-if="analyzer.spam"
      :color="analyzer.spam <= EQuality.SPAM ? 'green' : 'red'"
    >
      <Lang value="analyzer.spam" />
      {{ analyzer.spam }}%
    </Tag>
  </template>
</template>

<script lang="ts" setup>
import Tag from 'ant-design-vue/lib/tag';
import {
  computed,
  PropType,
  toRefs,
} from 'vue';

import Lang from '@/components/atoms/Lang.vue';
import EQuality from '@/enums/modules/analyzer/quality';
import EStatus from '@/enums/modules/analyzer/status';
import IAnalyzer from '@/interfaces/modules/course/analyzer';

const props = defineProps({
  analyzers: {
    type: Array as PropType<Array<IAnalyzer>>,
    required: false,
    default: null,
  },
  category: {
    type: String,
    required: true,
  },
});

const {
  analyzers,
  category,
} = toRefs(props);

const analyzer = computed<IAnalyzer | null>(() => {
  if (category.value) {
    for (let i = 0; i < analyzers.value.length; i++) {
      if (
        analyzers.value[i].category === category.value
          && analyzers.value[i].status === EStatus.READY
      ) {
        return analyzers.value[i];
      }
    }
  }

  return null;
});
</script>
