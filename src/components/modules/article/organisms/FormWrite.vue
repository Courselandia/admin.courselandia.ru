<template>
  <Card>
    <template #title>
      <div ref="titleRef">
        <Lang value="article.writeArticle" />
      </div>
    </template>

    <FormWriteRequest
      v-model:value="form"
      :alert-message="alert.message as string"
      :alert-type="alert.type as string"
      :loading="loading"
      :button-text="lang('article.write') || undefined"
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
import FormWriteRequest from '@/components/modules/article/organisms/FormWriteRequest.vue';
import lang from '@/helpers/lang';
import IArticleWriteForm from '@/interfaces/modules/article/articleWriteForm';
import IAlert from '@/interfaces/molecules/alert/alert';
import write from '@/stores/write';
import TId from '@/types/id';

useMeta({
  title: lang('article.writeArticle'),
});

const route = useRoute();
const { request, result } = write();
const { item } = storeToRefs(write());
const { id } = route.params;

const titleRef = ref<HTMLElement|null>();
const loading = ref(false);

const alert = ref<IAlert>({
  message: null,
  type: null,
});

const getDefaultFormValue = (): IArticleWriteForm => ({
  request: '',
});

const form = ref<IArticleWriteForm>(getDefaultFormValue());

const onReset = () => {
  form.value = getDefaultFormValue();
};

const onSubmit = async (): Promise<void> => {
  alert.value.message = '';
  loading.value = true;

  try {
    await request(form.value.request);

    alert.value.message = lang('article.successWriteText');
    alert.value.type = 'success';
    form.value = getDefaultFormValue();
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
