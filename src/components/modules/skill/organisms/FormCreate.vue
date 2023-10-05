<template>
  <Card>
    <template #title>
      <div ref="titleRef">
        <Lang value="skill.addSkill" />
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
import Form from '@/components/modules/skill/organisms/Form.vue';
import lang from '@/helpers/lang';
import ISkillForm from '@/interfaces/modules/skill/skillForm';
import IAlert from '@/interfaces/molecules/alert/alert';
import skill from '@/stores/skill';

useMeta({
  title: lang('skill.createSkill'),
});

const { create } = skill();

const titleRef = ref<HTMLElement|null>();
const loading = ref(false);

const alert = ref<IAlert>({
  message: null,
  type: undefined,
});

const form = ref<ISkillForm>({
  name: undefined,
  header: undefined,
  header_template: 'Онлайн курсы по {skill:dative}',
  link: undefined,
  text: undefined,
  title: undefined,
  description: undefined,
  title_template: 'Каталог онлайн-курсов по {skill:dative}[countSkillCourses:: {countSkillCourses:курс|nominative} для обучения] — Courselandia',
  description_template: 'Подберите обучающий онлайн-курс для получения навыка {skill:nominative} из каталога Courselandia [countSkillCourses:— {countSkillCourses:курс|nominative} для вас]. Сравнение цен, рейтинг онлайн-школ, сравнение курсов.',
  keywords: undefined,
  status: true,
});

const onReset = (formRef?: FormInstance) => {
  form.value.text = '';
  formRef?.resetFields();
};

const onSubmit = async (data: ISkillForm, formRef?: FormInstance): Promise<void> => {
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
