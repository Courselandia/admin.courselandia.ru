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

  <Spin
    :spinning="writing"
    tip="Идет процесс написания текста, ждите..."
  >
    <Form
      ref="formRef"
      :model="form"
      :label-col="{ span: 6 }"
      layout="vertical"
      @finish="onSubmit"
    >
      <Descriptions
        v-if="form.result"
        bordered
        layout="horizontal"
        class="mb-20"
      >
        <Item
          :span="3"
          :label="lang('article.result')"
        >
          <div v-html="form.result" />
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
  </Spin>
</template>

<script lang="ts" setup>
import type { FormInstance } from 'ant-design-vue';
import Alert from 'ant-design-vue/lib/alert';
import Button from 'ant-design-vue/lib/button';
import Descriptions from 'ant-design-vue/lib/descriptions';
import Form from 'ant-design-vue/lib/form';
import Input from 'ant-design-vue/lib/input';
import Space from 'ant-design-vue/lib/space';
import Spin from 'ant-design-vue/lib/spin';
import {
  PropType,
  ref,
  toRefs,
  watch,
} from 'vue';

import Lang from '@/components/atoms/Lang.vue';
import lang from '@/helpers/lang';
import IArticleWriteForm from '@/interfaces/modules/article/articleWriteForm';

const formRef = ref<FormInstance>();

const props = defineProps({
  value: {
    type: Object as PropType<IArticleWriteForm>,
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
    default: lang('article.write'),
  },
  writing: {
    type: Boolean,
    default: false,
  },
});

const {
  value,
  writing,
} = toRefs(props);
const { Item } = Form;
const { TextArea } = Input;

const emit = defineEmits({
  'update:value': (_: IArticleWriteForm) => true,
  submit: (_: IArticleWriteForm, __?: FormInstance) => true,
  reset: (_?: FormInstance) => true,
});

const form = ref<IArticleWriteForm>(value.value);

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
