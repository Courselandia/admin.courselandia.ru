<template>
  <Card>
    <template #title>
      <div ref="titleRef">
        <Lang value="review.updateReview" />
      </div>
    </template>

    <Form
      v-model:value="form"
      :alert-message="alert.message"
      :alert-type="alert.type"
      :loading="loading"
      :button-text="lang('dashboard.edit')"
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
  type: null,
});

const courseId: IOption | null = item.value?.course ? {
  key: item.value?.course?.id,
  value: item.value?.course?.header,
} : null;

const getDefaultFormValue = (): IReviewForm => ({
  id: id as TId,
  school_id: item.value?.school_id
    ? { key: item.value?.school.id, value: item.value?.school.name }
    : null,
  source: item.value?.source || null,
  course_id: courseId,
  name: item.value?.name || null,
  title: item.value?.title || null,
  review: item.value?.review || null,
  advantages: item.value?.advantages || null,
  disadvantages: item.value?.disadvantages || null,
  rating: item.value?.rating || null,
  status: item.value?.status || EStatus.ACTIVE,
  created_at: dayjs.utc(item.value?.created_at)
    .tz(dayjs.tz.guess()) || null,
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
