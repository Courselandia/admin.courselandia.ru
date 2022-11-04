<template>
  <Card :title="lang('dashboard.loginForm')">
    <Alert
      v-if="alert.message"
      :message="alert.type === 'success' ? lang('dashboard.success') : lang('dashboard.error')"
      :description="alert.message"
      :type="alert.type"
      class="mb-25"
    />

    <Form
      ref="formRef"
      :model="form"
      :label-col="{span: 5}"
      :wrapper-col="{span: 19}"
      autocomplete="off"
      @finish="onSubmit"
    >
      <Item
        :label="lang('dashboard.login')"
        name="login"
        :rules="[{ required: true, type: 'email' }]"
      >
        <Input v-model:value="form.login" />
      </Item>

      <Item
        :label="lang('dashboard.password')"
        name="password"
        :rules="[{ required: true }]"
      >
        <Password
          v-model:value="form.password"
        />
      </Item>

      <Item
        :wrapper-col="{offset: 5, span: 19}"
        name="remember"
        class="buttons-flex"
      >
        <Checkbox
          v-model:checked="form.remember"
        >
          <Lang value="dashboard.rememberMe" />
        </Checkbox>
      </Item>

      <Item
        :wrapper-col="{offset: 5, span: 19}"
        class="mb-0 buttons-flex"
      >
        <Space>
          <Button
            :loading="loading"
            type="primary"
            html-type="submit"
          >
            <span>
              <Lang value="dashboard.enter" />
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
</template>

<script lang="ts" setup>
import type { FormInstance } from 'ant-design-vue';
import Alert from 'ant-design-vue/lib/alert';
import Button from 'ant-design-vue/lib/button';
import Card from 'ant-design-vue/lib/card';
import Checkbox from 'ant-design-vue/lib/checkbox';
import Form from 'ant-design-vue/lib/form';
import Input from 'ant-design-vue/lib/input';
import Space from 'ant-design-vue/lib/space';
import { ref } from 'vue';
import { useMeta } from 'vue-meta';
import { useRouter } from 'vue-router';

import Lang from '@/components/atoms/Lang.vue';
import ERole from '@/enums/modules/user/role';
import lang from '@/helpers/lang';
import { IForm } from '@/interfaces/modules/access/organisms/form';
import IAlert from '@/interfaces/molecules/alert/alert';
import access from '@/store/access';

const { Item } = Form;
const { Password } = Input;
const { signIn } = access();
const router = useRouter();

useMeta({
  title: lang('dashboard.adminSystem'),
});

const formRef = ref<FormInstance>();

const loading = ref(false);
const form = ref<IForm>({
  login: '',
  password: '',
  remember: false,
});
const alert = ref<IAlert>({
  message: null,
  type: null,
});

const onSubmit = async () => {
  alert.value.message = '';
  loading.value = true;

  try {
    const result = await signIn(form.value.login, form.value.password, form.value.remember);
    const nameRole = result.data.user.role.name;

    if (nameRole === ERole.ADMIN || nameRole === ERole.MANAGER) {
      await router.push({
        name: 'Dashboard',
      });
    } else {
      alert.value.message = lang('access.errorWrongRole');
      alert.value.type = 'error';
    }
  } catch (error: Error | any) {
    alert.value.message = error.response.data.message ? error.response.data.message : error.message;
    alert.value.type = 'error';

    loading.value = false;
  }
};

const onClickReset = (): void => {
  formRef.value?.resetFields();
};
</script>
