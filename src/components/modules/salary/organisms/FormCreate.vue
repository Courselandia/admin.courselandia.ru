<template>
  <Card>
    <template #title>
      <div ref="titleRef">
        <Lang value="salary.addSalary" />
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
import Form from '@/components/modules/salary/organisms/Form.vue';
import lang from '@/helpers/lang';
import ISalaryForm from '@/interfaces/modules/salary/salaryForm';
import IAlert from '@/interfaces/molecules/alert/alert';
import salary from '@/stores/salary';

useMeta({
  title: lang('salary.createSalary'),
});

const { create } = salary();

const titleRef = ref<HTMLElement|null>();
const loading = ref(false);

const alert = ref<IAlert>({
  message: null,
  type: null,
});

const form = ref<ISalaryForm>({
  level: null,
  salary: '',
  profession_id: null,
  status: true,
});

const onReset = (formRef?: FormInstance) => {
  formRef?.resetFields();
  form.value.profession_id = null;
};

const onSubmit = async (data: ISalaryForm, formRef?: FormInstance): Promise<void> => {
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
