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
    <Tabs>
      <TabPane
        key="info"
        :tab="lang('dashboard.info')"
      >
        <div class="width--wide max--width-600">
          <Item
            :label="lang('dashboard.status')"
            name="status"
            :rules="[{ required: true }]"
          >
            <RadioGroup
              v-model:value="form.status"
            >
              <RadioButton :value="true">
                <Lang value="dashboard.active" />
              </RadioButton>
              <RadioButton :value="false">
                <Lang value="dashboard.deactivated" />
              </RadioButton>
            </RadioGroup>
          </Item>
          <Item
            :label="lang('direction.nameField')"
            name="name"
            has-feedback
            :rules="[{ required: true, type: 'string', max: 191 }]"
          >
            <Input
              v-model:value="form.name"
              @keyup="onChangeName"
            />
          </Item>
          <Item
            :label="lang('direction.header')"
            name="header_template"
            has-feedback
            :rules="[{ required: true, type: 'string', max: 191 }]"
            :extra="form.header"
          >
            <Input v-model:value="form.header_template" />
          </Item>
          <Item
            :label="lang('direction.link')"
            name="link"
            has-feedback
            :rules="[{ required: true, type: 'string', max: 191, pattern: alphaDash }]"
          >
            <Input v-model:value="form.link" />
          </Item>
          <Item
            :label="lang('direction.weight')"
            name="weight"
            has-feedback
            :rules="[{ required: true, type: 'number', min: 0, max: 99999 }]"
          >
            <InputNumber
              v-model:value="form.weight"
              class="width--wide"
            />
          </Item>
        </div>
      </TabPane>
      <TabPane
        key="meta"
        :tab="lang('dashboard.meta')"
      >
        <div class="width--wide max--width-600">
          <Item
            :label="lang('direction.title')"
            name="title_template"
            has-feedback
            :rules="[{ type: 'string', max: 500 }]"
            :extra="form.title"
          >
            <Input v-model:value="form.title_template" />
          </Item>
          <Item
            :label="lang('direction.description')"
            name="description_template"
            has-feedback
            :rules="[{ type: 'string', max: 1000 }]"
            :extra="form.description"
          >
            <Input v-model:value="form.description_template" />
          </Item>
          <Item
            :label="lang('direction.keywords')"
            name="keywords"
            has-feedback
            :rules="[{ type: 'string', max: 1000 }]"
          >
            <Input v-model:value="form.keywords" />
          </Item>
        </div>
      </TabPane>
      <TabPane
        key="article"
        :tab="lang('direction.text')"
      >
        <Ckeditor
          v-model:value="form.text"
          name="text"
          class="mb-30"
        />

        <div
          v-if="form.analyzers?.length"
          class="mb-30"
        >
          <Info
            :analyzers="form.analyzers"
            category="direction.text"
          />
        </div>
      </TabPane>
    </Tabs>
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
import Form from 'ant-design-vue/lib/form';
import Input from 'ant-design-vue/lib/input';
import InputNumber from 'ant-design-vue/lib/input-number';
import Radio from 'ant-design-vue/lib/radio';
import Space from 'ant-design-vue/lib/space';
import Tabs from 'ant-design-vue/lib/tabs';
import {
  PropType,
  ref,
  toRefs,
  watch,
} from 'vue';

import Lang from '@/components/atoms/Lang.vue';
import Info from '@/components/modules/analyzer/organisms/Info.vue';
import Ckeditor from '@/components/molecules/Ckeditor.vue';
import { latin } from '@/helpers/format';
import lang from '@/helpers/lang';
import IDirectionForm from '@/interfaces/modules/direction/directionForm';
import TAlert from '@/types/alert';

const formRef = ref<FormInstance>();

const props = defineProps({
  value: {
    type: Object as PropType<IDirectionForm>,
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
    default: lang('dashboard.create'),
  },
});

const {
  value,
} = toRefs(props);
const { Item } = Form;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
const { TabPane } = Tabs;

const emit = defineEmits({
  'update:value': (_: IDirectionForm) => true,
  submit: (_: IDirectionForm, __?: FormInstance) => true,
  reset: (_?: FormInstance) => true,
});

const form = ref<IDirectionForm>(value.value);
const alphaDash = /^[A-Za-z0-9_-]*$/;

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

const onChangeName = () => {
  form.value.link = latin(form.value.name || '');
};
</script>
