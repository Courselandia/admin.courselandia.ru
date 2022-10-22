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
        <Lang value="user.name" />
      </Item>
    </Breadcrumb>
    <Content class="content__panel">
      <Table />
    </Content>
  </div>
</template>

<script lang="ts" setup>
import Breadcrumb from 'ant-design-vue/lib/breadcrumb';
import Layout from 'ant-design-vue/lib/layout';
import { useMeta } from 'vue-meta';
import { useRouter } from 'vue-router';

import Lang from '@/components/atoms/Lang.vue';
import Table from '@/components/modules/user/organisms/Table.vue';
import lang from '@/helpers/lang';

const {
  Content,
} = Layout;

const {
  Item,
} = Breadcrumb;

const router = useRouter();

useMeta({
  title: lang('user.name'),
});

const onClickBreadcrumbItem = async (name: string) => {
  await router.push({
    name,
  });
};
</script>
