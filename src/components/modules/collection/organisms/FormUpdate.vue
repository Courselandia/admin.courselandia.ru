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
            <Lang value="collection.updateCollection" />
          </div>
        </template>

        <template #extra>
          <template
            v-if="countCoursesLoading"
          >
            <Spin />
          </template>
          <template
            v-else
          >
            Количество курсов: {{ countCourses }} шт.
          </template>
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
                    @change="setCountCourses"
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
                    label-in-value
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
                    label-in-value
                    @change="setCountCourses"
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
                    @after-change="setCountCourses"
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
                    @after-change="setCountCourses"
                  />
                </Item>
                <Item
                  :label="lang('collection.credit')"
                  name="credit"
                  has-feedback
                >
                  <Switch
                    v-model:checked="form.filters.credit"
                    @change="setCountCourses"
                  />
                </Item>
                <Item
                  :label="lang('collection.free')"
                  name="free"
                  has-feedback
                >
                  <Switch
                    v-model:checked="form.filters.free"
                    @change="setCountCourses"
                  />
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
                    @change="setCountCourses"
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
                    @change="setCountCourses"
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
                    @change="setCountCourses"
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
                    @change="setCountCourses"
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
                    @change="setCountCourses"
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
                    @change="setCountCourses"
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
                    label-in-value
                    @change="setCountCourses"
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
                    label-in-value
                    @change="setCountCourses"
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
                  <Input
                    v-model:value="form.title"
                  />
                </Item>
                <Item
                  :label="lang('collection.description')"
                  name="description"
                  has-feedback
                  :rules="[{ type: 'string', max: 1000 }]"
                >
                  <Input
                    v-model:value="form.description"
                  />
                </Item>
                <Item
                  :label="lang('collection.keywords')"
                  name="keywords"
                  has-feedback
                  :rules="[{ type: 'string', max: 1000 }]"
                >
                  <Input
                    v-model:value="form.keywords"
                  />
                </Item>
              </div>
            </TabPane>
            <TabPane
              key="text"
              :tab="lang('collection.text')"
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
                  category="collection.text"
                />
              </div>
              <Item
                :wrapper-col="{offset: 0, span: 19}"
                name="remember"
                class="buttons-flex"
              >
                <Checkbox
                  v-model:checked="form.copied"
                >
                  <Lang value="collection.copied" />
                </Checkbox>
              </Item>
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
                  <Lang value="dashboard.update" />
                </span>
              </Button>
              <Button
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

        <Alert
          v-if="imageAlert.message"
          :message="imageAlert.type === 'success'
            ? lang('dashboard.success')
            : lang('dashboard.error')"
          :description="imageAlert.message"
          :type="imageAlert.type"
          class="mb-25"
        />

        <Upload
          :max-count="1"
          :multiple="false"
          :before-upload="onBeforeUploadFile"
          :show-upload-list="false"
          name="file"
          accept="image/*"
          list-type="picture-card"
        >
          <LoadingOutlined v-if="imageUpdateLoading" />
          <img
            v-else-if="image"
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
  LoadingOutlined,
  MehOutlined,
  PlusOutlined, SisternodeOutlined,
} from '@ant-design/icons-vue';
import type { FormInstance } from 'ant-design-vue';
import Alert from 'ant-design-vue/lib/alert';
import Button from 'ant-design-vue/lib/button';
import Card from 'ant-design-vue/lib/card';
import Checkbox from 'ant-design-vue/lib/checkbox';
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
import Spin from 'ant-design-vue/lib/spin';
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
import { useRoute } from 'vue-router';

import Lang from '@/components/atoms/Lang.vue';
import Info from '@/components/modules/analyzer/organisms/Info.vue';
import Ckeditor from '@/components/molecules/Ckeditor.vue';
import ECourseSort from '@/enums/modules/collection/courseSort';
import ELevel from '@/enums/modules/salary/level';
import base64 from '@/helpers/base64';
import { latin } from '@/helpers/format';
import lang from '@/helpers/lang';
import { money } from '@/helpers/number';
import ICollectionForm from '@/interfaces/modules/collection/collectionForm';
import IFilter from '@/interfaces/modules/collection/filter';
import IFiltersForm from '@/interfaces/modules/collection/filtersForm';
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
import TId from '@/types/id';

useMeta({
  title: lang('collection.updateCollection'),
});

const route = useRoute();
const imageUpdateLoading = ref(false);
const imageDestroyLoading = ref(false);
const { id } = route.params;
const { Item } = Form;
const { Option } = Select;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
const { TabPane } = Tabs;
const {
  update,
  count,
  imageUpdate,
  imageDestroy,
} = collection();
const { item } = storeToRefs(collection());

const formRef = ref<FormInstance>();
const titleRef = ref<HTMLElement|null>();
const loading = ref(false);
const countCoursesLoading = ref(true);
const image = ref<string>(item.value?.image_middle_id?.path || '');
const alphaDash = /^[A-Za-z0-9_-]*$/;
const countCourses = ref(0);

const alert = ref<IAlert>({
  message: null,
  type: undefined,
});

const imageAlert = ref<IAlert>({
  message: null,
  type: undefined,
});

const getSort = (sortField?: string, sortDirection?: string): IOption => {
  if (sortField === 'name' && sortDirection === 'ASC') {
    return {
      value: ECourseSort.ALPHABETIC,
      label: lang('collection.sortAlphabetic'),
    };
  }

  if (sortField === 'id' && sortDirection === 'DESC') {
    return {
      value: ECourseSort.DATE,
      label: lang('collection.sortDate'),
    };
  }

  if (sortField === 'rating' && sortDirection === 'DESC') {
    return {
      value: ECourseSort.RATING,
      label: lang('collection.sortRating'),
    };
  }

  if (sortField === 'price' && sortDirection === 'ASC') {
    return {
      value: ECourseSort.PRICE_ASC,
      label: lang('collection.sortPriceAsc'),
    };
  }

  if (sortField === 'price' && sortDirection === 'DESC') {
    return {
      value: ECourseSort.PRICE_ASC,
      label: lang('collection.sortPriceDesc'),
    };
  }

  return {
    value: ECourseSort.ALPHABETIC,
    label: 'По алфавиту',
  };
};

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

const getKeyFilter = (name: string, idFilter: TId): string | null => {
  if (name === 'school-id') {
    return schoolItems.value?.find((itm) => itm.id === idFilter)?.name || null;
  }

  if (name === 'categories-id') {
    return categoryItems.value?.find((itm) => itm.id === idFilter)?.name || null;
  }

  if (name === 'professions-id') {
    return professionItems.value?.find((itm) => itm.id === idFilter)?.name || null;
  }

  if (name === 'teachers-id') {
    return teacherItems.value?.find((itm) => itm.id === idFilter)?.name || null;
  }

  if (name === 'skills-id') {
    return skillItems.value?.find((itm) => itm.id === idFilter)?.name || null;
  }

  if (name === 'skills-id') {
    return skillItems.value?.find((itm) => itm.id === idFilter)?.name || null;
  }

  if (name === 'tools-id') {
    return toolItems.value?.find((itm) => itm.id === idFilter)?.name || null;
  }

  if (name === 'levels-level') {
    if (idFilter === ELevel.JUNIOR) {
      return lang('salary.junior');
    }

    if (idFilter === ELevel.MIDDLE) {
      return lang('salary.middle');
    }

    if (idFilter === ELevel.SENIOR) {
      return lang('salary.senior');
    }
  }

  if (name === 'online') {
    if (idFilter === '1') {
      return lang('collection.online');
    }

    if (idFilter === '0') {
      return lang('collection.offline');
    }
  }

  if (name === 'rating') {
    if (idFilter === '4.5') {
      return lang('collection.rating-4-5');
    }

    if (idFilter === '4') {
      return lang('collection.rating-4');
    }

    if (idFilter === '3.5') {
      return lang('collection.rating-3-5');
    }

    if (idFilter === '3') {
      return lang('collection.rating-3');
    }
  }

  return null;
};

const getFilterOptions = (name: string, filters: Array<IFilter>): Array<IOption> => {
  const result: Array<IOption> = [];

  Object.values(filters).forEach((filter) => {
    if (filter.name === name) {
      const values = JSON.parse(filter.value) as Array<TId>;

      Object.values(values).forEach((value) => {
        result[result.length] = {
          value,
          key: getKeyFilter(name, value) || undefined,
        };
      });
    }
  });

  return result;
};

const getFilterValue = (name: string, filters: Array<IFilter>): boolean => {
  let result: boolean = false;

  Object.values(filters).forEach((filter) => {
    if (filter.name === name) {
      result = Number(filter.value) === 1;
    }
  });

  return result;
};

const getFilterOption = (name: string, filters: Array<IFilter>): IOption | null => {
  let result: IOption | null = null;

  Object.values(filters).forEach((filter) => {
    if (filter.name === name) {
      result = {
        value: Number(filter.value),
        key: getKeyFilter(name, filter.value) || undefined,
      };
    }
  });

  return result;
};

const getFilterRange = (
  name: string,
  filters: Array<IFilter>,
  def: [number, number],
): [number, number] => {
  let result: [number, number] = def;

  Object.values(filters).forEach((filter) => {
    if (filter.name === name) {
      result = JSON.parse(filter.value);
    }
  });

  return result;
};

const getDefaultFormValue = (): ICollectionForm => ({
  id: id as TId,
  direction_id: item.value?.direction
    ? { label: item.value?.direction.name, value: item.value?.direction.id } as IOption
    : undefined,
  name: item.value?.name || undefined,
  amount: item.value?.amount || undefined,
  link: item.value?.link || undefined,
  text: item.value?.text || undefined,
  additional: item.value?.additional || undefined,
  image: undefined,
  title: item.value?.metatag?.title || undefined,
  description: item.value?.metatag?.description || undefined,
  keywords: item.value?.metatag?.keywords || undefined,
  status: item.value?.status || true,
  sort: getSort(item.value?.sort_field, item.value?.sort_direction),
  copied: item.value?.copied !== undefined ? item.value?.copied : true,
  filters: {
    'school-id': getFilterOptions('school-id', item.value?.filters || []),
    'categories-id': getFilterOptions('categories-id', item.value?.filters || []),
    'professions-id': getFilterOptions('professions-id', item.value?.filters || []),
    'teachers-id': getFilterOptions('teachers-id', item.value?.filters || []),
    'skills-id': getFilterOptions('skills-id', item.value?.filters || []),
    'tools-id': getFilterOptions('tools-id', item.value?.filters || []),
    'levels-level': getFilterOptions('levels-level', item.value?.filters || []),
    online: getFilterOption('online', item.value?.filters || []) || undefined,
    rating: getFilterOption('rating', item.value?.filters || []) || undefined,
    credit: getFilterValue('credit', item.value?.filters || []),
    free: getFilterValue('free', item.value?.filters || []),
    price: getFilterRange('price', item.value?.filters || [], [0, 1000000]),
    duration: getFilterRange('duration', item.value?.filters || [], [0, 50]),
  },
});

const form = ref<ICollectionForm>(getDefaultFormValue());

const onClickReset = (): void => {
  form.value = getDefaultFormValue();
};

const setCountCourses = async (): Promise<void> => {
  countCoursesLoading.value = true;

  try {
    const filters: IFiltersForm = {
      ...form.value.filters,
      'directions-id': Number(form.value.direction_id?.value),
    };
    const response = await count(filters);
    countCourses.value = response.data.count;
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

  countCoursesLoading.value = false;
};

const onSubmit = async (): Promise<void> => {
  alert.value.message = '';
  loading.value = true;

  try {
    await update(form.value);

    alert.value.message = lang('dashboard.successUpdateText');
    alert.value.type = 'success';

    if (!form.value.copied) {
      notification.open({
        icon: () => h(SisternodeOutlined, { style: 'color: #108ee9' }),
        message: lang('task.launchTitle'),
        description: lang('task.launchText'),
      });
    }
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
  imageAlert.value.message = '';
  imageUpdateLoading.value = true;

  try {
    await imageUpdate(id as TId, file);

    image.value = await base64(file) as string || '';
  } catch (error: Error | any) {
    imageAlert.value.message = error.response.data.message
      ? error.response.data.message
      : error.message;
    imageAlert.value.type = 'error';
  }

  imageUpdateLoading.value = false;

  return false;
};

const onClickImageDestroy = async (): Promise<void> => {
  Modal.confirm({
    title: lang('dashboard.alert'),
    icon: createVNode(ExclamationCircleOutlined),
    content: lang('dashboard.confirmDestroyImage'),
    async onOk() {
      imageAlert.value.message = '';
      imageDestroyLoading.value = true;

      try {
        await imageDestroy(id as TId);

        image.value = '';
      } catch (error: Error | any) {
        imageAlert.value.message = error.response.data.message
          ? error.response.data.message
          : error.message;
        imageAlert.value.type = 'error';
      }

      imageDestroyLoading.value = false;
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

onMounted(async (): Promise<void> => {
  loadingSelects.value = true;

  try {
    await setCountCourses();
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
