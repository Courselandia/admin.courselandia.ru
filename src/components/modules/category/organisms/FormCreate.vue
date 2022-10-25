<template>
  <Card>
    <template #title>
      <div ref="titleRef">
        <Lang value="category.addCategory" />
      </div>
    </template>

    <Form
      v-model:value="form"
      :alert-message="alert.message"
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
import Form from '@/components/modules/category/organisms/Form.vue';
import lang from '@/helpers/lang';
import ICategoryForm from '@/interfaces/modules/category/categoryForm';
import IAlert from '@/interfaces/molecules/alert/alert';
import category from '@/store/category';

useMeta({
  title: lang('category.createCategory'),
});

const { create } = category();

const titleRef = ref<HTMLElement|null>();
const loading = ref(false);

const alert = ref<IAlert>({
  message: null,
  type: null,
});

const form = ref<ICategoryForm>({
  name: '',
  header: null,
  link: '',
  text: null,
  title: null,
  description: null,
  keywords: null,
  status: true,
  directions: [],
  professions: [],
});

const onReset = (formRef?: FormInstance) => {
  form.value.text = '';
  formRef?.resetFields();
};

const onSubmit = async (data: ICategoryForm, formRef?: FormInstance): Promise<void> => {
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
