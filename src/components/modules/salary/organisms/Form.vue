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
        :label="lang('salary.profession')"
        name="profession_id"
        has-feedback
        :rules="[{ required: true }]"
      >
        <Select
          v-model:value="form.profession_id"
          label-in-value
          class="width--wide"
          show-search
          :filter-option="filterOption"
          :options="professionItems?.map((itm) => ({ value: itm.id, label: itm.name }))"
          :loading="loadingSelects"
        />
      </Item>
      <Item
        :label="lang('salary.level')"
        name="level"
        has-feedback
        :rules="[{ required: true }]"
      >
        <Select
          v-model:value="form.level"
        >
          <Option :value="ELevel.JUNIOR">
            <Lang value="salary.junior" />
          </Option>
          <Option :value="ELevel.MIDDLE">
            <Lang value="salary.middle" />
          </Option>
          <Option :value="ELevel.SENIOR">
            <Lang value="salary.senior" />
          </Option>
        </Select>
      </Item>
      <Item
        :label="lang('salary.salary')"
        name="salary"
        has-feedback
        :rules="[{ required: true, type: 'number', min: 1, max: 9999999 }]"
      >
        <InputNumber
          v-model:value="form.salary"
          class="width--wide"
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
import { MehOutlined } from '@ant-design/icons-vue';
import type { FormInstance } from 'ant-design-vue';
import Alert from 'ant-design-vue/lib/alert';
import Button from 'ant-design-vue/lib/button';
import Form from 'ant-design-vue/lib/form';
import InputNumber from 'ant-design-vue/lib/input-number';
import notification from 'ant-design-vue/lib/notification';
import Radio from 'ant-design-vue/lib/radio';
import Select from 'ant-design-vue/lib/select';
import Space from 'ant-design-vue/lib/space';
import { storeToRefs } from 'pinia';
import {
  defineProps,
  h,
  onMounted,
  PropType,
  ref,
  toRefs,
  watch,
} from 'vue';

import Lang from '@/components/atoms/Lang.vue';
import ELevel from '@/enums/modules/salary/level';
import lang from '@/helpers/lang';
import ISalaryForm from '@/interfaces/modules/salary/salaryForm';
import ISorts from '@/interfaces/molecules/table/sorts';
import profession from '@/store/profession';

const formRef = ref<FormInstance>();

const props = defineProps({
  value: {
    type: Object as PropType<ISalaryForm>,
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
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
const { Option } = Select;

const loadingSelects = ref(true);

const readProfessions = profession().read;
const professionData = storeToRefs(profession());
const professionItems = professionData.items;

const emit = defineEmits({
  'update:value': (_: ISalaryForm) => true,
  submit: (_: ISalaryForm, __?: FormInstance) => true,
  reset: (_?: FormInstance) => true,
});

const form = ref(value.value);

onMounted(async (): Promise<void> => {
  loadingSelects.value = true;

  try {
    await readProfessions(null, null, { name: 'ASC' } as ISorts);
  } catch (error: Error | any) {
    notification.open({
      icon: () => h(MehOutlined, { style: 'color: #ff0000' }),
      message: lang('dashboard.error'),
      description: error.message,
      style: {
        color: '#ff0000',
      },
    });
  }

  loadingSelects.value = false;
});

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
