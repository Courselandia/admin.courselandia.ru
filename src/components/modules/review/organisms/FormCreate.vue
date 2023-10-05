<template>
  <Card>
    <template #title>
      <div ref="titleRef">
        <Lang value="review.addReview" />
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
import dayjs from 'dayjs';
import { ref } from 'vue';
import { useMeta } from 'vue-meta';

import Lang from '@/components/atoms/Lang.vue';
import Form from '@/components/modules/review/organisms/Form.vue';
import EStatus from '@/enums/modules/review/status';
import lang from '@/helpers/lang';
import IReviewForm from '@/interfaces/modules/review/reviewForm';
import IAlert from '@/interfaces/molecules/alert/alert';
import review from '@/stores/review';

useMeta({
  title: lang('review.createReview'),
});

const { create } = review();

const titleRef = ref<HTMLElement|null>();
const loading = ref(false);

const alert = ref<IAlert>({
  message: null,
  type: undefined,
});

const form = ref<IReviewForm>({
  school_id: undefined,
  course_id: undefined,
  source: undefined,
  name: undefined,
  title: undefined,
  review: undefined,
  advantages: undefined,
  disadvantages: undefined,
  rating: undefined,
  status: EStatus.ACTIVE,
  created_at: dayjs.utc().tz(dayjs.tz.guess()),
});

const onReset = (formRef?: FormInstance) => {
  formRef?.resetFields();
  form.value.school_id = null;
  form.value.course_id = null;
};

const onSubmit = async (data: IReviewForm, formRef?: FormInstance): Promise<void> => {
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
