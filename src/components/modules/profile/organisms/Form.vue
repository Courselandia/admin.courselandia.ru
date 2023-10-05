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
          <Lang value="dashboard.profile" />
        </template>

        <Alert
          v-if="profileAlert.message"
          :message="profileAlert.type === 'success'
            ? lang('dashboard.success')
            : lang('dashboard.error')"
          :description="profileAlert.message"
          :type="profileAlert.type"
          class="mb-25"
        />

        <Form
          ref="profileFormRef"
          :model="profileForm"
          :label-col="{ span: 5 }"
          class="width--wide max--width-500"
          @finish="onProfileSubmit"
        >
          <Item
            :label="lang('profile.firstName')"
            name="firstName"
            has-feedback
            :rules="[{ required: true, type: 'string', max: 191 }]"
          >
            <Input v-model:value="profileForm.firstName" />
          </Item>
          <Item
            :label="lang('profile.secondName')"
            name="secondName"
            has-feedback
            :rules="[{ required: true, type: 'string', max: 191 }]"
          >
            <Input v-model:value="profileForm.secondName" />
          </Item>
          <Item
            :label="lang('profile.phone')"
            name="phone"
            has-feedback
            :rules="[{ type: 'string', max: 30 }]"
          >
            <Input
              v-model:value="profileForm.phone"
              v-maska="phoneMask"
            />
          </Item>

          <Item
            :wrapper-col="{ offset: 5 }"
            class="buttons-flex"
          >
            <Space>
              <Button
                :loading="profileLoading"
                type="primary"
                html-type="submit"
              >
                <span>
                  <Lang value="dashboard.update" />
                </span>
              </Button>
              <Button
                @click="onClickProfileReset"
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
            :loading="imageDestroyLoading"
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
  <Row :gutter="[20, 20]">
    <Col
      :xxxl="16"
      :xxl="16"
      :xl="24"
      :lg="24"
      :md="24"
      :sm="24"
      :xs="24"
    >
      <Card>
        <template #title>
          <Lang value="dashboard.password" />
        </template>

        <Alert
          v-if="passwordAlert.message"
          :message="passwordAlert.type === 'success'
            ? lang('dashboard.success')
            : lang('dashboard.error')"
          :description="passwordAlert.message"
          :type="passwordAlert.type"
          class="mb-25"
        />

        <Form
          ref="passwordFormRef"
          :model="passwordForm"
          :label-col="{ span: 5 }"
          class="width--wide max--width-500"
          @finish="onPasswordSubmit"
        >
          <Item
            :label="lang('dashboard.password')"
            name="password"
            has-feedback
            :rules="[{ required: true }]"
          >
            <Password
              v-model:value="passwordForm.password"
            />
          </Item>

          <Item
            :wrapper-col="{ offset: 5 }"
            class="buttons-flex"
          >
            <Space>
              <Button
                :loading="passwordLoading"
                type="primary"
                html-type="submit"
              >
                <span>
                  <Lang value="dashboard.update" />
                </span>
              </Button>
              <Button
                html-type="reset"
                @click="onClickPasswordReset"
              >
                <Lang value="dashboard.reset" />
              </Button>
            </Space>
          </Item>
        </Form>
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
import {
  FormInstance,
} from 'ant-design-vue';
import Alert from 'ant-design-vue/lib/alert';
import Button from 'ant-design-vue/lib/button';
import Card from 'ant-design-vue/lib/card';
import Col from 'ant-design-vue/lib/col';
import Form from 'ant-design-vue/lib/form';
import Input from 'ant-design-vue/lib/input';
import Modal from 'ant-design-vue/lib/modal';
import Row from 'ant-design-vue/lib/row';
import Space from 'ant-design-vue/lib/space';
import Upload from 'ant-design-vue/lib/upload';
import { storeToRefs } from 'pinia';
import { createVNode, ref } from 'vue';
import { useMeta } from 'vue-meta';

import Lang from '@/components/atoms/Lang.vue';
import base64 from '@/helpers/base64';
import lang from '@/helpers/lang';
import IProfileForm from '@/interfaces/modules/profile/organisms/profileForm';
import IPasswordForm from '@/interfaces/modules/user/passwordForm';
import IAlert from '@/interfaces/molecules/alert/alert';
import access from '@/stores/access';
import profile from '@/stores/profile';

useMeta({
  title: lang('dashboard.profile'),
});

const { Item } = Form;
const { Password } = Input;
const { user } = storeToRefs(access());
const { getGate } = access();

const profileFormRef = ref<FormInstance>();
const passwordFormRef = ref<FormInstance>();
const profileLoading = ref(false);
const passwordLoading = ref(false);
const imageUpdateLoading = ref(false);
const imageDestroyLoading = ref(false);
const {
  update,
  password,
  imageUpdate,
  imageDestroy,
} = profile();
const phoneMask = '+7-###-###-####';

const profileAlert = ref<IAlert>({
  message: null,
  type: undefined,
});

const imageAlert = ref<IAlert>({
  message: null,
  type: undefined,
});

const passwordAlert = ref<IAlert>({
  message: null,
  type: undefined,
});

const profileForm = ref<IProfileForm>({
  firstName: user.value?.first_name || undefined,
  secondName: user.value?.second_name || undefined,
  phone: user.value?.phone || undefined,
});

const passwordForm = ref<IPasswordForm>({
  password: '',
});

const image = ref<string>(user.value?.image_middle_id?.path || '');

const onProfileSubmit = async (): Promise<void> => {
  profileAlert.value.message = '';
  profileLoading.value = true;

  try {
    await update(
      profileForm.value.firstName || '',
      profileForm.value.secondName || '',
      profileForm.value.phone || '',
    );

    profileAlert.value.message = lang('dashboard.successUpdateText');
    profileAlert.value.type = 'success';
    await getGate();
  } catch (error: Error | any) {
    profileAlert.value.message = error.response.data.message
      ? error.response.data.message
      : error.message;
    profileAlert.value.type = 'error';
  }

  profileLoading.value = false;
};

const onClickProfileReset = (): void => {
  profileForm.value = {
    firstName: user.value?.first_name || '',
    secondName: user.value?.second_name || '',
    phone: user.value?.phone || '',
  };
};

const onPasswordSubmit = async (): Promise<void> => {
  passwordAlert.value.message = '';
  passwordLoading.value = true;

  try {
    await password(passwordForm.value.password);

    passwordAlert.value.message = lang('dashboard.successUpdateText');
    passwordAlert.value.type = 'success';
    passwordFormRef.value?.resetFields();
  } catch (error: Error | any) {
    passwordAlert.value.message = error.response.data.message
      ? error.response.data.message
      : error.message;
    passwordAlert.value.type = 'error';
  }

  passwordLoading.value = false;
};

const onClickPasswordReset = (): void => {
  passwordFormRef.value?.resetFields();
};

const onBeforeUploadFile = async (file: File): Promise<boolean> => {
  imageAlert.value.message = '';
  imageUpdateLoading.value = true;

  try {
    await imageUpdate(file);

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
        await imageDestroy();

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
</script>

<style>
.ant-upload.ant-upload-select-picture-card {
  width: 208px !important;
  height: 208px !important;
}
</style>
