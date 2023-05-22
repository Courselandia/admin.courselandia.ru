<template>
  <Alert
    v-if="alertMessage"
    :message="alertType === 'success'
      ? lang('dashboard.success')
      : lang('dashboard.error')"
    :description="alertMessage"
    :type="alertType"
    class="mb-25"
  />

  <Form
    ref="formRef"
    :model="form"
    :label-col="{ span: 6 }"
    @finish="onSubmit"
  >
    <Descriptions
      v-if="form"
      bordered
      layout="horizontal"
      class="mb-20"
    >
      <Item
        :span="3"
        :label="lang('article.textCurrent')"
      >
        <div v-html="form.text_current" />
        <div
          v-if="form.text_current?.length"
        >
          <Tag
            color="purple"
            style="margin-top: 20px"
          >
            <Lang value="article.lengthText" />
            {{ form.text_current?.length }}
          </Tag>
        </div>
      </Item>
    </Descriptions>
    <Ckeditor
      v-model:value="form.text"
      name="text"
      class="mb-30"
    />
    <div
      v-if="form.text?.length"
      style="margin-bottom: 25px"
    >
      <Tag color="purple">
        <Lang value="article.lengthText" />
        {{ form.text?.length }}
      </Tag>
    </div>
    <Item
      :wrapper-col="{ offset: 0 }"
      class="buttons-flex"
    >
      <Space>
        <Button
          :loading="loading"
          type="primary"
          html-type="submit"
        >
          <span>
            {{ buttonText }}
          </span>
        </Button>
        <Button
          :loading="loading"
          type="dashed"
          @click="onSubmitAndApply()"
        >
          <span>
            <Lang value="article.updateAndApply" />
          </span>
        </Button>
        <Button
          @click="onReset"
        >
          <Lang value="dashboard.reset" />
        </Button>
      </Space>
    </Item>
  </Form>
</template>

<script lang="ts" setup>
import type { FormInstance } from 'ant-design-vue';
import Alert from 'ant-design-vue/lib/alert';
import Button from 'ant-design-vue/lib/button';
import Descriptions from 'ant-design-vue/lib/descriptions';
import Form from 'ant-design-vue/lib/form';
import Space from 'ant-design-vue/lib/space';
import Tag from 'ant-design-vue/lib/tag';
import {
  PropType,
  ref,
  toRefs,
  watch,
} from 'vue';

import Lang from '@/components/atoms/Lang.vue';
import Ckeditor from '@/components/molecules/Ckeditor.vue';
import lang from '@/helpers/lang';
import IArticleForm from '@/interfaces/modules/article/articleForm';

const formRef = ref<FormInstance>();

const props = defineProps({
  value: {
    type: Object as PropType<IArticleForm>,
    required: true,
  },
  alertMessage: {
    type: String,
    required: false,
    default: null,
  },
  alertType: {
    type: String,
    default: 'success',
  },
  loading: {
    type: Boolean,
    default: false,
  },
  buttonText: {
    type: String,
    default: lang('dashboard.create'),
  },
});

const {
  value,
} = toRefs(props);
const { Item } = Form;

const emit = defineEmits({
  'update:value': (_: IArticleForm) => true,
  submit: (_: IArticleForm, __?: FormInstance) => true,
  reset: (_?: FormInstance) => true,
});

const form = ref<IArticleForm>(value.value);

watch(form, () => {
  emit('update:value', form.value);
}, {
  deep: true,
});

watch(value, () => {
  form.value = value.value;
}, {
  deep: true,
});

const onSubmit = () => {
  form.value.apply = false;
  emit('submit', form.value, formRef.value);
};

const onSubmitAndApply = () => {
  form.value.apply = true;
  emit('submit', form.value, formRef.value);
};

const onReset = () => {
  emit('reset', formRef.value);
};
</script>
