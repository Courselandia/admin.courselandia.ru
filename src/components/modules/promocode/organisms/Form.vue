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
        :label="lang('promocode.school')"
        name="school_id"
        has-feedback
        :rules="[{ required: true }]"
      >
        <Select
          v-model:value="form.school_id"
          label-in-value
          class="width--wide"
          show-search
          :filter-option="filterOption"
          :options="schoolItems?.map((itm) => ({ value: itm.id, label: itm.name }))"
          :loading="loadingSelects"
        />
      </Item>
      <Item
        :label="lang('promocode.code')"
        name="code"
        has-feedback
        :rules="[{ required: true, type: 'string', max: 191 }]"
      >
        <Input
          v-model:value="form.code"
        />
      </Item>
      <Item
        :label="lang('promocode.title')"
        name="title"
        has-feedback
        :rules="[{ required: true, type: 'string', max: 191 }]"
      >
        <Input
          v-model:value="form.title"
        />
      </Item>
      <Item
        :label="lang('promocode.description')"
        name="description"
        has-feedback
        :rules="[{ required: false, type: 'string', max: 65000 }]"
      >
        <Input
          v-model:value="form.description"
        />
      </Item>
      <Item
        :label="lang('promocode.min_price')"
        name="min_price"
        has-feedback
        :rules="[{ required: false, type: 'number', min: 0, max: 9999999 }]"
      >
        <InputNumber
          v-model:value="form.min_price"
          class="width--wide"
        />
      </Item>
      <Item
        :label="lang('promocode.discount')"
        name="discount"
        has-feedback
        :rules="[{ required: false, type: 'number', min: 0, max: 9999999 }]"
      >
        <InputNumber
          v-model:value="form.discount"
          class="width--wide"
        />
      </Item>
      <Item
        :label="lang('promocode.discountType')"
        name="discount_type"
        :rules="[{ required: false }]"
      >
        <Select
          v-model:value="form.discount_type"
          allow-clear
        >
          <Option :value="EDiscountType.PERCENT">
            <Lang value="promocode.percent" />
          </Option>
          <Option :value="EDiscountType.RUB">
            <Lang value="promocode.rub" />
          </Option>
        </Select>
      </Item>
      <Item
        :label="lang('promocode.dateStart')"
        name="date_start"
        has-feedback
        :rules="[{ required: false }]"
      >
        <DatePicker
          v-model:value="form.date_start"
          format="DD.MM.YYYY"
          show-time
          style="width: 100%"
        />
      </Item>
      <Item
        :label="lang('promocode.dateEnd')"
        name="date_end"
        has-feedback
        :rules="[{ required: false }]"
      >
        <DatePicker
          v-model:value="form.date_end"
          format="DD.MM.YYYY"
          show-time
          style="width: 100%"
        />
      </Item>
      <Item
        :label="lang('promocode.type')"
        name="type"
        :rules="[{ required: false }]"
      >
        <Select
          v-model:value="form.type"
          allow-clear
        >
          <Option :value="EType.DISCOUNT">
            <Lang value="promocode.discount" />
          </Option>
          <Option :value="EType.PRESENT">
            <Lang value="promocode.present" />
          </Option>
        </Select>
      </Item>
      <Item
        :label="lang('promocode.url')"
        name="url"
        has-feedback
        :rules="[{ required: false, type: 'string', max: 191 }]"
      >
        <Input
          v-model:value="form.url"
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
import DatePicker from 'ant-design-vue/lib/date-picker';
import Form from 'ant-design-vue/lib/form';
import Input from 'ant-design-vue/lib/input';
import InputNumber from 'ant-design-vue/lib/input-number';
import notification from 'ant-design-vue/lib/notification';
import Radio from 'ant-design-vue/lib/radio';
import Select from 'ant-design-vue/lib/select';
import Space from 'ant-design-vue/lib/space';
import { storeToRefs } from 'pinia';
import {
  h,
  onMounted,
  PropType,
  ref,
  toRefs,
  watch,
} from 'vue';

import Lang from '@/components/atoms/Lang.vue';
import EDiscountType from '@/enums/modules/promocode/discountType';
import EType from '@/enums/modules/promocode/type';
import lang from '@/helpers/lang';
import IPromocodeForm from '@/interfaces/modules/promocode/promocodeForm';
import ISorts from '@/interfaces/molecules/table/sorts';
import school from '@/stores/school';
import TAlert from '@/types/alert';

const formRef = ref<FormInstance>();

const props = defineProps({
  value: {
    type: Object as PropType<IPromocodeForm>,
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

const loadingSelects = ref(true);

const readSchools = school().read;
const schoolData = storeToRefs(school());
const schoolItems = schoolData.items;

const emit = defineEmits({
  'update:value': (_: IPromocodeForm) => true,
  submit: (_: IPromocodeForm, __?: FormInstance) => true,
  reset: (_?: FormInstance) => true,
});

const form = ref<IPromocodeForm>(value.value);

onMounted(async (): Promise<void> => {
  loadingSelects.value = true;

  try {
    await readSchools(null, null, { name: 'ASC' } as ISorts);
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
