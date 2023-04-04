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
            <Lang value="teacher.addTeacher" />
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
                  :label="lang('teacher.nameField')"
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
                  :label="lang('teacher.link')"
                  name="link"
                  has-feedback
                  :rules="[{ required: true, type: 'string', max: 191, pattern: alphaDash }]"
                >
                  <Input v-model:value="form.link" />
                </Item>
                <Item
                  :label="lang('teacher.rating')"
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
                  :label="lang('teacher.directions')"
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
                  :label="lang('teacher.schools')"
                  name="schools"
                  has-feedback
                >
                  <Select
                    v-model:value="form.schools"
                    label-in-value
                    mode="multiple"
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
              key="meta"
              :tab="lang('dashboard.meta')"
            >
              <div class="width--wide max--width-600">
                <Item
                  :label="lang('teacher.title')"
                  name="title_template"
                  has-feedback
                  :rules="[{ type: 'string', max: 500 }]"
                  :extra="form.title"
                >
                  <Input v-model:value="form.title_template" />
                </Item>
                <Item
                  :label="lang('teacher.description')"
                  name="description_template"
                  has-feedback
                  :rules="[{ type: 'string', max: 1000 }]"
                  :extra="form.description"
                >
                  <Input v-model:value="form.description_template" />
                </Item>
                <Item
                  :label="lang('teacher.keywords')"
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
              :tab="lang('teacher.text')"
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
          <Lang value="teacher.image" />
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
  LoadingOutlined, MehOutlined,
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
import Space from 'ant-design-vue/lib/space';
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
import Ckeditor from '@/components/molecules/Ckeditor.vue';
import base64 from '@/helpers/base64';
import { latin } from '@/helpers/format';
import lang from '@/helpers/lang';
import ITeacherForm from '@/interfaces/modules/teacher/teacherForm';
import IAlert from '@/interfaces/molecules/alert/alert';
import ISorts from '@/interfaces/molecules/table/sorts';
import direction from '@/stores/direction';
import school from '@/stores/school';
import teacher from '@/stores/teacher';
import TId from '@/types/id';

useMeta({
  title: lang('teacher.updateTeacher'),
});

const loadingSelects = ref(true);
const readDirections = direction().read;
const readSchools = school().read;
const route = useRoute();
const imageUpdateLoading = ref(false);
const imageDestroyLoading = ref(false);
const { id } = route.params;
const { Item } = Form;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
const { TabPane } = Tabs;
const {
  update,
  get,
  imageUpdate,
  imageDestroy,
} = teacher();
const { item } = storeToRefs(teacher());

const directionData = storeToRefs(direction());
const directionItems = directionData.items;

const schoolData = storeToRefs(school());
const schoolItems = schoolData.items;

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

onMounted(async (): Promise<void> => {
  loadingSelects.value = true;

  try {
    await readDirections(null, null, { weight: 'ASC' } as ISorts);
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

const getDefaultFormValue = (): ITeacherForm => ({
  id: id as TId,
  name: item.value?.name || '',
  link: item.value?.link || '',
  text: item.value?.text || null,
  rating: item.value?.rating || null,
  image: null,
  title: item.value?.metatag?.title || null,
  description: item.value?.metatag?.description || null,
  title_template: item.value?.metatag?.title_template || null,
  description_template: item.value?.metatag?.description_template || null,
  keywords: item.value?.metatag?.keywords || null,
  status: item.value?.status !== undefined ? item.value?.status : true,
  directions: item.value?.directions?.map((itm: any) => ({ key: itm.id, value: itm.name })) || [],
  schools: item.value?.schools?.map((itm: any) => ({ key: itm.id, value: itm.name })) || [],
});

const form = ref<ITeacherForm>(getDefaultFormValue());

const onClickReset = (): void => {
  form.value = getDefaultFormValue();
};

const onSubmit = async (): Promise<void> => {
  alert.value.message = '';
  loading.value = true;

  try {
    await update(form.value);

    alert.value.message = lang('dashboard.successUpdateText');
    alert.value.type = 'success';

    await get(id as TId);
    form.value = getDefaultFormValue();
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

const onChangeName = () => {
  form.value.link = latin(form.value.name);
};

const filterOption = (input: string, option: any) => option
  ?.label
  ?.toLowerCase()
  ?.indexOf(input.toLowerCase()) >= 0;
</script>

<style>
.ant-upload.ant-upload-select-picture-card {
  width: 208px !important;
  height: 208px !important;
}
</style>
