<template>
  <Card>
    <template #title>
      <div ref="titleRef">
        <Lang value="profession.addProfession" />
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
  type: undefined,
});

const form = ref<IProfessionForm>({
  name: undefined,
  header: undefined,
  header_template: 'Онлайн-курсы по профессии {profession:nominative}',
  link: undefined,
  text: undefined,
  additional: undefined,
  title: undefined,
  title_template: 'Каталог онлайн-курсов по профессии {profession:nominative} [countProfessionCourses:— {countProfessionCourses:курс|nominative} для обучения] — Courselandia',
  description: undefined,
  description_template: 'Найдите для себя онлайн-курс по профессии {profession:nominative} из каталога Courselandia [countProfessionCourses:— {countProfessionCourses:курс|nominative} на выбор]. Рейтинг онлайн-школ и курсов, легкий поиск, сравнение цен.',
  keywords: undefined,
  status: true,
});

const onReset = (formRef?: FormInstance) => {
  form.value.text = '';
  form.value.additional = '';
  formRef?.resetFields();
};

const onSubmit = async (data: IProfessionForm, formRef?: FormInstance): Promise<void> => {
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
