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
            <Lang value="publication.updatePublication" />
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
                  :label="lang('publication.publishedAt')"
                  name="published_at"
                  has-feedback
                  :rules="[{ required: true }]"
                >
                  <DatePicker
                    v-model:value="form.published_at"
                    format="DD.MM.YYYY HH:mm:ss"
                    show-time
                    style="width: 100%"
                  />
                </Item>
                <Item
                  :label="lang('publication.header')"
                  name="header"
                  has-feedback
                  :rules="[{ required: true, type: 'string', max: 191 }]"
                >
                  <Input
                    v-model:value="form.header"
                    @keyup="onChangeName"
                  />
                </Item>
                <Item
                  :label="lang('publication.link')"
                  name="link"
                  has-feedback
                  :rules="[{ required: true, type: 'string', max: 191, pattern: alphaDash }]"
                >
                  <Input v-model:value="form.link" />
                </Item>
                <Item
                  :label="lang('publication.anons')"
                  name="anons"
                  has-feedback
                  :rules="[{ type: 'string', max: 1000 }]"
                >
                  <TextArea
                    v-model:value="form.anons"
                    style="height: 200px"
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
                  :label="lang('publication.title')"
                  name="title"
                  has-feedback
                  :rules="[{ type: 'string', max: 500 }]"
                >
                  <Input v-model:value="form.title" />
                </Item>
                <Item
                  :label="lang('publication.description')"
                  name="description"
                  has-feedback
                  :rules="[{ type: 'string', max: 1000 }]"
                >
                  <Input v-model:value="form.description" />
                </Item>
                <Item
                  :label="lang('publication.keywords')"
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
              :tab="lang('publication.article')"
            >
              <Ckeditor
                v-model:value="form.article"
                name="article"
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
  PlusOutlined,
} from '@ant-design/icons-vue';
import type { FormInstance } from 'ant-design-vue';
import Alert from 'ant-design-vue/lib/alert';
import Button from 'ant-design-vue/lib/button';
import Card from 'ant-design-vue/lib/card';
import Col from 'ant-design-vue/lib/col';
import DatePicker from 'ant-design-vue/lib/date-picker';
import Form from 'ant-design-vue/lib/form';
import Input from 'ant-design-vue/lib/input';
import Modal from 'ant-design-vue/lib/modal';
import Radio from 'ant-design-vue/lib/radio';
import Row from 'ant-design-vue/lib/row';
import Space from 'ant-design-vue/lib/space';
import Tabs from 'ant-design-vue/lib/tabs';
import Upload from 'ant-design-vue/lib/upload';
import dayjs from 'dayjs';
import { storeToRefs } from 'pinia';
import { createVNode, ref } from 'vue';
import { useMeta } from 'vue-meta';
import { useRoute } from 'vue-router';

import Lang from '@/components/atoms/Lang.vue';
import Ckeditor from '@/components/molecules/Ckeditor.vue';
import base64 from '@/helpers/base64';
import { latin } from '@/helpers/format';
import lang from '@/helpers/lang';
import IPublicationForm from '@/interfaces/modules/publication/publicationForm';
import IAlert from '@/interfaces/molecules/alert/alert';
import publication from '@/stores/publication';
import TId from '@/types/id';

useMeta({
  title: lang('publication.updatePublication'),
});

const route = useRoute();
const imageUpdateLoading = ref(false);
const imageDestroyLoading = ref(false);
const { id } = route.params;
const { Item } = Form;
const { TextArea } = Input;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
const { TabPane } = Tabs;
const {
  update,
  imageUpdate,
  imageDestroy,
} = publication();
const { item } = storeToRefs(publication());

const formRef = ref<FormInstance>();
const titleRef = ref<HTMLElement|null>();
const loading = ref(false);
const image = ref<string>(item.value?.image_middle_id?.path || '');
const alphaDash = /^[A-Za-z0-9_-]*$/;

const alert = ref<IAlert>({
  message: null,
  type: undefined,
});

const imageAlert = ref<IAlert>({
  message: null,
  type: undefined,
});

const getDefaultFormValue = (): IPublicationForm => ({
  id: id as TId,
  published_at: dayjs.utc(item.value?.published_at)
    .tz(dayjs.tz.guess()) || undefined,
  header: item.value?.header || undefined,
  link: item.value?.link || undefined,
  anons: item.value?.anons || undefined,
  article: item.value?.article || undefined,
  image: undefined,
  title: item.value?.metatag?.title || undefined,
  description: item.value?.metatag?.description || undefined,
  keywords: item.value?.metatag?.keywords || undefined,
  status: item.value?.status !== undefined ? item.value?.status : true,
});

const form = ref<IPublicationForm>(getDefaultFormValue());

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
  form.value.link = latin(form.value.header || '');
};
</script>

<style>
.ant-upload.ant-upload-select-picture-card {
  width: 208px !important;
  height: 208px !important;
}
</style>
