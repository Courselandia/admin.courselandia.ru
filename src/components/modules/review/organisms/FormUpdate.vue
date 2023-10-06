<template>
  <Card>
    <template #title>
      <div ref="titleRef">
        <Lang value="review.updateReview" />
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
import dayjs from 'dayjs';
import { storeToRefs } from 'pinia';
import { ref } from 'vue';
import { useMeta } from 'vue-meta';
import { useRoute } from 'vue-router';

import Lang from '@/components/atoms/Lang.vue';
import Form from '@/components/modules/review/organisms/Form.vue';
import EStatus from '@/enums/modules/review/status';
import lang from '@/helpers/lang';
import IReviewForm from '@/interfaces/modules/review/reviewForm';
import IAlert from '@/interfaces/molecules/alert/alert';
import IOption from '@/interfaces/molecules/select/option';
import review from '@/stores/review';
import TId from '@/types/id';

useMeta({
  title: lang('review.updateReview'),
});

const route = useRoute();
const { update } = review();
const { item } = storeToRefs(review());
const { id } = route.params;

const titleRef = ref<HTMLElement|null>();
const loading = ref(false);

const alert = ref<IAlert>({
  message: null,
  type: undefined,
});

const courseId: IOption | null = item.value?.course ? {
  key: item.value?.course?.id,
  value: item.value?.course?.header,
} : null;

const getDefaultFormValue = (): IReviewForm => ({
  id: id as TId,
  school_id: item.value?.school_id
    ? { key: item.value?.school.id as string, value: item.value?.school.name }
    : undefined,
  source: item.value?.source || undefined,
  course_id: courseId || undefined,
  name: item.value?.name || undefined,
  title: item.value?.title || undefined,
  review: item.value?.review || undefined,
  advantages: item.value?.advantages || undefined,
  disadvantages: item.value?.disadvantages || undefined,
  rating: item.value?.rating || undefined,
  status: item.value?.status || EStatus.ACTIVE,
  created_at: dayjs.utc(item.value?.created_at)
    .tz(dayjs.tz.guess()) || undefined,
});

const form = ref<IReviewForm>(getDefaultFormValue());

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
