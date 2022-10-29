<template>
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
        @click="onClickBreadcrumbItem('Tools')"
      >
        <Lang value="tool.name" />
      </Item>
      <Item>
        <Lang value="tool.addTool" />
      </Item>
    </Breadcrumb>
    <FormCreate />
  </div>
</template>

<script lang="ts" setup>
import Breadcrumb from 'ant-design-vue/lib/breadcrumb';
import { useMeta } from 'vue-meta';
import { useRouter } from 'vue-router';

import Lang from '@/components/atoms/Lang.vue';
import FormCreate from '@/components/modules/tool/organisms/FormCreate.vue';
import lang from '@/helpers/lang';

const {
  Item,
} = Breadcrumb;

const router = useRouter();

useMeta({
  title: lang('tool.addTool'),
});

const onClickBreadcrumbItem = async (name: string) => {
  await router.push({
    name,
  });
};
</script>
