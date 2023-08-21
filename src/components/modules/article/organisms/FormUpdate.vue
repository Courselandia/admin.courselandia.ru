<template>
  <Card>
    <template #title>
      <div ref="titleRef">
        <Lang value="article.updateArticle" />
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
import { SisternodeOutlined } from '@ant-design/icons-vue';
import Card from 'ant-design-vue/lib/card';
import notification from 'ant-design-vue/lib/notification';
import { storeToRefs } from 'pinia';
import { h, ref } from 'vue';
import { useMeta } from 'vue-meta';
import { useRoute } from 'vue-router';

import Lang from '@/components/atoms/Lang.vue';
import Form from '@/components/modules/article/organisms/Form.vue';
import lang from '@/helpers/lang';
import IArticleForm from '@/interfaces/modules/article/articleForm';
import IAlert from '@/interfaces/molecules/alert/alert';
import article from '@/stores/article';
import TId from '@/types/id';

useMeta({
  title: lang('article.updateArticle'),
});

const route = useRoute();
const { update, get } = article();
const { item } = storeToRefs(article());
const { id } = route.params;

const titleRef = ref<HTMLElement|null>();
const loading = ref(false);

const alert = ref<IAlert>({
  message: null,
  type: null,
});

const getDefaultFormValue = (): IArticleForm => ({
  id: id as TId,
  text: item.value?.text || undefined,
  text_current: item.value?.text_current || undefined,
  apply: false,
  analyzers: item.value?.analyzers || null,
  articleable: item.value?.articleable || null,
  category: item.value?.category || null,
});

const form = ref<IArticleForm>(getDefaultFormValue());

const onReset = () => {
  form.value = getDefaultFormValue();
};

const onSubmit = async (): Promise<void> => {
  alert.value.message = '';
  loading.value = true;

  try {
    await update(form.value);

    if (form.value.apply) {
      alert.value.message = lang('article.successUpdateAndApplyText');
    } else {
      alert.value.message = lang('dashboard.successUpdateText');
    }

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
