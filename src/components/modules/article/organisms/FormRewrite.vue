<template>
  <Card>
    <template #title>
      <div ref="titleRef">
        <Lang value="article.rewriteArticle" />
      </div>
    </template>

    <FormRewriteRequest
      v-model:value="form"
      :alert-message="alert.message as string"
      :alert-type="alert.type as string"
      :loading="loading"
      :button-text="lang('article.rewrite') || undefined"
      @submit="onSubmit"
      @reset="onReset"
    />
  </Card>
</template>

<script lang="ts" setup>
import { SisternodeOutlined } from '@ant-design/icons-vue';
import Card from 'ant-design-vue/lib/card';
import notification from 'ant-design-vue/lib/notification';
import { storeToRefs } from 'pinia';
import { h, ref } from 'vue';
import { useMeta } from 'vue-meta';
import { useRoute } from 'vue-router';

import Lang from '@/components/atoms/Lang.vue';
import FormRewriteRequest from '@/components/modules/article/organisms/FormRewriteRequest.vue';
import lang from '@/helpers/lang';
import IArticleRewriteForm from '@/interfaces/modules/article/articleRewriteForm';
import IAlert from '@/interfaces/molecules/alert/alert';
import article from '@/stores/article';
import TId from '@/types/id';

useMeta({
  title: lang('article.rewriteArticle'),
});

const route = useRoute();
const { rewrite, get } = article();
const { item } = storeToRefs(article());
const { id } = route.params;

const titleRef = ref<HTMLElement|null>();
const loading = ref(false);

const alert = ref<IAlert>({
  message: null,
  type: undefined,
});

const getDefaultFormValue = (): IArticleRewriteForm => ({
  id: id as TId,
  request: item.value?.request_template || '',
  text: item.value?.text || undefined,
  text_current: item.value?.text_current || undefined,
  analyzers: item.value?.analyzers || undefined,
  articleable: item.value?.articleable || undefined,
  category: item.value?.category || undefined,
  category_label: item.value?.category_label || undefined,
  category_name: item.value?.category_name || undefined,
});

const form = ref<IArticleRewriteForm>(getDefaultFormValue());

const onReset = () => {
  form.value = getDefaultFormValue();
};

const onSubmit = async (): Promise<void> => {
  alert.value.message = '';
  loading.value = true;

  try {
    await rewrite(form.value.id, form.value.request);

    alert.value.message = lang('article.successRewriteText');
    alert.value.type = 'success';

    notification.open({
      icon: () => h(SisternodeOutlined, { style: 'color: #108ee9' }),
      message: lang('task.launchTitle'),
      description: lang('task.launchText'),
    });

    await get(id as TId);
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
