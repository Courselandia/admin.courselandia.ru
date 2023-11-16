<template>
  <Card>
    <template #title>
      <div ref="titleRef">
        <Lang value="category.addCategory" />
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
import Form from '@/components/modules/category/organisms/Form.vue';
import lang from '@/helpers/lang';
import ICategoryForm from '@/interfaces/modules/category/categoryForm';
import IAlert from '@/interfaces/molecules/alert/alert';
import category from '@/stores/category';

useMeta({
  title: lang('category.createCategory'),
});

const { create } = category();

const titleRef = ref<HTMLElement|null>();
const loading = ref(false);

const alert = ref<IAlert>({
  message: null,
  type: undefined,
});

const form = ref<ICategoryForm>({
  name: undefined,
  header: undefined,
  header_template: 'Онлайн курсы по {category:dative}',
  link: undefined,
  text: undefined,
  title: undefined,
  description: undefined,
  title_template: 'Каталог онлайн-курсов по {category:dative}[countCategoryCourses:: {countCategoryCourses:курс|nominative} для обучения с нуля] — Courselandia',
  description_template: 'Выберите обучающий онлайн-курс в категории {category:nominative} в каталоге Courselandia [countCategoryCourses:— {countCategoryCourses:курс|nominative} для вас]. Рейтинги онлайн-школ, сравнение цен, быстрый поиск, сравнение курсов, обучающие программы.',
  keywords: undefined,
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
