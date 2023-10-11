<template>
  <div
    id="crop"
  />
</template>

<script lang="ts" setup>
import Croppie from 'croppie';
import { onMounted, toRefs } from 'vue';

import IOptions from '@/interfaces/molecules/croppie/options';

const props = defineProps({
  image: {
    type: File,
    required: false,
    default: null,
  },
  options: {
    type: Object,
    required: false,
    default: () => {},
  },
  format: {
    type: String,
    required: false,
    default: 'webp',
  },
  circle: {
    type: Boolean,
    required: false,
    default: false,
  },
});

const emit = defineEmits({
  update: (_: string, __: IOptions) => true,
});

const { image } = toRefs(props);
let croppie: Croppie | null = null;

const onUpdate = async (): Promise<void> => {
  emit('update', await croppie.result('base64', 'viewport', props.format, props.circle), croppie.get());
};

const setUpCroppie = (): void => {
  const element = document.getElementById('crop');
  croppie = new Croppie(element, props.options);

  if (image.value) {
    const reader = new FileReader();
    reader.readAsDataURL(image.value);
    reader.onload = () => {
      croppie.bind({ url: reader.result });
    };
  }

  element?.addEventListener('update', () => {
    onUpdate();
  });
};

onMounted(() => {
  setUpCroppie();
});
</script>

<style lang="css">
@import 'croppie/croppie.css';
</style>
