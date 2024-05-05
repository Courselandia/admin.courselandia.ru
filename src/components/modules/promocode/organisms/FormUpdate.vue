<template>
  <Card>
    <template #title>
      <div ref="titleRef">
        <Lang value="promocode.updatePromocode" />
      </div>
    </template>

    <Form
      v-model:value="form"
      :alert-message="alert.message as string"
      :alert-type="alert.type"
      :loading="loading"
      :button-text="lang('dashboard.edit') || undefined"
      @submit="onSubmit"
      @reset="onReset"
    />
  </Card>
</template>

<script lang="ts" setup>
import Card from 'ant-design-vue/lib/card';
import { storeToRefs } from 'pinia';
import { ref } from 'vue';
import { useMeta } from 'vue-meta';
import { useRoute } from 'vue-router';

import Lang from '@/components/atoms/Lang.vue';
import Form from '@/components/modules/promocode/organisms/Form.vue';
import lang from '@/helpers/lang';
import IPromocodeForm from '@/interfaces/modules/promocode/promocodeForm';
import IAlert from '@/interfaces/molecules/alert/alert';
import promocode from '@/stores/promocode';
import TId from '@/types/id';

useMeta({
  title: lang('promocode.updatePromocode'),
});

const route = useRoute();
const { update } = promocode();
const { item } = storeToRefs(promocode());
const { id } = route.params;

const titleRef = ref<HTMLElement|null>();
const loading = ref(false);

const alert = ref<IAlert>({
  message: null,
  type: undefined,
});

const getDefaultFormValue = (): IPromocodeForm => ({
  id: id as TId,
  school_id: item.value?.school_id
    ? { key: item.value?.school.id as string, value: item.value?.school.name }
    : undefined,
  question: item.value?.question || undefined,
  answer: item.value?.answer || undefined,
  status: item.value?.status !== undefined ? item.value?.status : true,
});

const form = ref<IPromocodeForm>(getDefaultFormValue());

const onReset = () => {
  form.value = getDefaultFormValue();
};

const onSubmit = async (): Promise<void> => {
  alert.value.message = '';
  loading.value = true;

  try {
    await update(form.value);

    alert.value.message = lang('dashboard.successUpdateText');
    alert.value.type = 'success';
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
