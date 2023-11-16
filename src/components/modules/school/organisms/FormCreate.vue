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
            <Lang value="school.addSchool" />
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
                  :label="lang('school.nameField')"
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
                  :label="lang('school.header')"
                  name="header_template"
                  has-feedback
                  :rules="[{ required: true, type: 'string', max: 191 }]"
                  :extra="form.header"
                >
                  <Input
                    v-model:value="form.header_template"
                  />
                </Item>
                <Item
                  :label="lang('school.link')"
                  name="link"
                  has-feedback
                  :rules="[{ required: true, type: 'string', max: 191, pattern: alphaDash }]"
                >
                  <Input v-model:value="form.link" />
                </Item>
                <Item
                  :label="lang('school.rating')"
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
                  :label="lang('school.site')"
                  name="site"
                  has-feedback
                  :rules="[{ required: false, type: 'url' }]"
                >
                  <Input v-model:value="form.site" />
                </Item>
              </div>
            </TabPane>
            <TabPane
              key="meta"
              :tab="lang('dashboard.meta')"
            >
              <div class="width--wide max--width-600">
                <Item
                  :label="lang('school.title')"
                  name="title_template"
                  has-feedback
                  :rules="[{ type: 'string', max: 500 }]"
                  :extra="form.title"
                >
                  <Input v-model:value="form.title_template" />
                </Item>
                <Item
                  :label="lang('school.description')"
                  name="description_template"
                  has-feedback
                  :rules="[{ type: 'string', max: 1000 }]"
                  :extra="form.description"
                >
                  <Input v-model:value="form.description_template" />
                </Item>
                <Item
                  :label="lang('school.keywords')"
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
              :tab="lang('school.text')"
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
      <Card class="mb-20">
        <template #title>
          <Lang value="school.imageLogo" />
        </template>
        <template
          v-if="image.logo"
          #extra
        >
          <Button
            danger
            @click="onClickImageDestroy('logo')"
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
          :before-upload="onBeforeUploadFileLogo"
          :show-upload-list="false"
          name="file"
          accept="image/*"
          list-type="picture-card"
        >
          <img
            v-if="image.logo"
            :src="image.logo"
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

      <Card class="mb-20">
        <template #title>
          <Lang value="school.imageSite" />
        </template>
        <template
          v-if="image.site"
          #extra
        >
          <Button
            danger
            @click="onClickImageDestroy('site')"
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
          :before-upload="onBeforeUploadFileSite"
          :show-upload-list="false"
          name="file"
          accept="image/*"
          list-type="picture-card"
        >
          <img
            v-if="image.site"
            :src="image.site"
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
  PlusOutlined,
  SisternodeOutlined,
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
import Space from 'ant-design-vue/lib/space';
import Tabs from 'ant-design-vue/lib/tabs';
import Upload from 'ant-design-vue/lib/upload';
import { createVNode, h, ref } from 'vue';
import { useMeta } from 'vue-meta';

import Lang from '@/components/atoms/Lang.vue';
import Ckeditor from '@/components/molecules/Ckeditor.vue';
import base64 from '@/helpers/base64';
import { latin } from '@/helpers/format';
import lang from '@/helpers/lang';
import ISchoolForm from '@/interfaces/modules/school/schoolForm';
import IAlert from '@/interfaces/molecules/alert/alert';
import school from '@/stores/school';

useMeta({
  title: lang('school.createSchool'),
});

const { Item } = Form;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
const { TabPane } = Tabs;
const { create } = school();

const formRef = ref<FormInstance>();
const titleRef = ref<HTMLElement|null>();
const loading = ref(false);
const image = ref<Record<string, string>>({
  logo: '',
  site: '',
});
const alphaDash = /^[A-Za-z0-9_-]*$/;

const alert = ref<IAlert>({
  message: null,
  type: undefined,
});

const form = ref<ISchoolForm>({
  name: undefined,
  header: undefined,
  header_template: 'Онлайн-курсы школы {school}',
  link: undefined,
  text: undefined,
  rating: undefined,
  site: undefined,
  imageLogo: undefined,
  imageSite: undefined,
  title: undefined,
  description: undefined,
  title_template: '{school}:[countSchoolCourses: {countSchoolCourses:онлайн-курс|nominative} — ] цены, сравнения, описание программ и курсов — Courselandia',
  description_template: 'Начни учиться в онлайн-школе {school} [countSchoolCourses: — {countSchoolCourses:профессиональный онлайн-курс|nominative} от ведущих преподавателей], подробное описание курсов в каталоге Courselandia.',
  keywords: undefined,
  status: true,
});

const onClickReset = (): void => {
  formRef.value?.resetFields();
  form.value.text = '';
  form.value.imageLogo = undefined;
  form.value.imageSite = undefined;
  image.value.site = '';
  image.value.logo = '';
};

const onSubmit = async (): Promise<void> => {
  alert.value.message = '';
  loading.value = true;

  try {
    await create(form.value);

    alert.value.message = lang('dashboard.successCreateText');
    alert.value.type = 'success';
    form.value.imageLogo = undefined;
    form.value.imageSite = undefined;
    form.value.text = '';
    image.value.site = '';
    image.value.logo = '';

    notification.open({
      icon: () => h(SisternodeOutlined, { style: 'color: #108ee9' }),
      message: lang('task.launchTitle'),
      description: lang('task.launchText'),
    });

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

const onBeforeUploadFileLogo = async (file: File): Promise<boolean> => {
  form.value.imageLogo = file;
  image.value.logo = await base64(file) as string || '';

  return false;
};

const onBeforeUploadFileSite = async (file: File): Promise<boolean> => {
  form.value.imageSite = file;
  image.value.site = await base64(file) as string || '';

  return false;
};

const onClickImageDestroy = async (type: string): Promise<void> => {
  Modal.confirm({
    title: lang('dashboard.alert'),
    icon: createVNode(ExclamationCircleOutlined),
    content: lang('dashboard.confirmDestroyImage'),
    async onOk() {
      if (type === 'logo') {
        form.value.imageLogo = undefined;
        image.value.logo = '';
      } else if (type === 'site') {
        form.value.imageSite = undefined;
        image.value.site = '';
      }
    },
  });
};

const onChangeName = () => {
  form.value.link = latin(form.value.name || '');
};
</script>

<style>
.ant-upload.ant-upload-select-picture-card {
  width: 208px !important;
  height: 208px !important;
}
</style>
