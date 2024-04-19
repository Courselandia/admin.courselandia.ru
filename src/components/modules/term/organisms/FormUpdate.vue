<template>
  <Card>
    <template #title>
      <div ref="titleRef">
        <Lang value="term.updateTerm" />
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
import Form from '@/components/modules/term/organisms/Form.vue';
import lang from '@/helpers/lang';
import ITermForm from '@/interfaces/modules/term/termForm';
import IAlert from '@/interfaces/molecules/alert/alert';
import term from '@/stores/term';
import TId from '@/types/id';

useMeta({
  title: lang('term.updateTerm'),
});

const route = useRoute();
const { update } = term();
const { item } = storeToRefs(term());
const { id } = route.params;

const titleRef = ref<HTMLElement|null>();
const loading = ref(false);

const alert = ref<IAlert>({
  message: null,
  type: undefined,
});

const getDefaultFormValue = (): ITermForm => ({
  id: id as TId,
  variant: item.value?.variant || undefined,
  term: item.value?.term || undefined,
  status: item.value?.status !== undefined ? item.value?.status : true,
});

const form = ref<ITermForm>(getDefaultFormValue());

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
