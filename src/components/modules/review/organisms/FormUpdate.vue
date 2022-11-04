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
import { storeToRefs } from 'pinia';
import { ref } from 'vue';
import { useMeta } from 'vue-meta';
import { useRoute } from 'vue-router';

import Lang from '@/components/atoms/Lang.vue';
import Form from '@/components/modules/review/organisms/Form.vue';
import lang from '@/helpers/lang';
import IReviewForm from '@/interfaces/modules/review/reviewForm';
import IAlert from '@/interfaces/molecules/alert/alert';
import review from '@/store/review';
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

const getDefaultFormValue = (): IReviewForm => ({
  id: id as TId,
  level: item.value?.level || null,
  review: item.value?.review || null,
  profession_id: item.value?.profession_id || null,
  status: item.value?.status || true,
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
