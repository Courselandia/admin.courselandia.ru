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
            <Lang value="user.addUser" />
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
          :label-col="{ span: 5 }"
          class="width--wide max--width-500"
          @finish="onSubmit"
        >
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
            :label="lang('dashboard.login')"
            name="login"
            has-feedback
            :rules="[{ required: true, type: 'email', max: 191 }]"
          >
            <Input v-model:value="form.login" />
          </Item>
          <Item
            :label="lang('dashboard.password')"
            name="password"
            has-feedback
            :rules="[{ required: true }]"
          >
            <Password
              v-model:value="form.password"
            />
          </Item>
          <Item
            :label="lang('user.role')"
            name="role"
            has-feedback
            :rules="[{ required: true }]"
          >
            <Select
              v-model:value="form.role"
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
            :rules="[{ type: 'string', max: 191 }]"
          >
            <Input v-model:value="form.first_name" />
          </Item>
          <Item
            :label="lang('profile.secondName')"
            name="second_name"
            :rules="[{ type: 'string', max: 191 }]"
          >
            <Input v-model:value="form.second_name" />
          </Item>
          <Item
            :label="lang('profile.phone')"
            name="phone"
            has-feedback
            :rules="[{ type: 'string', max: 30 }]"
          >
            <Input
              v-model:value="form.phone"
              v-maska="phoneMask"
            />
          </Item>
          <Item
            :wrapper-col="{offset: 5, span: 19}"
            class="buttons-flex"
          >
            <Checkbox
              v-model:checked="form.two_factor"
              name="two_factor"
              class="mb-8"
            >
              <Lang value="user.twoFactor" />
            </Checkbox>
            <br>
            <Checkbox
              v-model:checked="form.verified"
              name="verified"
              class="mb-8"
            >
              <Lang value="user.verified" />
            </Checkbox>
            <br>
            <Checkbox
              v-model:checked="form.invitation"
              name="invitation"
              class="mb-8"
            >
              <Lang value="user.invitation" />
            </Checkbox>
          </Item>
          <Item
            :wrapper-col="{ offset: 5 }"
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
import { createVNode, ref } from 'vue';
import { useMeta } from 'vue-meta';

import Lang from '@/components/atoms/Lang.vue';
import ERole from '@/enums/modules/user/role';
import base64 from '@/helpers/base64';
import lang from '@/helpers/lang';
import IUserForm from '@/interfaces/modules/user/userForm';
import IAlert from '@/interfaces/molecules/alert/alert';
import user from '@/stores/user';

useMeta({
  title: lang('user.name'),
});

const { Item } = Form;
const { Password } = Input;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
const { Option } = Select;
const { create } = user();

const formRef = ref<FormInstance>();
const titleRef = ref<HTMLElement|null>();
const loading = ref(false);
const phoneMask = '+7-###-###-####';
const image = ref<string | ArrayBuffer | null>();

const alert = ref<IAlert>({
  message: null,
  type: undefined,
});

const form = ref<IUserForm>({
  login: '',
  password: '',
  first_name: null,
  second_name: null,
  phone: null,
  two_factor: false,
  invitation: false,
  verified: false,
  status: true,
  role: null,
  image: null,
});

const onClickReset = (): void => {
  formRef.value?.resetFields();
  form.value.two_factor = false;
  form.value.invitation = false;
  form.value.verified = false;
};

const onSubmit = async (): Promise<void> => {
  alert.value.message = '';
  loading.value = true;

  try {
    await create(form.value);

    alert.value.message = lang('dashboard.successCreateText');
    alert.value.type = 'success';
    form.value.image = null;
    image.value = null;
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
  image.value = await base64(file);

  return false;
};

const onClickImageDestroy = async (): Promise<void> => {
  Modal.confirm({
    title: lang('dashboard.alert'),
    icon: createVNode(ExclamationCircleOutlined),
    content: lang('dashboard.confirmDestroyImage'),
    async onOk() {
      form.value.image = null;
      image.value = null;
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
