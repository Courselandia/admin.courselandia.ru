<template>
  <div class="content">
    <Breadcrumb class="content__breadcrumbs">
      <Item
        href=""
        @click="onClickBreadcrumbItem('Dashboard')"
      >
        <Lang value="dashboard.home" />
      </Item>
      <Item>
        <Lang value="dashboard.profile" />
      </Item>
    </Breadcrumb>
    <Form />
  </div>
</template>

<script lang="ts" setup>
import Breadcrumb from 'ant-design-vue/lib/breadcrumb';
import { useMeta } from 'vue-meta';
import { useRouter } from 'vue-router';

import Lang from '@/components/atoms/Lang.vue';
import Form from '@/components/modules/profile/organisms/Form.vue';
import lang from '@/helpers/lang';

const {
  Item,
} = Breadcrumb;

const router = useRouter();

useMeta({
  title: lang('dashboard.profile'),
});

const onClickBreadcrumbItem = async (name: string) => {
  await router.push({
    name,
  });
};
</script>
