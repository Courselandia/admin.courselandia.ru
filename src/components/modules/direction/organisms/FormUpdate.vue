<template>
  <Card>
    <template #title>
      <div ref="titleRef">
        <Lang value="direction.updateDirection" />
      </div>
    </template>

    <Form
      v-model:value="form"
      :alert-message="alert.message"
      :alert-type="alert.type"
      :loading="loading"
      :button-text="lang('dashboard.edit')"
      @submit="onSubmit"
      @reset="onReset"
    />
  </Card>
</template>

<script lang="ts" setup>
import Card from 'ant-design-vue/lib/card';
import { storeToRefs } from 'pinia';
import { ref } from 'vue';
import { useMeta } from 'vue-meta';
import { useRoute } from 'vue-router';

import Lang from '@/components/atoms/Lang.vue';
import Form from '@/components/modules/direction/organisms/Form.vue';
import lang from '@/helpers/lang';
import IDirectionForm from '@/interfaces/modules/direction/directionForm';
import IAlert from '@/interfaces/molecules/alert/alert';
import direction from '@/store/direction';
import TId from '@/types/id';

useMeta({
  title: lang('direction.updateDirection'),
});

const route = useRoute();
const { update } = direction();
const { item } = storeToRefs(direction());
const { id } = route.params;

const titleRef = ref<HTMLElement|null>();
const loading = ref(false);

const alert = ref<IAlert>({
  message: null,
  type: null,
});

const getDefaultFormValue = (): IDirectionForm => ({
  id: id as TId,
  name: item.value?.name || '',
  header: item.value?.header || null,
  link: item.value?.link || '',
  text: item.value?.text || null,
  weight: item.value?.weight || null,
  title: item.value?.metatag?.title || null,
  description: item.value?.metatag?.description || null,
  keywords: item.value?.metatag?.keywords || null,
  status: item.value?.status !== undefined ? item.value?.status : true,
});

const form = ref<IDirectionForm>(getDefaultFormValue());

const onReset = () => {
  form.value = getDefaultFormValue();
};

const onSubmit = async (): Promise<void> => {
  alert.value.message = '';
  loading.value = true;

  try {
    await update(form.value);

    alert.value.message = lang('dashboard.successUpdateText');
    alert.value.type = 'success';
  } catch (error: Error | any) {
    alert.value.message = error.response.data.message
      ? error.response.data.message
      : error.message;
    alert.value.type = 'error';
  }

  if (titleRef.value) {
    titleRef.value.scrollIntoView({ behavior: 'smooth' });
  }

  loading.value = false;
};
</script>
