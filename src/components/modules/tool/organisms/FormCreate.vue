<template>
  <Card>
    <template #title>
      <div ref="titleRef">
        <Lang value="tool.addTool" />
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
import Form from '@/components/modules/tool/organisms/Form.vue';
import lang from '@/helpers/lang';
import IToolForm from '@/interfaces/modules/tool/toolForm';
import IAlert from '@/interfaces/molecules/alert/alert';
import tool from '@/stores/tool';

useMeta({
  title: lang('tool.createTool'),
});

const { create } = tool();

const titleRef = ref<HTMLElement|null>();
const loading = ref(false);

const alert = ref<IAlert>({
  message: null,
  type: null,
});

const form = ref<IToolForm>({
  name: '',
  header: null,
  header_template: 'Онлайн-курсы по изучению инструмента {tool:nominative}',
  link: '',
  text: null,
  title: null,
  description: null,
  title_template: 'Онлайн-курсы по изучению инструмента {tool:nominative}[countToolCourses:: {countToolCourses:курс|nominative} для обучения с нуля] — Courselandia',
  description_template: 'Выбирайте обучающий онлайн-курс по изучению инструмента {tool:nominative} из каталога Courselandia [countToolCourses:— {countToolCourses:курс|nominative} на ваш выбор]. Рейтинг онлайн-школ, сравнение цен, легкий поиск онлайн-курсов.',
  keywords: null,
  status: true,
});

const onReset = (formRef?: FormInstance) => {
  form.value.text = '';
  formRef?.resetFields();
};

const onSubmit = async (data: IToolForm, formRef?: FormInstance): Promise<void> => {
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
