<template>
  <Card>
    <template #title>
      <div ref="titleRef">
        <Lang value="term.addTerm" />
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
import { ref } from 'vue';
import { useMeta } from 'vue-meta';

import Lang from '@/components/atoms/Lang.vue';
import Form from '@/components/modules/term/organisms/Form.vue';
import lang from '@/helpers/lang';
import ITermForm from '@/interfaces/modules/term/termForm';
import IAlert from '@/interfaces/molecules/alert/alert';
import term from '@/stores/term';

useMeta({
  title: lang('term.createTerm'),
});

const { create } = term();

const titleRef = ref<HTMLElement|null>();
const loading = ref(false);

const alert = ref<IAlert>({
  message: null,
  type: undefined,
});

const form = ref<ITermForm>({
  variant: undefined,
  term: undefined,
  status: true,
});

const onReset = (formRef?: FormInstance) => {
  formRef?.resetFields();
};

const onSubmit = async (data: ITermForm, formRef?: FormInstance): Promise<void> => {
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
