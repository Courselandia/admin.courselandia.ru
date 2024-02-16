<template>
  <Card>
    <template #title>
      <div ref="titleRef">
        <Lang value="category.updateCategory" />
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
import { SisternodeOutlined } from '@ant-design/icons-vue';
import Card from 'ant-design-vue/lib/card';
import notification from 'ant-design-vue/lib/notification';
import { storeToRefs } from 'pinia';
import { h, ref } from 'vue';
import { useMeta } from 'vue-meta';
import { useRoute } from 'vue-router';

import Lang from '@/components/atoms/Lang.vue';
import Form from '@/components/modules/category/organisms/Form.vue';
import lang from '@/helpers/lang';
import ICategoryForm from '@/interfaces/modules/category/categoryForm';
import IAlert from '@/interfaces/molecules/alert/alert';
import category from '@/stores/category';
import TId from '@/types/id';

useMeta({
  title: lang('category.updateCategory'),
});

const route = useRoute();
const { update, get } = category();
const { item } = storeToRefs(category());
const { id } = route.params;

const titleRef = ref<HTMLElement|null>();
const loading = ref(false);

const alert = ref<IAlert>({
  message: null,
  type: undefined,
});

const getDefaultFormValue = (): ICategoryForm => ({
  id: id as TId,
  name: item.value?.name || undefined,
  header: item.value?.header || undefined,
  header_template: item.value?.header_template || undefined,
  link: item.value?.link || undefined,
  text: item.value?.text || undefined,
  additional: item.value?.additional || undefined,
  title: item.value?.metatag?.title || undefined,
  description: item.value?.metatag?.description || undefined,
  title_template: item.value?.metatag?.title_template || undefined,
  description_template: item.value?.metatag?.description_template || undefined,
  keywords: item.value?.metatag?.keywords || undefined,
  status: item.value?.status !== undefined ? item.value?.status : true,
  directions: item.value?.directions?.map((itm: any) => ({ key: itm.id, value: itm.name })) || [],
  professions: item.value?.professions?.map((itm: any) => ({ key: itm.id, value: itm.name })) || [],
  analyzers: item.value?.analyzers || undefined,
});

const form = ref<ICategoryForm>(getDefaultFormValue());

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
