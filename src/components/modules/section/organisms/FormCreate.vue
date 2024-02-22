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
import { SisternodeOutlined } from '@ant-design/icons-vue';
import type { FormInstance } from 'ant-design-vue';
import Card from 'ant-design-vue/lib/card';
import notification from 'ant-design-vue/lib/notification';
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
  item_id_1: undefined,
  item_type_1: undefined,
  item_id_2: undefined,
  item_type_2: undefined,
});

const onReset = (formRef?: FormInstance) => {
  form.value.text = '';
  form.value.additional = '';
  formRef?.resetFields();
};

const onSubmit = async (data: ISectionForm, formRef?: FormInstance): Promise<void> => {
  alert.value.message = '';
  loading.value = true;

  try {
    await create(form.value);

    alert.value.message = lang('dashboard.successCreateText');
    alert.value.type = 'success';

    notification.open({
      icon: () => h(SisternodeOutlined, { style: 'color: #108ee9' }),
      message: lang('task.launchTitle'),
      description: lang('task.launchText'),
    });

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
