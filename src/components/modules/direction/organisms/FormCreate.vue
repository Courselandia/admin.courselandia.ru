<template>
  <Card>
    <template #title>
      <div ref="titleRef">
        <Lang value="direction.addDirection" />
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
import Form from '@/components/modules/direction/organisms/Form.vue';
import lang from '@/helpers/lang';
import IDirectionForm from '@/interfaces/modules/direction/directionForm';
import IAlert from '@/interfaces/molecules/alert/alert';
import direction from '@/stores/direction';

useMeta({
  title: lang('direction.createDirection'),
});

const { create } = direction();

const titleRef = ref<HTMLElement|null>();
const loading = ref(false);

const alert = ref<IAlert>({
  message: null,
  type: undefined,
});

const form = ref<IDirectionForm>({
  name: undefined,
  header_template: 'Онлайн курсы по {direction:dative}',
  header: undefined,
  link: undefined,
  text: undefined,
  weight: undefined,
  title_template: 'Каталог онлайн-курсов по {direction:dative}[countDirectionCourses:: {countDirectionCourses:курс|nominative} для обучения] — Courselandia',
  description_template: 'В каталоге Courselandia вы можете найти интересные курсы по направлению {direction:nominative} [countDirectionCourses:из {countDirectionCourses:вариант|genitive}]. Здесь полное описание курсов, удобный поиск, рейтинги, обучающие программы.',
  title: undefined,
  description: undefined,
  keywords: undefined,
  status: false,
});

const onReset = (formRef?: FormInstance) => {
  form.value.text = '';
  formRef?.resetFields();
};

const onSubmit = async (data: IDirectionForm, formRef?: FormInstance): Promise<void> => {
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
