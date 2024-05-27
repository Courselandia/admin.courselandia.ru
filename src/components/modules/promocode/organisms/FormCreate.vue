<template>
  <Card>
    <template #title>
      <div ref="titleRef">
        <Lang value="promocode.addPromocode" />
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
import Form from '@/components/modules/promocode/organisms/Form.vue';
import lang from '@/helpers/lang';
import IPromocodeForm from '@/interfaces/modules/promocode/promocodeForm';
import IAlert from '@/interfaces/molecules/alert/alert';
import promocode from '@/stores/promocode';

useMeta({
  title: lang('promocode.createPromocode'),
});

const { create } = promocode();

const titleRef = ref<HTMLElement|null>();
const loading = ref(false);

const alert = ref<IAlert>({
  message: null,
  type: undefined,
});

const form = ref<IPromocodeForm>({
  school_id: undefined,
  uuid: undefined,
  code: undefined,
  title: undefined,
  description: undefined,
  min_price: undefined,
  discount: undefined,
  discount_type: undefined,
  date_start: undefined,
  date_end: undefined,
  type: undefined,
  url: undefined,
  status: true,
});

const onReset = (formRef?: FormInstance) => {
  formRef?.resetFields();
  form.value.school_id = undefined;
};

const onSubmit = async (data: IPromocodeForm, formRef?: FormInstance): Promise<void> => {
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
