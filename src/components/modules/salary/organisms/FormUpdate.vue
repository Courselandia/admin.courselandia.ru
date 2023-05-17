<template>
  <Card>
    <template #title>
      <div ref="titleRef">
        <Lang value="salary.updateSalary" />
      </div>
    </template>

    <Form
      v-model:value="form"
      :alert-message="alert.message as string"
      :alert-type="alert.type as string"
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
import Form from '@/components/modules/salary/organisms/Form.vue';
import lang from '@/helpers/lang';
import ISalaryForm from '@/interfaces/modules/salary/salaryForm';
import IAlert from '@/interfaces/molecules/alert/alert';
import salary from '@/stores/salary';
import TId from '@/types/id';

useMeta({
  title: lang('salary.updateSalary'),
});

const route = useRoute();
const { update } = salary();
const { item } = storeToRefs(salary());
const { id } = route.params;

const titleRef = ref<HTMLElement|null>();
const loading = ref(false);

const alert = ref<IAlert>({
  message: null,
  type: null,
});

const getDefaultFormValue = (): ISalaryForm => ({
  id: id as TId,
  level: item.value?.level || null,
  salary: item.value?.salary || '',
  profession_id: item.value?.profession
    ? { key: item.value?.profession.id as string, value: item.value?.profession.name }
    : null,
  status: item.value?.status !== undefined ? item.value?.status : true,
});

const form = ref<ISalaryForm>(getDefaultFormValue());

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
