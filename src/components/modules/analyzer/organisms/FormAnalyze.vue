<template>
  <Card>
    <template #title>
      <div ref="titleRef">
        <Lang value="analyzer.analyze" />
      </div>
    </template>

    <FormAnalyzeRequest
      v-model:value="form"
      :alert-message="alert.message as string"
      :alert-type="alert.type as string"
      :loading="loading"
      :button-text="lang('analyzer.analyze') || undefined"
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
import FormAnalyzeRequest from '@/components/modules/analyzer/organisms/FormAnalyzeRequest.vue';
import lang from '@/helpers/lang';
import IAnalyzerAnalyzeForm from '@/interfaces/modules/analyzer/analyzerAnalyzeForm';
import IAlert from '@/interfaces/molecules/alert/alert';
import plagiarism from '@/stores/plagiarism';
import TId from '@/types/id';

useMeta({
  title: lang('analyzer.analyze'),
});

const route = useRoute();
const { request, result } = plagiarism();
const writing = ref(false);
const waitResult = 10; // секунды
const titleRef = ref<HTMLElement|null>();
const loading = ref(false);

const alert = ref<IAlert>({
  message: null,
  type: undefined,
});

const getDefaultFormValue = (): IAnalyzerAnalyzeForm => ({
  text: '',
});

const form = ref<IAnalyzerAnalyzeForm>(getDefaultFormValue());

const onReset = () => {
  form.value = getDefaultFormValue();
};

const getResult = async (id: TId): Promise<void> => {
  try {
    const responseResult = await result(id);
    form.value.result = responseResult.data;
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
    form.value.result = undefined;
    const response = await request(form.value.text);

    alert.value.message = lang('analyzer.successAnalyzeText');
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
