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
        :label="lang('term.variant')"
        name="variant"
        has-feedback
        :rules="[{ required: true, type: 'string', max: 191 }]"
      >
        <Input
          v-model:value="form.variant"
        />
      </Item>
      <Item
        :label="lang('term.term')"
        name="term"
        has-feedback
        :rules="[{ required: true, type: 'string', max: 191 }]"
      >
        <Input
          v-model:value="form.term"
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
    </div>
  </Form>
</template>

<script lang="ts" setup>
import type { FormInstance } from 'ant-design-vue';
import Alert from 'ant-design-vue/lib/alert';
import Button from 'ant-design-vue/lib/button';
import Form from 'ant-design-vue/lib/form';
import Input from 'ant-design-vue/lib/input';
import Radio from 'ant-design-vue/lib/radio';
import Space from 'ant-design-vue/lib/space';
import {
  h,
  onMounted,
  PropType,
  ref,
  toRefs,
  watch,
} from 'vue';

import Lang from '@/components/atoms/Lang.vue';
import lang from '@/helpers/lang';
import ITermForm from '@/interfaces/modules/term/termForm';
import TAlert from '@/types/alert';

const formRef = ref<FormInstance>();

const props = defineProps({
  value: {
    type: Object as PropType<ITermForm>,
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
const { TextArea } = Input;

const emit = defineEmits({
  'update:value': (_: ITermForm) => true,
  submit: (_: ITermForm, __?: FormInstance) => true,
  reset: (_?: FormInstance) => true,
});

const form = ref<ITermForm>(value.value);

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

const filterOption = (input: string, option: any) => option
  ?.label
  ?.toLowerCase()
  ?.indexOf(input.toLowerCase()) >= 0;
</script>
