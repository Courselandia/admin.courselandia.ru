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
            :label="lang('category.nameField')"
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
            :label="lang('category.header')"
            name="header"
            has-feedback
            :rules="[{ required: true, type: 'string', max: 191 }]"
          >
            <Input v-model:value="form.header" />
          </Item>
          <Item
            :label="lang('category.link')"
            name="link"
            has-feedback
            :rules="[{ required: true, type: 'string', max: 191, pattern: alphaDash }]"
          >
            <Input v-model:value="form.link" />
          </Item>
          <Item
            :label="lang('category.directions')"
            name="directions"
            has-feedback
          >
            <Select
              v-model:value="form.directions"
              label-in-value
              mode="multiple"
              class="width--wide"
              show-search
              :filter-option="filterOption"
              :options="directionItems?.map((itm) => ({ value: itm.id, label: itm.name }))"
              :loading="loadingSelects"
            />
          </Item>
          <Item
            :label="lang('category.professions')"
            name="professions"
            has-feedback
          >
            <Select
              v-model:value="form.professions"
              label-in-value
              mode="multiple"
              class="width--wide"
              show-search
              :filter-option="filterOption"
              :options="professionItems?.map((itm) => ({ value: itm.id, label: itm.name }))"
              :loading="loadingSelects"
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
            :label="lang('category.title')"
            name="title"
            has-feedback
            :rules="[{ type: 'string', max: 500 }]"
          >
            <Input v-model:value="form.title" />
          </Item>
          <Item
            :label="lang('category.description')"
            name="description"
            has-feedback
            :rules="[{ type: 'string', max: 1000 }]"
          >
            <Input v-model:value="form.description" />
          </Item>
          <Item
            :label="lang('category.keywords')"
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
        :tab="lang('category.text')"
      >
        <Ckeditor
          v-model:value="form.text"
          name="text"
          class="mb-30"
        />
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
import { MehOutlined } from '@ant-design/icons-vue';
import type { FormInstance } from 'ant-design-vue';
import Alert from 'ant-design-vue/lib/alert';
import Button from 'ant-design-vue/lib/button';
import Form from 'ant-design-vue/lib/form';
import Input from 'ant-design-vue/lib/input';
import notification from 'ant-design-vue/lib/notification';
import Radio from 'ant-design-vue/lib/radio';
import Select from 'ant-design-vue/lib/select';
import Space from 'ant-design-vue/lib/space';
import Tabs from 'ant-design-vue/lib/tabs';
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
import Ckeditor from '@/components/molecules/Ckeditor.vue';
import { latin } from '@/helpers/format';
import lang from '@/helpers/lang';
import ICategoryForm from '@/interfaces/modules/category/categoryForm';
import ISorts from '@/interfaces/molecules/table/sorts';
import direction from '@/store/direction';
import profession from '@/store/profession';

const formRef = ref<FormInstance>();

const props = defineProps({
  value: {
    type: Object as PropType<ICategoryForm>,
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
const { TabPane } = Tabs;

const loadingSelects = ref(true);
const readDirections = direction().read;
const directionData = storeToRefs(direction());
const directionItems = directionData.items;

const readProfessions = profession().read;
const professionData = storeToRefs(profession());
const professionItems = professionData.items;

onMounted(async (): Promise<void> => {
  loadingSelects.value = true;

  try {
    await readDirections(null, null, { weight: 'ASC' } as ISorts);
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

const emit = defineEmits({
  'update:value': (_: ICategoryForm) => true,
  submit: (_: ICategoryForm, __?: FormInstance) => true,
  reset: (_?: FormInstance) => true,
});

const form = ref(value.value);
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
  form.value.link = latin(form.value.name);
};

const filterOption = (input: string, option: any) => option
  ?.label
  ?.toLowerCase()
  ?.indexOf(input.toLowerCase()) >= 0;
</script>
