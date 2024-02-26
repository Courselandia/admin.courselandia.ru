<template>
  <Card>
    <template #title>
      <div ref="titleRef">
        <Lang value="section.updateSection" />
      </div>
    </template>

    <Form
      v-model:value="form"
      :alert-message="alert.message as string"
      :alert-type="alert.type"
      :loading="loading"
      :button-text="lang('dashboard.edit') || undefined"
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
import Form from '@/components/modules/section/organisms/Form.vue';
import lang from '@/helpers/lang';
import ISectionForm from '@/interfaces/modules/section/sectionForm';
import IAlert from '@/interfaces/molecules/alert/alert';
import section from '@/stores/section';
import TId from '@/types/id';

useMeta({
  title: lang('section.updateSection'),
});

const route = useRoute();
const { update, get } = section();
const { item } = storeToRefs(section());
const { id } = route.params;

const titleRef = ref<HTMLElement|null>();
const loading = ref(false);

const alert = ref<IAlert>({
  message: null,
  type: undefined,
});

const getDefaultFormValue = (): ISectionForm => ({
  id: id as TId,
  name: item.value?.name || undefined,
  header: item.value?.header || undefined,
  text: item.value?.text || undefined,
  additional: item.value?.additional || undefined,
  level: item.value?.level || undefined,
  free: item.value?.free || false,
  title: item.value?.metatag?.title || undefined,
  description: item.value?.metatag?.description || undefined,
  keywords: item.value?.metatag?.keywords || undefined,
  status: item.value?.status !== undefined ? item.value?.status : true,
  item_id_0: item.value?.items[0]?.id
    ? { key: item.value?.items[0].itemable_id as string, value: item.value?.items[0].itemable.name }
    : undefined,
  item_type_0: item.value?.items[0]?.type || undefined,
  item_id_1: item.value?.items[1]?.id
    ? { key: item.value?.items[1].itemable_id as string, value: item.value?.items[1].itemable.name }
    : undefined,
  item_type_1: item.value?.items[1]?.type || undefined,
});

const form = ref<ISectionForm>(getDefaultFormValue());

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

    await get(id as TId);
    form.value = getDefaultFormValue();
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
