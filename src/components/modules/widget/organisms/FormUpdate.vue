<template>
  <Card>
    <template #title>
      <div ref="titleRef">
        <Lang value="widget.updateWidget" />
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
import { storeToRefs } from 'pinia';
import { ref } from 'vue';
import { useMeta } from 'vue-meta';
import { useRoute } from 'vue-router';

import Lang from '@/components/atoms/Lang.vue';
import Form from '@/components/modules/widget/organisms/Form.vue';
import lang from '@/helpers/lang';
import IWidgetForm from '@/interfaces/modules/widget/widgetForm';
import IAlert from '@/interfaces/molecules/alert/alert';
import widget from '@/stores/widget';
import TId from '@/types/id';

useMeta({
  title: lang('widget.updateWidget'),
});

const route = useRoute();
const { update, get } = widget();
const { item } = storeToRefs(widget());
const { id } = route.params;

const titleRef = ref<HTMLElement|null>();
const loading = ref(false);

const alert = ref<IAlert>({
  message: null,
  type: undefined,
});

const getDefaultFormValue = (): IWidgetForm => ({
  id: id as TId,
  name: item.value?.name || undefined,
  status: item.value?.status !== undefined ? item.value?.status : true,
  values: item.value?.values ? item.value.values.map((itm) => ({
    name: itm.name,
    value: itm.value ? JSON.parse(itm.value) : undefined,
  })) : [],
});

const form = ref<IWidgetForm>(getDefaultFormValue());

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
