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
      :writing="writing"
      @submit="onSubmit"
      @reset="onReset"
    />
  </Card>
</template>

<script lang="ts" setup>
import Card from 'ant-design-vue/lib/card';
import { ref } from 'vue';
import { useMeta } from 'vue-meta';
import { useRoute } from 'vue-router';

import Lang from '@/components/atoms/Lang.vue';
import FormWriteRequest from '@/components/modules/article/organisms/FormWriteRequest.vue';
import lang from '@/helpers/lang';
import IArticleWriteForm from '@/interfaces/modules/article/articleWriteForm';
import IAlert from '@/interfaces/molecules/alert/alert';
import writer from '@/stores/writer';
import TId from '@/types/id';

useMeta({
  title: lang('article.writeArticle'),
});

const route = useRoute();
const { request, result } = writer();
const writing = ref(false);
const waitResult = 10; // секунды
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

const getResult = async (id: TId): Promise<void> => {
  try {
    const responseResult = await result(id);
    form.value.result = responseResult.data.text;
    alert.value.message = '';
    writing.value = false;
  } catch (error: Error | any) {
    if (error.response.status === 501) {
      window.setTimeout(async () => {
        await getResult(id);
      }, 1000 * waitResult);
    } else {
      alert.value.message = error.response.data.message
        ? error.response.data.message
        : error.message;
      alert.value.type = 'error';

      writing.value = false;
    }
  }
};

const onSubmit = async (): Promise<void> => {
  alert.value.message = '';
  loading.value = true;

  try {
    form.value.result = '';
    const response = await request(form.value.request);

    alert.value.message = lang('article.successWriteText');
    alert.value.type = 'success';

    writing.value = true;

    window.setTimeout(async () => {
      await getResult(response.data.id);
    }, 1000 * waitResult);
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
