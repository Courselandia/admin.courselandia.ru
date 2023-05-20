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
        @click="onClickBreadcrumbItem('Articles')"
      >
        <Lang value="article.name" />
      </Item>
      <Item>
        <Lang value="article.writeArticle" />
      </Item>
    </Breadcrumb>
    <FormWrite />
  </div>
</template>

<script lang="ts" setup>
import Breadcrumb from 'ant-design-vue/lib/breadcrumb';
import { useMeta } from 'vue-meta';
import { useRouter } from 'vue-router';

import Lang from '@/components/atoms/Lang.vue';
import FormWrite from '@/components/modules/article/organisms/FormWrite.vue';
import lang from '@/helpers/lang';

const {
  Item,
} = Breadcrumb;

const router = useRouter();

useMeta({
  title: lang('article.writeArticle'),
});

const onClickBreadcrumbItem = async (name: string) => {
  await router.push({
    name,
  });
};

const onClickBackHome = () => {
  router.push({
    name: 'Articles',
  });
};
</script>
