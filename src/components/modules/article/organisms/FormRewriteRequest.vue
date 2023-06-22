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
    layout="vertical"
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
      <Item
        :span="3"
        :label="lang('article.text')"
      >
        <div v-html="form.text" />
        <div style="margin-top: 20px">
          <Tag
            v-if="form.text?.length"
            color="purple"
            style="margin-bottom: 5px"
          >
            <Lang value="article.lengthText" />
            {{ form.text?.length }}
          </Tag>
          <Info
            v-if="form.analyzers?.length"
            :analyzers="form.analyzers"
            category="article.text"
          />
        </div>

      </Item>
    </Descriptions>
    <Item
      :label="lang('article.request')"
      name="request"
      has-feedback
      :rules="[{ required: true, type: 'string', max: 65000 }]"
      :extra="lang('article.requestExplanation')"
    >
      <TextArea
        v-model:value="form.request"
        style="height: 200px"
      />
    </Item>
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
import Input from 'ant-design-vue/lib/input';
import Space from 'ant-design-vue/lib/space';
import Tag from 'ant-design-vue/lib/tag';
import {
  PropType,
  ref,
  toRefs,
  watch,
} from 'vue';

import Lang from '@/components/atoms/Lang.vue';
import Info from '@/components/modules/analyzer/organisms/Info.vue';
import lang from '@/helpers/lang';
import IArticleRewriteForm from '@/interfaces/modules/article/articleRewriteForm';

const formRef = ref<FormInstance>();

const props = defineProps({
  value: {
    type: Object as PropType<IArticleRewriteForm>,
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
    default: lang('article.rewrite'),
  },
});

const {
  value,
} = toRefs(props);
const { Item } = Form;
const { TextArea } = Input;

const emit = defineEmits({
  'update:value': (_: IArticleRewriteForm) => true,
  submit: (_: IArticleRewriteForm, __?: FormInstance) => true,
  reset: (_?: FormInstance) => true,
});

const form = ref<IArticleRewriteForm>(value.value);

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
  emit('submit', form.value, formRef.value);
};

const onReset = () => {
  emit('reset', formRef.value);
};
</script>
