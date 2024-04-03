<template>
  <Row :gutter="[20, 20]">
    <Col
      :xxxl="16"
      :xxl="16"
      :xl="24"
      :lg="24"
      :md="24"
      :sm="24"
      :xs="24"
      class="mb-20"
    >
      <Card>
        <template #title>
          <div ref="titleRef">
            <Lang value="collection.addCollection" />
          </div>
        </template>

        <Alert
          v-if="alert.message"
          :message="alert.type === 'success'
            ? lang('dashboard.success')
            : lang('dashboard.error')"
          :description="alert.message"
          :type="alert.type"
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
                  :label="lang('collection.direction')"
                  name="direction_id"
                  has-feedback
                  :rules="[{ required: true }]"
                >
                  <Select
                    v-model:value="form.direction_id"
                    label-in-value
                    class="width--wide"
                    show-search
                    :filter-option="filterOption"
                    :options="directionItems?.map((itm) => ({ value: itm.id, label: itm.name }))"
                    :loading="loadingSelects"
                  />
                </Item>
                <Item
                  :label="lang('collection.nameField')"
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
                  :label="lang('collection.link')"
                  name="link"
                  has-feedback
                  :rules="[{ required: true, type: 'string', max: 191, pattern: alphaDash }]"
                >
                  <Input v-model:value="form.link" />
                </Item>
                <Item
                  :label="lang('collection.amount')"
                  name="amount"
                  has-feedback
                  :rules="[{ required: true, type: 'number', min: 1, max: 99 }]"
                >
                  <InputNumber
                    v-model:value="form.amount"
                    class="width--wide"
                  />
                </Item>
                <Item
                  :label="lang('collection.sort')"
                  name="sort"
                  has-feedback
                  :rules="[{ required: true }]"
                >
                  <Select
                    v-model:value="form.sort"
                    :options="sorts"
                  />
                </Item>
              </div>
            </TabPane>
            <TabPane
              key="filters"
              :tab="lang('collection.filters')"
            >
              <div class="width--wide max--width-600">
                <Item
                  :label="lang('collection.rating')"
                  name="rating"
                  has-feedback
                  :rules="[{ required: false }]"
                >
                  <Select
                    v-model:value="form.filters.rating"
                    allow-clear
                  >
                    <Option :value="4.5">
                      <Lang value="collection.rating-4-5" />
                    </Option>
                    <Option :value="4">
                      <Lang value="collection.rating-4" />
                    </Option>
                    <Option :value="3.5">
                      <Lang value="collection.rating-3-5" />
                    </Option>
                    <Option :value="3">
                      <Lang value="collection.rating-3" />
                    </Option>
                  </Select>
                </Item>
                <Item
                  :label="lang('collection.price')"
                  name="price"
                  has-feedback
                  :rules="[{ required: false }]"
                >
                  <Slider
                    v-model:value="form.filters.price"
                    range
                    :tip-formatter="(val) => money(val || 0, 0, 'руб.')"
                    :min="0"
                    :max="1000000"
                    :step="1000"
                  />
                </Item>
                <Item
                  :label="lang('collection.duration')"
                  name="duration"
                  has-feedback
                  :rules="[{ required: false }]"
                >
                  <Slider
                    v-model:value="form.filters.duration"
                    range
                    :tip-formatter="(val) => val + ' ' + getLabelDuration(val || 0)"
                    :min="0"
                    :max="50"
                    :step="1"
                  />
                </Item>
                <Item
                  :label="lang('collection.credit')"
                  name="credit"
                  has-feedback
                >
                  <Switch v-model:checked="form.filters.credit" />
                </Item>
                <Item
                  :label="lang('collection.free')"
                  name="free"
                  has-feedback
                >
                  <Switch v-model:checked="form.filters.free" />
                </Item>
                <Item
                  :label="lang('collection.schools')"
                  name="schools"
                  has-feedback
                  :rules="[{ required: false }]"
                >
                  <Select
                    v-model:value="form.filters['school-id']"
                    label-in-value
                    mode="multiple"
                    class="width--wide"
                    show-search
                    :filter-option="filterOption"
                    :options="schoolItems?.map((itm) => ({ value: itm.id, label: itm.name }))"
                    :loading="loadingSelects"
                  />
                </Item>
                <Item
                  :label="lang('collection.categories')"
                  name="categories"
                  has-feedback
                  :rules="[{ required: false }]"
                >
                  <Select
                    v-model:value="form.filters['categories-id']"
                    label-in-value
                    mode="multiple"
                    class="width--wide"
                    show-search
                    :filter-option="filterOption"
                    :options="categoryItems?.map((itm) => ({ value: itm.id, label: itm.name }))"
                    :loading="loadingSelects"
                  />
                </Item>
                <Item
                  :label="lang('collection.professions')"
                  name="professions"
                  has-feedback
                  :rules="[{ required: false }]"
                >
                  <Select
                    v-model:value="form.filters['professions-id']"
                    label-in-value
                    mode="multiple"
                    class="width--wide"
                    show-search
                    :filter-option="filterOption"
                    :options="professionItems?.map((itm) => ({ value: itm.id, label: itm.name }))"
                    :loading="loadingSelects"
                  />
                </Item>
                <Item
                  :label="lang('collection.teachers')"
                  name="teachers"
                  has-feedback
                  :rules="[{ required: false }]"
                >
                  <Select
                    v-model:value="form.filters['teachers-id']"
                    label-in-value
                    mode="multiple"
                    class="width--wide"
                    show-search
                    :filter-option="filterOption"
                    :options="teacherItems?.map((itm) => ({ value: itm.id, label: itm.name }))"
                    :loading="loadingSelects"
                  />
                </Item>
                <Item
                  :label="lang('collection.skills')"
                  name="skills"
                  has-feedback
                  :rules="[{ required: false }]"
                >
                  <Select
                    v-model:value="form.filters['skills-id']"
                    label-in-value
                    mode="multiple"
                    class="width--wide"
                    show-search
                    :filter-option="filterOption"
                    :options="skillItems?.map((itm) => ({ value: itm.id, label: itm.name }))"
                    :loading="loadingSelects"
                  />
                </Item>
                <Item
                  :label="lang('collection.tools')"
                  name="tools"
                  has-feedback
                  :rules="[{ required: false }]"
                >
                  <Select
                    v-model:value="form.filters['tools-id']"
                    label-in-value
                    mode="multiple"
                    class="width--wide"
                    show-search
                    :filter-option="filterOption"
                    :options="toolItems?.map((itm) => ({ value: itm.id, label: itm.name }))"
                    :loading="loadingSelects"
                  />
                </Item>
                <Item
                  :label="lang('collection.format')"
                  name="online"
                  has-feedback
                  :rules="[{ required: false }]"
                >
                  <Select
                    v-model:value="form.filters.online"
                    allow-clear
                  >
                    <Option :value="1">
                      <Lang value="collection.online" />
                    </Option>
                    <Option :value="0">
                      <Lang value="collection.offline" />
                    </Option>
                  </Select>
                </Item>
                <Item
                  :label="lang('collection.levels')"
                  name="levels"
                  has-feedback
                  :rules="[{ required: false }]"
                >
                  <Select
                    v-model:value="form.filters['levels-level']"
                    mode="multiple"
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
              </div>
            </TabPane>
            <TabPane
              key="meta"
              :tab="lang('dashboard.meta')"
            >
              <div class="width--wide max--width-600">
                <Item
                  :label="lang('collection.title')"
                  name="title"
                  has-feedback
                  :rules="[{ type: 'string', max: 500 }]"
                >
                  <Input v-model:value="form.title" />
                </Item>
                <Item
                  :label="lang('collection.description')"
                  name="description"
                  has-feedback
                  :rules="[{ type: 'string', max: 1000 }]"
                >
                  <Input v-model:value="form.description" />
                </Item>
                <Item
                  :label="lang('collection.keywords')"
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
              :tab="lang('collection.text')"
            >
              <Ckeditor
                v-model:value="form.text"
                name="article"
                class="mb-30"
              />
            </TabPane>
            <TabPane
              key="additional"
              :tab="lang('collection.additional')"
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
                  <Lang value="dashboard.create" />
                </span>
              </Button>
              <Button
                html-type="reset"
                @click="onClickReset"
              >
                <Lang value="dashboard.reset" />
              </Button>
            </Space>
          </Item>
        </Form>
      </Card>
    </Col>
    <Col
      :xxxl="8"
      :xxl="8"
      :xl="24"
      :lg="24"
      :md="24"
      :sm="24"
      :xs="24"
      class="mb-20"
    >
      <Card>
        <template #title>
          <Lang value="dashboard.image" />
        </template>
        <template
          v-if="image"
          #extra
        >
          <Button
            danger
            @click="onClickImageDestroy"
          >
            <template #icon>
              <DeleteOutlined />
            </template>
            <span>
              <Lang value="dashboard.destroy" />
            </span>
          </Button>
        </template>

        <Upload
          :max-count="1"
          :multiple="false"
          :before-upload="onBeforeUploadFile"
          :show-upload-list="false"
          name="file"
          accept="image/*"
          list-type="picture-card"
        >
          <img
            v-if="image"
            :src="image"
            alt="avatar"
            width="208"
          >
          <div v-else>
            <PlusOutlined />
            <div class="ant-upload-text">
              <Lang value="dashboard.upload" />
            </div>
          </div>
        </Upload>
      </Card>
    </Col>
  </Row>
</template>

<script lang="ts" setup>
import {
  DeleteOutlined,
  ExclamationCircleOutlined,
  MehOutlined,
  PlusOutlined,
} from '@ant-design/icons-vue';
import type { FormInstance } from 'ant-design-vue';
import Alert from 'ant-design-vue/lib/alert';
import Button from 'ant-design-vue/lib/button';
import Card from 'ant-design-vue/lib/card';
import Col from 'ant-design-vue/lib/col';
import Form from 'ant-design-vue/lib/form';
import Input from 'ant-design-vue/lib/input';
import InputNumber from 'ant-design-vue/lib/input-number';
import Modal from 'ant-design-vue/lib/modal';
import notification from 'ant-design-vue/lib/notification';
import Radio from 'ant-design-vue/lib/radio';
import Row from 'ant-design-vue/lib/row';
import Select from 'ant-design-vue/lib/select';
import Slider from 'ant-design-vue/lib/slider';
import Space from 'ant-design-vue/lib/space';
import Switch from 'ant-design-vue/lib/switch';
import Tabs from 'ant-design-vue/lib/tabs';
import Upload from 'ant-design-vue/lib/upload';
import { storeToRefs } from 'pinia';
import {
  createVNode,
  h,
  onMounted,
  ref,
} from 'vue';
import { useMeta } from 'vue-meta';

import Lang from '@/components/atoms/Lang.vue';
import Ckeditor from '@/components/molecules/Ckeditor.vue';
import ECourseSort from '@/enums/modules/collection/courseSort';
import ELevel from '@/enums/modules/salary/level';
import base64 from '@/helpers/base64';
import { latin } from '@/helpers/format';
import lang from '@/helpers/lang';
import { money } from '@/helpers/number';
import ICollectionForm from '@/interfaces/modules/collection/collectionForm';
import IAlert from '@/interfaces/molecules/alert/alert';
import IOption from '@/interfaces/molecules/select/option';
import ISorts from '@/interfaces/molecules/table/sorts';
import category from '@/stores/category';
import collection from '@/stores/collection';
import direction from '@/stores/direction';
import profession from '@/stores/profession';
import school from '@/stores/school';
import skill from '@/stores/skill';
import teacher from '@/stores/teacher';
import tool from '@/stores/tool';

useMeta({
  title: lang('collection.createCollection'),
});

const { Item } = Form;
const { Option } = Select;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
const { TabPane } = Tabs;
const { create } = collection();

const formRef = ref<FormInstance>();
const titleRef = ref<HTMLElement|null>();
const loading = ref(false);
const image = ref<string>();
const alphaDash = /^[A-Za-z0-9_-]*$/;

const alert = ref<IAlert>({
  message: null,
  type: undefined,
});

const form = ref<ICollectionForm>({
  direction_id: undefined,
  name: undefined,
  amount: undefined,
  link: undefined,
  text: undefined,
  additional: undefined,
  image: undefined,
  title: undefined,
  description: undefined,
  keywords: undefined,
  status: true,
  sort: [
    {
      value: ECourseSort.ALPHABETIC,
      label: 'По алфавиту',
    },
  ],
  filters: {
    'school-id': [],
    'categories-id': [],
    'professions-id': [],
    'teachers-id': [],
    'skills-id': [],
    'levels-level': [],
    online: [],
    rating: [],
    credit: undefined,
    free: undefined,
    price: [0, 1000000],
    duration: [0, 50],
  },
});

const onClickReset = (): void => {
  formRef.value?.resetFields();
  form.value.image = undefined;
  form.value.text = undefined;
  form.value.additional = undefined;
  image.value = '';
};

const onSubmit = async (): Promise<void> => {
  alert.value.message = '';
  loading.value = true;

  try {
    await create(form.value);

    alert.value.message = lang('dashboard.successCreateText');
    alert.value.type = 'success';
    form.value.image = undefined;
    form.value.text = undefined;
    form.value.additional = undefined;
    image.value = '';
    onClickReset();
  } catch (error: Error | any) {
    alert.value.message = error.response.data.message
      ? error.response.data.message
      : error.message;
    alert.value.type = 'error';
  }

  if (titleRef.value) {
    titleRef.value.scrollIntoView({ behavior: 'smooth' });
  }

  loading.value = false;
};

const onBeforeUploadFile = async (file: File): Promise<boolean> => {
  form.value.image = file;
  image.value = await base64(file) as string || '';

  return false;
};

const onClickImageDestroy = async (): Promise<void> => {
  Modal.confirm({
    title: lang('dashboard.alert'),
    icon: createVNode(ExclamationCircleOutlined),
    content: lang('dashboard.confirmDestroyImage'),
    async onOk() {
      form.value.image = undefined;
      image.value = '';
    },
  });
};

const onChangeName = () => {
  form.value.link = latin(form.value.name || '');
};

const filterOption = (input: string, option: any) => option
  ?.label
  ?.toLowerCase()
  ?.indexOf(input.toLowerCase()) >= 0;

const loadingSelects = ref(true);

const readSchools = school().read;
const schoolData = storeToRefs(school());
const schoolItems = schoolData.items;

const readDirections = direction().read;
const directionData = storeToRefs(direction());
const directionItems = directionData.items;

const readProfessions = profession().read;
const professionData = storeToRefs(profession());
const professionItems = professionData.items;

const readCategories = category().read;
const categoryData = storeToRefs(category());
const categoryItems = categoryData.items;

const readSkills = skill().read;
const skillData = storeToRefs(skill());
const skillItems = skillData.items;

const readTeachers = teacher().read;
const teacherData = storeToRefs(teacher());
const teacherItems = teacherData.items;

const readTools = tool().read;
const toolData = storeToRefs(tool());
const toolItems = toolData.items;

onMounted(async (): Promise<void> => {
  loadingSelects.value = true;

  try {
    await readSchools(null, null, { name: 'ASC' } as ISorts);
    await readDirections(null, null, { weight: 'ASC' } as ISorts);
    await readProfessions(null, null, { name: 'ASC' } as ISorts);
    await readCategories(null, null, { name: 'ASC' } as ISorts);
    await readSkills(null, null, { name: 'ASC' } as ISorts);
    await readTeachers(null, null, { name: 'ASC' } as ISorts);
    await readTools(null, null, { name: 'ASC' } as ISorts);
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

const getLabelDuration = (val: number) => {
  if (val === 0) {
    return lang('collection.month0');
  }

  if (val === 1) {
    return lang('collection.month1');
  }

  if (val >= 2 && val <= 4) {
    return lang('collection.month2');
  }

  return lang('collection.month3');
};

const sorts: Array<IOption> = [
  {
    value: ECourseSort.ALPHABETIC,
    label: lang('collection.sortAlphabetic'),
  },
  {
    value: ECourseSort.DATE,
    label: lang('collection.sortDate'),
  },
  {
    value: ECourseSort.RATING,
    label: lang('collection.sortRating'),
  },
  {
    value: ECourseSort.PRICE_ASC,
    label: lang('collection.sortPriceAsc'),
  },
  {
    value: ECourseSort.PRICE_DESC,
    label: lang('collection.sortPriceDesc'),
  },
];
</script>

<style>
.ant-upload.ant-upload-select-picture-card {
  width: 208px !important;
  height: 208px !important;
}
</style>
