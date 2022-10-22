<template>
  {{ translation }}
</template>

<script lang="ts" setup>
import { computed, toRefs } from 'vue';

import lang from '@/helpers/lang';

const props = defineProps({
  value: {
    type: String,
    required: true,
  },
});

const { value } = toRefs(props);
const translation = computed(() => lang(value?.value));
</script>
