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
          @click="onClickBreadcrumbItem('Employments')"
        >
          <Lang value="employment.name" />
        </Item>
        <Item>
          <Lang value="employment.updateEmployment" />
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
          <Lang value="employment.name" />
        </Button>
      </template>
    </Result>
  </div>
</template>

<script lang="ts" setup>
import Breadcrumb from 'ant-design-vue/lib/breadcrumb';
import Button from 'ant-design-vue/lib/button';
import Result from 'ant-design-vue/lib/result';
import { storeToRefs } from 'pinia';
import { useMeta } from 'vue-meta';
import { useRouter } from 'vue-router';

import Lang from '@/components/atoms/Lang.vue';
import FormUpdate from '@/components/modules/employment/organisms/FormUpdate.vue';
import lang from '@/helpers/lang';
import employment from '@/stores/employment';

const {
  Item,
} = Breadcrumb;
const { item } = storeToRefs(employment());

const router = useRouter();

useMeta({
  title: lang('employment.updateEmployment'),
});

const onClickBreadcrumbItem = async (name: string) => {
  await router.push({
    name,
  });
};

const onClickBackHome = () => {
  router.push({
    name: 'Employments',
  });
};
</script>
