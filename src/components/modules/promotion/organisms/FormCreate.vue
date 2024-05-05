<template>
  <Card>
    <template #title>
      <div ref="titleRef">
        <Lang value="promotion.addPromotion" />
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
import Form from '@/components/modules/promotion/organisms/Form.vue';
import lang from '@/helpers/lang';
import IPromotionForm from '@/interfaces/modules/promotion/promotionForm';
import IAlert from '@/interfaces/molecules/alert/alert';
import promotion from '@/stores/promotion';

useMeta({
  title: lang('promotion.createPromotion'),
});

const { create } = promotion();

const titleRef = ref<HTMLElement|null>();
const loading = ref(false);

const alert = ref<IAlert>({
  message: null,
  type: undefined,
});

const form = ref<IPromotionForm>({
  school_id: undefined,
  uuid: undefined,
  title: undefined,
  description: undefined,
  date_start: undefined,
  date_end: undefined,
  url: undefined,
  status: true,
});

const onReset = (formRef?: FormInstance) => {
  formRef?.resetFields();
  form.value.school_id = undefined;
};

const onSubmit = async (data: IPromotionForm, formRef?: FormInstance): Promise<void> => {
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
