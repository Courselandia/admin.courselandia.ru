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
    :tip="lang('analyzer.analyzing')"
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
        <ItemDescription
          v-if="form.result.unique"
          :span="3"
          :label="lang('analyzer.unique')"
        >
          <Tag
            :color="form.result.unique >= EQuality.UNIQUE ? 'green' : 'red'"
          >
            {{ form.result?.unique }}%
          </Tag>
        </ItemDescription>
        <ItemDescription
          v-if="form.result.spam"
          :span="3"
          :label="lang('analyzer.spam')"
        >
          <Tag
            :color="form.result.spam <= EQuality.SPAM ? 'green' : 'red'"
          >
            {{ form.result?.spam }}%
          </Tag>
        </ItemDescription>
        <ItemDescription
          v-if="form.result.water"
          :span="3"
          :label="lang('analyzer.water')"
        >
          <Tag
            :color="form.result.water <= EQuality.WATER ? 'green' : 'red'"
          >
            {{ form.result?.water }}%
          </Tag>
        </ItemDescription>
      </Descriptions>
      <Item
        :label="lang('analyzer.text')"
        name="text"
        has-feedback
        :rules="[{ required: true, type: 'string', max: 150000 }]"
      >
        <TextArea
          v-model:value="form.text"
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
import Tag from 'ant-design-vue/lib/tag';
import {
  PropType,
  ref,
  toRefs,
  watch,
} from 'vue';

import Lang from '@/components/atoms/Lang.vue';
import EQuality from '@/enums/modules/analyzer/quality';
import lang from '@/helpers/lang';
import IAnalyzerAnalyzeForm from '@/interfaces/modules/analyzer/analyzerAnalyzeForm';
import TAlert from '@/types/alert';

const ItemDescription = Descriptions.Item;
const formRef = ref<FormInstance>();

const props = defineProps({
  value: {
    type: Object as PropType<IAnalyzerAnalyzeForm>,
    required: true,
  },
  alertMessage: {
    type: String,
    required: false,
    default: null,
  },
  alertType: {
    type: String as PropType<TAlert>,
    default: 'success',
  },
  loading: {
    type: Boolean,
    default: false,
  },
  buttonText: {
    type: String,
    default: lang('analyzer.analyze'),
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
  'update:value': (_: IAnalyzerAnalyzeForm) => true,
  submit: (_: IAnalyzerAnalyzeForm, __?: FormInstance) => true,
  reset: (_?: FormInstance) => true,
});

const form = ref<IAnalyzerAnalyzeForm>(value.value);

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

// form.value.result?.spam
</script>
