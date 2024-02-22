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
            :label="lang('section.nameField')"
            name="name"
            has-feedback
            :rules="[{ required: true, type: 'string', max: 191 }]"
          >
            <Input
              v-model:value="form.name"
            />
          </Item>
          <Item
            :label="lang('section.level')"
            name="levels"
            has-feedback
            :rules="[{ required: false }]"
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
            :label="lang('section.free')"
            name="free"
            has-feedback
          >
            <Switch v-model:checked="form.free" />
          </Item>
          <Divider />
          <Item
            :label="lang('section.type')"
            name="item_type_1"
            has-feedback
            :rules="[{ required: true }]"
          >
            <Select
              v-model:value="form.item_type_1"
              :options="types"
              allow-clear
              @change="onChangeType(0)"
            />
          </Item>
          <Item
            :label="lang('section.nameType')"
            name="item_id_1"
            has-feedback
            :rules="[{ required: true }]"
          >
            <Select
              v-model:value="form.item_id_1"
              :options="typeIds[0]"
              allow-clear
              show-search
              :filter-option="filterOption"
              :loading="loadingSelectItemId[0]"
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
            :label="lang('section.title')"
            name="title_template"
            has-feedback
            :rules="[{ type: 'string', max: 500 }]"
          >
            <Input v-model:value="form.title" />
          </Item>
          <Item
            :label="lang('section.description')"
            name="description_template"
            has-feedback
            :rules="[{ type: 'string', max: 1000 }]"
            :extra="form.description"
          >
            <Input v-model:value="form.description" />
          </Item>
          <Item
            :label="lang('section.keywords')"
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
        :tab="lang('section.text')"
      >
        <Ckeditor
          v-model:value="form.text"
          name="text"
          class="mb-30"
        />
      </TabPane>
      <TabPane
        key="additional"
        :tab="lang('section.additional')"
      >
        <Ckeditor
          v-model:value="form.additional"
          name="additional"
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
import type { FormInstance, SelectProps } from 'ant-design-vue';
import Alert from 'ant-design-vue/lib/alert';
import Button from 'ant-design-vue/lib/button';
import Divider from 'ant-design-vue/lib/divider';
import Form from 'ant-design-vue/lib/form';
import Input from 'ant-design-vue/lib/input';
import notification from 'ant-design-vue/lib/notification';
import Radio from 'ant-design-vue/lib/radio';
import Select from 'ant-design-vue/lib/select';
import Space from 'ant-design-vue/lib/space';
import Switch from 'ant-design-vue/lib/switch';
import Tabs from 'ant-design-vue/lib/tabs';
import {
  h,
  PropType,
  ref,
  toRefs,
  watch,
} from 'vue';

import Lang from '@/components/atoms/Lang.vue';
import Ckeditor from '@/components/molecules/Ckeditor.vue';
import ELevel from '@/enums/modules/salary/level';
import lang from '@/helpers/lang';
import ISectionForm from '@/interfaces/modules/section/sectionForm';
import ISorts from '@/interfaces/molecules/table/sorts';
import category from '@/stores/category';
import direction from '@/stores/direction';
import profession from '@/stores/profession';
import school from '@/stores/school';
import skill from '@/stores/skill';
import teacher from '@/stores/teacher';
import tool from '@/stores/tool';
import TAlert from '@/types/alert';

const formRef = ref<FormInstance>();

const props = defineProps({
  value: {
    type: Object as PropType<ISectionForm>,
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
const { Option } = Select;

const emit = defineEmits({
  'update:value': (_: ISectionForm) => true,
  submit: (_: ISectionForm, __?: FormInstance) => true,
  reset: (_?: FormInstance) => true,
});

const types = ref<SelectProps['options']>([
  {
    value: 'direction',
    label: lang('section.direction'),
  },
  {
    value: 'category',
    label: lang('section.category'),
  },
  {
    value: 'profession',
    label: lang('section.profession'),
  },
  {
    value: 'school',
    label: lang('section.school'),
  },
  {
    value: 'skill',
    label: lang('section.skill'),
  },
  {
    value: 'teacher',
    label: lang('section.teacher'),
  },
  {
    value: 'tool',
    label: lang('section.tool'),
  },
]);

const form = ref<ISectionForm>(value.value);
const typeIds = ref<Array<SelectProps['options']>>([[], []]);
const loadingSelectItemId = ref<Array<boolean>>([false, false]);

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

const onChangeType = async (index: number): Promise<void> => {
  try {
    if (form.value.item_type_1 === 'direction') {
      const readDirections = direction().read;

      typeIds.value[index] = [];
      loadingSelectItemId.value[index] = true;
      const response = await readDirections(null, null, { weight: 'ASC' } as ISorts);
      typeIds.value[index] = response.data.map((itm) => ({
        value: itm.id,
        label: itm.name,
      }));
      loadingSelectItemId.value[index] = false;
    } else if (form.value.item_type_1 === 'category') {
      const readCategories = category().read;

      typeIds.value[index] = [];
      loadingSelectItemId.value[index] = true;
      const response = await readCategories(null, null, { name: 'ASC' } as ISorts);
      typeIds.value[index] = response.data.map((itm) => ({
        value: itm.id,
        label: itm.name,
      }));
      loadingSelectItemId.value[index] = false;
    } else if (form.value.item_type_1 === 'profession') {
      const readProfessions = profession().read;

      typeIds.value[index] = [];
      loadingSelectItemId.value[index] = true;
      const response = await readProfessions(null, null, { name: 'ASC' } as ISorts);
      typeIds.value[index] = response.data.map((itm) => ({
        value: itm.id,
        label: itm.name,
      }));
      loadingSelectItemId.value[index] = false;
    } else if (form.value.item_type_1 === 'school') {
      const readSchools = school().read;

      typeIds.value[index] = [];
      loadingSelectItemId.value[index] = true;
      const response = await readSchools(null, null, { name: 'ASC' } as ISorts);
      typeIds.value[index] = response.data.map((itm) => ({
        value: itm.id,
        label: itm.name,
      }));
      loadingSelectItemId.value[index] = false;
    } else if (form.value.item_type_1 === 'skill') {
      const readSkills = skill().read;

      typeIds.value[index] = [];
      loadingSelectItemId.value[index] = true;
      const response = await readSkills(null, null, { name: 'ASC' } as ISorts);
      typeIds.value[index] = response.data.map((itm) => ({
        value: itm.id,
        label: itm.name,
      }));
      loadingSelectItemId.value[index] = false;
    } else if (form.value.item_type_1 === 'teacher') {
      const readTeachers = teacher().read;

      typeIds.value[index] = [];
      loadingSelectItemId.value[index] = true;
      const response = await readTeachers(null, null, { name: 'ASC' } as ISorts);
      typeIds.value[index] = response.data.map((itm) => ({
        value: itm.id,
        label: itm.name,
      }));
      loadingSelectItemId.value[index] = false;
    } else if (form.value.item_type_1 === 'tool') {
      const readTools = tool().read;

      typeIds.value[index] = [];
      loadingSelectItemId.value[index] = true;
      const response = await readTools(null, null, { name: 'ASC' } as ISorts);
      typeIds.value[index] = response.data.map((itm) => ({
        value: itm.id,
        label: itm.name,
      }));
      loadingSelectItemId.value[index] = false;
    }
  } catch (error: Error | any) {
    notification.open({
      icon: () => h(MehOutlined, { style: 'color: #ff0000' }),
      message: lang('dashboard.error'),
      description: error.message,
      style: {
        color: '#ff0000',
      },
    });

    throw error;
  }
};

const filterOption = (input: string, option: any) => option
  ?.label
  ?.toLowerCase()
  ?.indexOf(input.toLowerCase()) >= 0;
</script>
