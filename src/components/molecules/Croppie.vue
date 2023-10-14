<template>
  <div
    id="crop"
  />
</template>

<script lang="ts" setup>
import Croppie from 'croppie';
import { onMounted, PropType, toRefs } from 'vue';

import IOptions from '@/interfaces/molecules/croppie/options';

const props = defineProps({
  image: {
    type: [File, String],
    required: false,
    default: null,
  },
  options: {
    type: Object as PropType<IOptions>,
    required: false,
    default: null,
  },
  settings: {
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

const setUpCroppie = async (): Promise<void> => {
  const element = document.getElementById('crop');
  croppie = new Croppie(element, props.settings);

  if (typeof image.value === 'string') {
    croppie.bind({
      url: image.value,
      points: props.options?.points || [],
      orientation: props.options?.orientation || undefined,
      zoom: props.options?.zoom || undefined,
    });
  } else {
    const reader = new FileReader();
    reader.readAsDataURL(image.value);
    reader.onload = () => {
      croppie.bind({
        url: reader.result,
        points: props.options?.points || [],
        orientation: props.options?.orientation || undefined,
        zoom: props.options?.zoom || undefined,
      });
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
