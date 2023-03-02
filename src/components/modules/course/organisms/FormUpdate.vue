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
            <Lang value="course.updateCourse" />
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
          :label-col="{ span: 8 }"
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
                    <RadioButton :value="EStatus.ACTIVE">
                      {{ lang('dashboard.active') }}
                    </RadioButton>
                    <RadioButton :value="EStatus.DRAFT">
                      {{ lang('dashboard.draft') }}
                    </RadioButton>
                    <RadioButton :value="EStatus.DISABLED">
                      {{ lang('dashboard.disabled') }}
                    </RadioButton>
                  </RadioGroup>
                </Item>
                <Item
                  :label="lang('course.header')"
                  name="header"
                  has-feedback
                  :rules="[{ required: true, type: 'string', max: 191 }]"
                >
                  <Input
                    v-model:value="form.header"
                    @keyup="onChangeHeader"
                  />
                </Item>
                <Item
                  :label="lang('course.link')"
                  name="link"
                  has-feedback
                  :rules="[{ required: true, type: 'string', max: 191, pattern: alphaDash }]"
                >
                  <Input v-model:value="form.link" />
                </Item>
                <Item
                  :label="lang('course.url')"
                  name="url"
                  has-feedback
                  :rules="[{ required: true, type: 'url' }]"
                >
                  <Input
                    v-model:value="form.url"
                  />
                </Item>
                <Item
                  :label="lang('course.school')"
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
              </div>
            </TabPane>
            <TabPane
              key="addition"
              :tab="lang('course.addition')"
            >
              <div class="width--wide max--width-600">
                <Item
                  :label="lang('course.directions')"
                  name="directions"
                  has-feedback
                  :rules="[{ required: false }]"
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
                  :label="lang('course.professions')"
                  name="professions"
                  has-feedback
                  :rules="[{ required: false }]"
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
                <Item
                  :label="lang('course.categories')"
                  name="categories"
                  has-feedback
                  :rules="[{ required: false }]"
                >
                  <Select
                    v-model:value="form.categories"
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
                  :label="lang('course.skills')"
                  name="skills"
                  has-feedback
                  :rules="[{ required: false }]"
                >
                  <Select
                    v-model:value="form.skills"
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
                  :label="lang('course.teachers')"
                  name="teachers"
                  has-feedback
                  :rules="[{ required: false }]"
                >
                  <Select
                    v-model:value="form.teachers"
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
                  :label="lang('course.tools')"
                  name="tools"
                  has-feedback
                  :rules="[{ required: false }]"
                >
                  <Select
                    v-model:value="form.tools"
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
                  :label="lang('course.employments')"
                  name="employments"
                  has-feedback
                  :rules="[{ required: false }]"
                >
                  <Select
                    v-model:value="form.employments"
                    label-in-value
                    mode="multiple"
                    class="width--wide"
                    show-search
                    :filter-option="filterOption"
                    :options="employmentItems?.map((itm) => ({ value: itm.id, label: itm.name }))"
                    :loading="loadingSelects"
                  />
                </Item>
                <Item
                  :label="lang('course.processes')"
                  name="processes"
                  has-feedback
                  :rules="[{ required: false }]"
                >
                  <Select
                    v-model:value="form.processes"
                    label-in-value
                    mode="multiple"
                    class="width--wide"
                    show-search
                    :filter-option="filterOption"
                    :options="processItems?.map((itm) => ({ value: itm.id, label: itm.name }))"
                    :loading="loadingSelects"
                  />
                </Item>
                <Item
                  :label="lang('course.levels')"
                  name="levels"
                  has-feedback
                  :rules="[{ required: false }]"
                >
                  <Select
                    v-model:value="form.levels"
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
                <Item
                  :label="lang('course.language')"
                  name="language"
                  :rules="[{ required: false }]"
                >
                  <Select
                    v-model:value="form.language"
                    allow-clear
                  >
                    <Option :value="ELanguage.RU">
                      <Lang value="course.ru" />
                    </Option>
                    <Option :value="ELanguage.EN">
                      <Lang value="course.en" />
                    </Option>
                  </Select>
                </Item>
                <Item
                  :label="lang('course.rating')"
                  name="rating"
                  has-feedback
                  :rules="[{ required: false, type: 'number', min: 0, max: 5 }]"
                >
                  <InputNumber
                    v-model:value="form.rating"
                    class="width--wide"
                  />
                </Item>
                <Item
                  :label="lang('course.price')"
                  name="price"
                  has-feedback
                  :rules="[{ required: false, type: 'number', min: 0, max: 999999 }]"
                >
                  <InputNumber
                    v-model:value="form.price"
                    class="width--wide"
                  />
                </Item>
                <Item
                  :label="lang('course.priceOld')"
                  name="price_old"
                  has-feedback
                  :rules="[{ required: false, type: 'number', min: 0, max: 999999 }]"
                >
                  <InputNumber
                    v-model:value="form.price_old"
                    class="width--wide"
                  />
                </Item>
                <Item
                  :label="lang('course.priceRecurrentPrice')"
                  name="price_recurrent"
                  has-feedback
                  :rules="[{ required: false, type: 'number', min: 0, max: 999999 }]"
                >
                  <InputNumber
                    v-model:value="form.price_recurrent"
                    class="width--wide"
                  />
                </Item>
                <Item
                  :label="lang('course.currency')"
                  name="currency"
                  :rules="[{ required: false }]"
                >
                  <Select
                    v-model:value="form.currency"
                    allow-clear
                  >
                    <Option :value="ECurrency.RUB">
                      <Lang value="course.rub" />
                    </Option>
                    <Option :value="ECurrency.USD">
                      <Lang value="course.usd" />
                    </Option>
                    <Option :value="ECurrency.EUR">
                      <Lang value="course.eur" />
                    </Option>
                  </Select>
                </Item>
                <Item
                  :label="lang('course.online')"
                  name="online"
                  has-feedback
                >
                  <Switch v-model:checked="form.online" />
                </Item>
                <Item
                  :label="lang('course.employment')"
                  name="employment"
                  has-feedback
                >
                  <Switch v-model:checked="form.employment" />
                </Item>
                <Item
                  :label="lang('course.duration')"
                  name="duration"
                  has-feedback
                  :rules="[{ required: false, type: 'number', min: 0, max: 1000 }]"
                >
                  <InputNumber
                    v-model:value="form.duration"
                    class="width--wide"
                  />
                </Item>
                <Item
                  :label="lang('course.durationUnit')"
                  name="duration_unit"
                  :rules="[{ required: false }]"
                >
                  <Select
                    v-model:value="form.duration_unit"
                    allow-clear
                  >
                    <Option :value="EDuration.DAY">
                      <Lang value="course.day" />
                    </Option>
                    <Option :value="EDuration.WEEK">
                      <Lang value="course.week" />
                    </Option>
                    <Option :value="EDuration.MONTH">
                      <Lang value="course.month" />
                    </Option>
                    <Option :value="EDuration.YEAR">
                      <Lang value="course.year" />
                    </Option>
                  </Select>
                </Item>
                <Item
                  :label="lang('course.lessonsAmount')"
                  name="lessons_amount"
                  has-feedback
                  :rules="[{ required: false, type: 'number', min: 0, max: 1000 }]"
                >
                  <InputNumber
                    v-model:value="form.lessons_amount"
                    class="width--wide"
                  />
                </Item>
                <Item
                  :label="lang('course.modulesAmount')"
                  name="modules_amount"
                  has-feedback
                  :rules="[{ required: false, type: 'number', min: 0, max: 1000 }]"
                >
                  <InputNumber
                    v-model:value="form.modules_amount"
                    class="width--wide"
                  />
                </Item>
              </div>
            </TabPane>
            <TabPane
              key="learns"
              :tab="lang('course.learns')"
            >
              <Button
                class="mb-10"
                @click="onClickAddLearn"
              >
                <template #icon>
                  <PlusOutlined />
                </template>
                <span>
                  <Lang value="dashboard.add" />
                </span>
              </Button>
              <Table
                bordered
                class="mb-25"
                row-key="id"
                :pagination="false"
                :data-source="learnItems"
                :columns="learnColumns"
              >
                <template #bodyCell="{ column, text, record }">
                  <template v-if="column.dataIndex === 'text'">
                    <div class="editable-cell">
                      <div
                        v-if="learnEditableData[record.id]"
                        class="editable-cell-input-wrapper"
                      >
                        <Input
                          v-model:value="learnEditableData[record.id].text"
                          @press-enter="learnSave(record.id)"
                        />
                        <CheckOutlined
                          class="editable-cell-icon-check"
                          @click="learnSave(record.id)"
                        />
                      </div>
                      <div
                        v-else
                        class="editable-cell-text-wrapper"
                        @click="learnEdit(record.id)"
                        @keydown.enter="learnEdit(record.id)"
                      >
                        {{ text }}
                        <EditOutlined class="editable-cell-icon" />
                      </div>
                    </div>
                  </template>
                  <template v-else-if="column.dataIndex === 'actions'">
                    <Popconfirm
                      v-if="learnItems.length"
                      :title="lang('dashboard.askDestroyRecord')"
                      @confirm="onClickDeleteLearn(record.id)"
                    >
                      <Button danger>
                        <template #icon>
                          <DeleteOutlined />
                        </template>
                        <span>
                          <Lang value="dashboard.destroy" />
                        </span>
                      </Button>
                    </Popconfirm>
                  </template>
                </template>
              </Table>
            </TabPane>
            <TabPane
              key="features"
              :tab="lang('course.features')"
            >
              <Button
                class="mb-10"
                @click="onClickAddFeature"
              >
                <template #icon>
                  <PlusOutlined />
                </template>
                <span>
                  <Lang value="dashboard.add" />
                </span>
              </Button>
              <Table
                bordered
                class="mb-25"
                row-key="id"
                :pagination="false"
                :data-source="featureItems"
                :columns="featureColumns"
              >
                <template #bodyCell="{ column, text, record }">
                  <template v-if="column.dataIndex === 'icon'">
                    <div class="editable-cell">
                      <div
                        v-if="featureEditableData[record.id]?.icon !== undefined"
                        class="editable-cell-input-wrapper"
                      >
                        <Select
                          v-model:value="featureEditableData[record.id].icon"
                          class="width--wide"
                        >
                          <Option :value="EIcon.VIDEO">
                            <Lang value="course.video" />
                          </Option>
                          <Option :value="EIcon.CERTIFICATE">
                            <Lang value="course.certificate" />
                          </Option>
                          <Option :value="EIcon.CHECKBOX">
                            <Lang value="course.checkbox" />
                          </Option>
                          <Option :value="EIcon.CALENDAR">
                            <Lang value="course.calendar" />
                          </Option>
                          <Option :value="EIcon.NOTE">
                            <Lang value="course.note" />
                          </Option>
                        </Select>
                        <CheckOutlined
                          class="editable-cell-icon-check"
                          @click="featureSave(record.id)"
                        />
                      </div>
                      <div
                        v-else
                        class="editable-cell-text-wrapper"
                        @click="featureEdit(record.id, 'icon')"
                        @keydown.enter="featureEdit(record.id, 'icon')"
                      >
                        <template v-if="text === EIcon.VIDEO">
                          <Lang value="course.video" />
                        </template>
                        <template v-else-if="text === EIcon.CERTIFICATE">
                          <Lang value="course.certificate" />
                        </template>
                        <template v-else-if="text === EIcon.CHECKBOX">
                          <Lang value="course.checkbox" />
                        </template>
                        <template v-else-if="text === EIcon.CALENDAR">
                          <Lang value="course.calendar" />
                        </template>
                        <template v-else-if="text === EIcon.NOTE">
                          <Lang value="course.note" />
                        </template>
                        <EditOutlined class="editable-cell-icon" />
                      </div>
                    </div>
                  </template>
                  <template v-if="column.dataIndex === 'text'">
                    <div class="editable-cell">
                      <div
                        v-if="featureEditableData[record.id]?.text !== undefined"
                        class="editable-cell-input-wrapper"
                      >
                        <Input
                          v-model:value="featureEditableData[record.id].text"
                          @press-enter="featureSave(record.id)"
                        />
                        <CheckOutlined
                          class="editable-cell-icon-check"
                          @click="featureSave(record.id)"
                        />
                      </div>
                      <div
                        v-else
                        class="editable-cell-text-wrapper"
                        @click="featureEdit(record.id, 'text')"
                        @keydown.enter="featureEdit(record.id, 'text')"
                      >
                        {{ text }}
                        <EditOutlined class="editable-cell-icon" />
                      </div>
                    </div>
                  </template>
                  <template v-else-if="column.dataIndex === 'actions'">
                    <Popconfirm
                      v-if="featureItems.length"
                      :title="lang('dashboard.askDestroyRecord')"
                      @confirm="onClickDeleteFeature(record.id)"
                    >
                      <Button danger>
                        <template #icon>
                          <DeleteOutlined />
                        </template>
                        <span>
                          <Lang value="dashboard.destroy" />
                        </span>
                      </Button>
                    </Popconfirm>
                  </template>
                </template>
              </Table>
            </TabPane>
            <TabPane
              key="meta"
              :tab="lang('dashboard.meta')"
            >
              <div class="width--wide max--width-600">
                <Item
                  :label="lang('course.title')"
                  name="title"
                  has-feedback
                  :rules="[{ type: 'string', max: 500 }]"
                >
                  <Input v-model:value="form.title" />
                </Item>
                <Item
                  :label="lang('course.description')"
                  name="description"
                  has-feedback
                  :rules="[{ type: 'string', max: 1000 }]"
                >
                  <Input v-model:value="form.description" />
                </Item>
                <Item
                  :label="lang('course.keywords')"
                  name="keywords"
                  has-feedback
                  :rules="[{ type: 'string', max: 1000 }]"
                >
                  <Input v-model:value="form.keywords" />
                </Item>
              </div>
            </TabPane>
            <TabPane
              key="text"
              :tab="lang('course.text')"
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
                  <Lang value="dashboard.update" />
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
      <Card class="mb-20">
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
  CheckOutlined,
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  LoadingOutlined,
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
import Popconfirm from 'ant-design-vue/lib/popconfirm';
import Radio from 'ant-design-vue/lib/radio';
import Row from 'ant-design-vue/lib/row';
import Select from 'ant-design-vue/lib/select';
import Space from 'ant-design-vue/lib/space';
import Switch from 'ant-design-vue/lib/switch';
import Table from 'ant-design-vue/lib/table';
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
import {
  featureColumns,
  featureEdit,
  featureEditableData,
  featureItems,
  featureSave,
  learnColumns,
  learnEdit,
  learnEditableData,
  learnItems,
  learnSave,
  onClickAddFeature,
  onClickAddLearn,
  onClickDeleteFeature,
  onClickDeleteLearn,
} from '@/components/modules/course/organisms/common';
import Ckeditor from '@/components/molecules/Ckeditor.vue';
import ECurrency from '@/enums/modules/course/currency';
import EDuration from '@/enums/modules/course/duration';
import EIcon from '@/enums/modules/course/icon';
import ELanguage from '@/enums/modules/course/language';
import EStatus from '@/enums/modules/course/status';
import ELevel from '@/enums/modules/salary/level';
import base64 from '@/helpers/base64';
import { latin } from '@/helpers/format';
import lang from '@/helpers/lang';
import ICourseForm from '@/interfaces/modules/course/courseForm';
import IFeature from '@/interfaces/modules/course/feature';
import IAlert from '@/interfaces/molecules/alert/alert';
import ISorts from '@/interfaces/molecules/table/sorts';
import category from '@/stores/category';
import course from '@/stores/course';
import direction from '@/stores/direction';
import employment from '@/stores/employment';
import process from '@/stores/process';
import profession from '@/stores/profession';
import school from '@/stores/school';
import skill from '@/stores/skill';
import teacher from '@/stores/teacher';
import tool from '@/stores/tool';
import TId from '@/types/id';

useMeta({
  title: lang('course.updateCourse'),
});

const { Item } = Form;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
const { TabPane } = Tabs;
const {
  update,
  imageUpdate,
  imageDestroy,
} = course();
const { Option } = Select;

const imageUpdateLoading = ref(false);
const imageDestroyLoading = ref(false);

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

const readEmployments = employment().read;
const employmentData = storeToRefs(employment());
const employmentItems = employmentData.items;

const readProcesses = process().read;
const processData = storeToRefs(process());
const processItems = processData.items;

const route = useRoute();
const { id } = route.params;
const { item } = storeToRefs(course());

const formRef = ref<FormInstance>();
const titleRef = ref<HTMLElement|null>();
const loading = ref(false);
const image = ref<string | ArrayBuffer | null>(item.value?.image_middle_id?.path || null);
const alphaDash = /^[A-Za-z0-9_-]*$/;

const alert = ref<IAlert>({
  message: null,
  type: null,
});

const imageAlert = ref<IAlert>(
  {
    message: null,
    type: null,
  },
);

const getDefaultFormValue = (): ICourseForm => ({
  id: id as TId,
  school_id: item.value?.school
    ? { key: item.value?.school?.id, value: item.value?.school?.name }
    : null,
  image: null,
  header: item.value?.header || '',
  text: item.value?.text || null,
  link: item.value?.link || '',
  url: item.value?.url || '',
  language: item.value?.language || null,
  rating: item.value?.rating || null,
  price: item.value?.price || null,
  price_old: item.value?.price_old || null,
  price_recurrent: item.value?.price_recurrent || null,
  currency: item.value?.currency || null,
  online: item.value?.online || null,
  employment: item.value?.employment || null,
  duration: item.value?.duration || null,
  duration_unit: item.value?.duration_unit || null,
  lessons_amount: item.value?.lessons_amount || null,
  modules_amount: item.value?.modules_amount || null,
  status: item.value?.status || EStatus.ACTIVE,

  title: item.value?.metatag?.title || null,
  description: item.value?.metatag?.description || null,
  keywords: item.value?.metatag?.keywords || null,

  directions: item.value?.directions?.map((itm: any) => ({ key: itm.id, value: itm.name })) || [],
  professions: item.value?.professions?.map((itm: any) => ({ key: itm.id, value: itm.name })) || [],
  categories: item.value?.categories?.map((itm: any) => ({ key: itm.id, value: itm.name })) || [],
  skills: item.value?.skills?.map((itm: any) => ({ key: itm.id, value: itm.name })) || [],
  teachers: item.value?.teachers?.map((itm: any) => ({ key: itm.id, value: itm.name })) || [],
  tools: item.value?.tools?.map((itm: any) => ({ key: itm.id, value: itm.name })) || [],
  employments: item.value?.employments?.map((itm: any) => ({ key: itm.id, value: itm.name })) || [],
  processes: item.value?.processes?.map((itm: any) => ({ key: itm.id, value: itm.name })) || [],

  levels: item.value?.levels?.map((itm) => itm.level) as Array<string> || [],
  learns: item.value?.learns?.map((itm) => itm.text) as Array<string> || [],
  features: item.value?.features?.map(
    (itm) => ({ icon: itm.icon, text: itm.text }),
  ) as Array<IFeature> || [],
});

learnItems.value = item.value?.learns?.map((itm) => ({
  id: itm.id,
  text: itm.text,
})) || [];

featureItems.value = item.value?.features?.map((itm) => ({
  id: itm.id,
  icon: itm.icon,
  text: itm.text,
})) || [];

const form = ref<ICourseForm>(getDefaultFormValue());

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
    await readEmployments(null, null, { name: 'ASC' } as ISorts);
    await readProcesses(null, null, { name: 'ASC' } as ISorts);
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

const onClickReset = (): void => {
  form.value = getDefaultFormValue();
};

const onSubmit = async (): Promise<void> => {
  alert.value.message = '';
  loading.value = true;

  try {
    form.value.learns = [];

    Object.values(learnItems.value).forEach((itm) => {
      if (form.value.learns && itm.text) {
        form.value.learns[form.value.learns.length] = itm.text;
      }
    });

    form.value.features = [];

    Object.values(featureItems.value).forEach((itm) => {
      if (form.value.features && itm.icon && itm.text) {
        form.value.features[form.value.features.length] = {
          icon: itm.icon,
          text: itm.text,
        };
      }
    });

    await update(form.value);

    alert.value.message = lang('dashboard.successUpdateText');
    alert.value.type = 'success';
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

    image.value = await base64(file);
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

        image.value = null;
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

const onChangeHeader = () => {
  form.value.link = latin(form.value.header);
};

const filterOption = (input: string, option: any) => option
  ?.label
  ?.toLowerCase()
  ?.indexOf(input.toLowerCase()) >= 0;
</script>

<style lang="scss">
@import "@/assets/components/organisms/editableCell.scss";

.ant-upload.ant-upload-select-picture-card {
  width: 208px !important;
  height: 208px !important;
}
</style>
