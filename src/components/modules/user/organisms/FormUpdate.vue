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
            <Lang value="user.updateUser" />
          </div>
        </template>

        <Alert
          v-if="userAlert.message"
          :message="userAlert.type === 'success'
            ? lang('dashboard.success')
            : lang('dashboard.error')"
          :description="userAlert.message"
          :type="userAlert.type"
          class="mb-25"
        />

        <Form
          ref="userFormRef"
          :model="userForm"
          :label-col="{ span: 5 }"
          class="width--wide max--width-500"
          @finish="onUserSubmit"
        >
          <Item
            :label="lang('dashboard.status')"
            name="status"
            :rules="[{ required: true }]"
          >
            <RadioGroup
              v-model:value="userForm.status"
              :readonly="true"
            >
              <RadioButton
                :value="true"
                :disabled="Number(id) === 1"
              >
                <Lang value="dashboard.active" />
              </RadioButton>
              <RadioButton
                :value="false"
                :disabled="Number(id) === 1"
              >
                <Lang value="dashboard.deactivated" />
              </RadioButton>
            </RadioGroup>
          </Item>
          <Item
            :label="lang('dashboard.login')"
            name="login"
            has-feedback
            :rules="[{ required: true, type: 'email', max: 191 }]"
            :disabled="Number(id) === 1"
          >
            <Input
              v-model:value="userForm.login"
              :disabled="Number(id) === 1"
            />
          </Item>
          <Item
            :label="lang('user.role')"
            name="role"
            has-feedback
            :rules="[{ required: true }]"
          >
            <Select
              v-model:value="userForm.role"
              :disabled="Number(id) === 1"
            >
              <Option :value="ERole.ADMIN">
                <Lang value="dashboard.admin" />
              </Option>
              <Option :value="ERole.MANAGER">
                <Lang value="dashboard.manager" />
              </Option>
              <Option :value="ERole.USER">
                <Lang value="dashboard.user" />
              </Option>
            </Select>
          </Item>
          <Item
            :label="lang('profile.firstName')"
            name="first_name"
            has-feedback
          >
            <Input v-model:value="userForm.first_name" />
          </Item>
          <Item
            :label="lang('profile.secondName')"
            name="second_name"
            has-feedback
            :rules="[{ type: 'string', max: 191 }]"
          >
            <Input v-model:value="userForm.second_name" />
          </Item>
          <Item
            :label="lang('profile.phone')"
            name="phone"
            has-feedback
            :rules="[{ type: 'string', max: 30 }]"
          >
            <Input
              v-model:value="userForm.phone"
              v-maska="phoneMask"
            />
          </Item>
          <Item
            :wrapper-col="{offset: 5, span: 19}"
            class="buttons-flex"
          >
            <Checkbox
              v-model:checked="userForm.two_factor"
              name="two_factor"
              class="mb-8"
            >
              <Lang value="user.twoFactor" />
            </Checkbox>
            <br>
            <Checkbox
              v-model:checked="userForm.verified"
              :disabled="Number(id) === 1"
              name="verified"
              class="mb-8"
            >
              <Lang value="user.verified" />
            </Checkbox>
          </Item>

          <Item
            :wrapper-col="{ offset: 5 }"
            class="buttons-flex"
          >
            <Space>
              <Button
                :loading="userLoading"
                type="primary"
                html-type="submit"
              >
                <span>
                  <Lang value="dashboard.update" />
                </span>
              </Button>
              <Button
                @click="onClickUserReset"
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
import { FormInstance } from 'ant-design-vue';
import Alert from 'ant-design-vue/lib/alert';
import Button from 'ant-design-vue/lib/button';
import Card from 'ant-design-vue/lib/card';
import Checkbox from 'ant-design-vue/lib/checkbox';
import Col from 'ant-design-vue/lib/col';
import Form from 'ant-design-vue/lib/form';
import Input from 'ant-design-vue/lib/input';
import Modal from 'ant-design-vue/lib/modal';
import Radio from 'ant-design-vue/lib/radio';
import Row from 'ant-design-vue/lib/row';
import Select from 'ant-design-vue/lib/select';
import Space from 'ant-design-vue/lib/space';
import Upload from 'ant-design-vue/lib/upload';
import { storeToRefs } from 'pinia';
import {
  createVNode,
  ref,
} from 'vue';
import { useMeta } from 'vue-meta';
import { useRoute } from 'vue-router';

import Lang from '@/components/atoms/Lang.vue';
import ERole from '@/enums/modules/user/role';
import base64 from '@/helpers/base64';
import lang from '@/helpers/lang';
import IPasswordForm from '@/interfaces/modules/user/passwordForm';
import IUserForm from '@/interfaces/modules/user/userForm';
import IAlert from '@/interfaces/molecules/alert/alert';
import user from '@/stores/user';
import TId from '@/types/id';

useMeta({
  title: lang('user.updateUser'),
});

const route = useRoute();
const { id } = route.params;
const { Item } = Form;
const { Password } = Input;
const { Option } = Select;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;

const userFormRef = ref<FormInstance>();
const titleRef = ref<HTMLElement|null>();
const passwordFormRef = ref<FormInstance>();
const userLoading = ref(false);
const passwordLoading = ref(false);
const imageUpdateLoading = ref(false);
const imageDestroyLoading = ref(false);
const {
  update,
  password,
  imageUpdate,
  imageDestroy,
} = user();
const { item } = storeToRefs(user());
const phoneMask = '+7-###-###-####';

const userAlert = ref<IAlert>({
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

const userForm = ref<IUserForm>({
  id: id as TId,
  login: item.value?.login || undefined,
  password: item.value?.password || undefined,
  first_name: item.value?.first_name || undefined,
  second_name: item.value?.second_name || undefined,
  phone: item.value?.phone || undefined,
  two_factor: item.value?.two_factor !== undefined ? item.value?.two_factor : false,
  verified: item.value?.verification.status !== undefined ? item.value?.verification.status : false,
  status: item.value?.status !== undefined ? item.value?.status : true,
  role: item.value?.role?.name || undefined,
  image: undefined,
});

const passwordForm = ref<IPasswordForm>({
  password: undefined,
});

const image = ref<string>(item.value?.image_middle_id?.path || '');

const onUserSubmit = async (): Promise<void> => {
  userAlert.value.message = '';
  userLoading.value = true;

  try {
    await update(userForm.value);

    userAlert.value.message = lang('dashboard.successUpdateText');
    userAlert.value.type = 'success';
  } catch (error: Error | any) {
    userAlert.value.message = error.response.data.message
      ? error.response.data.message
      : error.message;
    userAlert.value.type = 'error';
  }

  if (titleRef.value) {
    titleRef.value.scrollIntoView({ behavior: 'smooth' });
  }

  userLoading.value = false;
};

const onClickUserReset = (): void => {
  userFormRef.value?.resetFields();
  userForm.value.two_factor = item.value?.two_factor !== undefined ? item.value?.two_factor : false;
  userForm.value.verified = item.value?.verification.status !== undefined
    ? item.value?.verification.status
    : false;
};

const onPasswordSubmit = async (): Promise<void> => {
  passwordAlert.value.message = '';
  passwordLoading.value = true;

  try {
    await password(id as TId, passwordForm.value.password || '');

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
</script>

<style>
.ant-upload.ant-upload-select-picture-card {
  width: 208px !important;
  height: 208px !important;
}
</style>
