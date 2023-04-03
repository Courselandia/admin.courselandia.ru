<template>
  <Card>
    <template #title>
      <div ref="titleRef">
        <Lang value="profession.addProfession" />
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
import Form from '@/components/modules/profession/organisms/Form.vue';
import lang from '@/helpers/lang';
import IProfessionForm from '@/interfaces/modules/profession/professionForm';
import IAlert from '@/interfaces/molecules/alert/alert';
import profession from '@/stores/profession';

useMeta({
  title: lang('profession.createProfession'),
});

const { create } = profession();

const titleRef = ref<HTMLElement|null>();
const loading = ref(false);

const alert = ref<IAlert>({
  message: null,
  type: null,
});

const form = ref<IProfessionForm>({
  name: '',
  header: null,
  header_template: 'Онлайн-курсы по профессии {profession:nominative}',
  link: '',
  text: null,
  title: null,
  title_template: 'Онлайн-курсы по профессии {profession:nominative} [countProfessionCourses:— {countProfessionCourses:курс|nominative} для обучения] — Courselandia',
  description: null,
  description_template: 'Найдите для себя онлайн-курс по профессии {profession:nominative} из каталога Courselandia [countProfessionCourses:— {countProfessionCourses:курс|nominative} на выбор]. Рейтинг онлайн-школ и курсов, легкий поиск, сравнение цен.',
  keywords: null,
  status: true,
});

const onReset = (formRef?: FormInstance) => {
  form.value.text = '';
  formRef?.resetFields();
};

const onSubmit = async (data: IProfessionForm, formRef?: FormInstance): Promise<void> => {
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
