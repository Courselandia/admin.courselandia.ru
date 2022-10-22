<template>
  <div v-if="item">
    <div class="content">
      <Breadcrumb class="content__breadcrumbs">
        <Item
          href=""
          @click="onClickBreadcrumbItem('Dashboard')"
        >
          <Lang value="dashboard.home" />
        </Item>
        <Item
          href=""
          @click="onClickBreadcrumbItem('Users')"
        >
          <Lang value="user.name" />
        </Item>
        <Item>
          <Lang value="user.updateUser" />
        </Item>
      </Breadcrumb>
      <FormUpdate />
    </div>
  </div>
  <div v-else>
    <Result
      status="404"
      title="404"
      :sub-title="lang('dashboard.description404')"
    >
      <template #extra>
        <Button
          type="primary"
          @click="onClickBackHome"
        >
          <Lang value="user.name" />
        </Button>
      </template>
    </Result>
  </div>
</template>

<script lang="ts" setup>
import {
  Breadcrumb,
  Button,
  Result,
} from 'ant-design-vue';
import { storeToRefs } from 'pinia';
import { useMeta } from 'vue-meta';
import { useRouter } from 'vue-router';

import Lang from '@/components/atoms/Lang.vue';
import FormUpdate from '@/components/modules/user/organisms/FormUpdate.vue';
import lang from '@/helpers/lang';
import user from '@/store/user';

const {
  Item,
} = Breadcrumb;
const { item } = storeToRefs(user());

const router = useRouter();

useMeta({
  title: lang('user.updateUser'),
});

const onClickBreadcrumbItem = async (name: string) => {
  await router.push({
    name,
  });
};

const onClickBackHome = () => {
  router.push({
    name: 'Users',
  });
};
</script>
