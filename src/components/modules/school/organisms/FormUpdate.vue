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

        <Alert
          v-if="imageAlert.logo.message"
          :message="imageAlert.logo.type === 'success'
            ? lang('dashboard.success')
            : lang('dashboard.error')"
          :description="imageAlert.logo.message"
          :type="imageAlert.logo.type"
          class="mb-25"
        />

        <Upload
          :max-count="1"
          :multiple="false"
          :before-upload="onBeforeUploadFileLogo"
          :show-upload-list="false"
          name="file"
          accept="image/*"
          list-type="picture-card"
        >
          <LoadingOutlined v-if="imageUpdateLoading.logo" />
          <img
            v-else-if="image.logo"
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

        <Alert
          v-if="imageAlert.site.message"
          :message="imageAlert.site.type === 'success'
            ? lang('dashboard.success')
            : lang('dashboard.error')"
          :description="imageAlert.site.message"
          :type="imageAlert.site.type"
          class="mb-25"
        />

        <Upload
          :max-count="1"
          :multiple="false"
          :before-upload="onBeforeUploadFileSite"
          :show-upload-list="false"
          name="file"
          accept="image/*"
          list-type="picture-card"
        >
          <LoadingOutlined v-if="imageUpdateLoading.site" />
          <img
            v-else-if="image.site"
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
  LoadingOutlined,
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
import Radio from 'ant-design-vue/lib/radio';
import Row from 'ant-design-vue/lib/row';
import Space from 'ant-design-vue/lib/space';
import Tabs from 'ant-design-vue/lib/tabs';
import Upload from 'ant-design-vue/lib/upload';
import { storeToRefs } from 'pinia';
import { createVNode, ref } from 'vue';
import { useMeta } from 'vue-meta';
import { useRoute } from 'vue-router';

import Lang from '@/components/atoms/Lang.vue';
import Ckeditor from '@/components/molecules/Ckeditor.vue';
import base64 from '@/helpers/base64';
import { latin } from '@/helpers/format';
import lang from '@/helpers/lang';
import ISchoolForm from '@/interfaces/modules/school/schoolForm';
import IAlert from '@/interfaces/molecules/alert/alert';
import school from '@/stores/school';
import TId from '@/types/id';

useMeta({
  title: lang('school.updateSchool'),
});

const route = useRoute();
const imageUpdateLoading = ref<Record<string, boolean>>({
  logo: false,
  site: false,
});
const imageDestroyLoading = ref<Record<string, boolean>>({
  logo: false,
  site: false,
});
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
} = school();
const { item } = storeToRefs(school());

const formRef = ref<FormInstance>();
const titleRef = ref<HTMLElement|null>();
const loading = ref(false);
const image = ref<Record<string, string | ArrayBuffer | null>>({
  logo: item.value?.image_logo_id?.path || null,
  site: item.value?.image_site_id?.path || null,
});

const alphaDash = /^[A-Za-z0-9_-]*$/;

const alert = ref<IAlert>({
  message: null,
  type: undefined,
});

const imageAlert = ref<Record<string, IAlert>>(
  {
    logo: {
      message: null,
      type: null,
    },
    site: {
      message: null,
      type: null,
    },
  },
);

const getDefaultFormValue = (): ISchoolForm => ({
  id: id as TId,
  name: item.value?.name || '',
  header: item.value?.header || '',
  header_template: item.value?.header_template || '',
  link: item.value?.link || '',
  text: item.value?.text || '',
  rating: item.value?.rating || '',
  site: item.value?.site || null,
  imageLogo: null,
  imageSite: null,
  title: item.value?.metatag?.title || null,
  description: item.value?.metatag?.description || null,
  title_template: item.value?.metatag?.title_template || null,
  description_template: item.value?.metatag?.description_template || null,
  keywords: item.value?.metatag?.keywords || null,
  status: item.value?.status !== undefined ? item.value?.status : true,
});

const form = ref<ISchoolForm>(getDefaultFormValue());

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

const onBeforeUploadFileLogo = async (file: File): Promise<boolean> => {
  imageAlert.value.logo.message = '';
  imageUpdateLoading.value.logo = true;

  try {
    await imageUpdate(id as TId, 'logo', file);

    image.value.logo = await base64(file);
  } catch (error: Error | any) {
    imageAlert.value.logo.message = error.response.data.message
      ? error.response.data.message
      : error.message;
    imageAlert.value.logo.type = 'error';
  }

  imageUpdateLoading.value.logo = false;

  return false;
};

const onBeforeUploadFileSite = async (file: File): Promise<boolean> => {
  imageAlert.value.site.message = '';
  imageUpdateLoading.value.site = true;

  try {
    await imageUpdate(id as TId, 'site', file);

    image.value.site = await base64(file);
  } catch (error: Error | any) {
    imageAlert.value.site.message = error.response.data.message
      ? error.response.data.message
      : error.message;
    imageAlert.value.site.type = 'error';
  }

  imageUpdateLoading.value.site = false;

  return false;
};

const onClickImageDestroy = async (type: string): Promise<void> => {
  Modal.confirm({
    title: lang('dashboard.alert'),
    icon: createVNode(ExclamationCircleOutlined),
    content: lang('dashboard.confirmDestroyImage'),
    async onOk() {
      imageAlert.value[type].message = '';
      imageDestroyLoading.value[type] = true;

      try {
        await imageDestroy(id as TId, type);

        image.value[type] = null;
      } catch (error: Error | any) {
        imageAlert.value.message = error.response.data.message
          ? error.response.data.message
          : error.message;
        imageAlert.value[type].type = 'error';
      }

      imageDestroyLoading.value[type] = false;
    },
  });
};

const onChangeName = () => {
  form.value.link = latin(form.value.name);
};
</script>

<style>
.ant-upload.ant-upload-select-picture-card {
  width: 208px !important;
  height: 208px !important;
}
</style>
