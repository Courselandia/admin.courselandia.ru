<template>
  <Card>
    <template #title>
      <div ref="titleRef">
        <Lang value="faq.addFaq" />
      </div>
    </template>

    <Form
      v-model:value="form"
      :alert-message="alert.message as string"
      :alert-type="alert.type as string"
      :loading="loading"
      @submit="onSubmit"
      @reset="onReset"
    />
  </Card>
</template>

<script lang="ts" setup>
import type { FormInstance } from 'ant-design-vue';
import Card from 'ant-design-vue/lib/card';
import { ref } from 'vue';
import { useMeta } from 'vue-meta';

import Lang from '@/components/atoms/Lang.vue';
import Form from '@/components/modules/faq/organisms/Form.vue';
import lang from '@/helpers/lang';
import IFaqForm from '@/interfaces/modules/faq/faqForm';
import IAlert from '@/interfaces/molecules/alert/alert';
import faq from '@/stores/faq';

useMeta({
  title: lang('faq.createFaq'),
});

const { create } = faq();

const titleRef = ref<HTMLElement|null>();
const loading = ref(false);

const alert = ref<IAlert>({
  message: null,
  type: null,
});

const form = ref<IFaqForm>({
  school_id: null,
  question: '',
  answer: '',
  status: true,
});

const onReset = (formRef?: FormInstance) => {
  formRef?.resetFields();
  form.value.school_id = null;
};

const onSubmit = async (data: IFaqForm, formRef?: FormInstance): Promise<void> => {
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
