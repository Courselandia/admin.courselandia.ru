<template>
  <Card>
    <template #title>
      <div ref="titleRef">
        <Lang value="section.addSection" />
      </div>
    </template>

    <Form
      v-model:value="form"
      :alert-message="alert.message as string"
      :alert-type="alert.type"
      :loading="loading"
      @submit="onSubmit"
      @reset="onReset"
    />
  </Card>
</template>

<script lang="ts" setup>
import type { FormInstance } from 'ant-design-vue';
import Card from 'ant-design-vue/lib/card';
import { h, ref } from 'vue';
import { useMeta } from 'vue-meta';

import Lang from '@/components/atoms/Lang.vue';
import Form from '@/components/modules/section/organisms/Form.vue';
import lang from '@/helpers/lang';
import ISectionForm from '@/interfaces/modules/section/sectionForm';
import IAlert from '@/interfaces/molecules/alert/alert';
import section from '@/stores/section';

useMeta({
  title: lang('section.createSection'),
});

const { create } = section();

const titleRef = ref<HTMLElement|null>();
const loading = ref(false);

const alert = ref<IAlert>({
  message: null,
  type: undefined,
});

const form = ref<ISectionForm>({
  name: undefined,
  header: undefined,
  text: undefined,
  additional: undefined,
  level: undefined,
  free: false,
  title: undefined,
  description: undefined,
  keywords: undefined,
  status: true,
  item_id_0: undefined,
  item_type_0: undefined,
  item_id_1: undefined,
  item_type_1: undefined,
});

const onReset = (formRef?: FormInstance) => {
  form.value.text = undefined;
  form.value.additional = undefined;
  form.value.title = undefined;
  form.value.description = undefined;
  form.value.level = undefined;
  formRef?.resetFields();
};

const onSubmit = async (data: ISectionForm, formRef?: FormInstance): Promise<void> => {
  alert.value.message = '';
  loading.value = true;

  try {
    await create(form.value);

    alert.value.message = lang('dashboard.successCreateText');
    alert.value.type = 'success';

    onReset(formRef);
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
