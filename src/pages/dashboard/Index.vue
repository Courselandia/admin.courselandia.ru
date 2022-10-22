<template>
  <div class="content">
    <Breadcrumb class="content__breadcrumbs">
      <Item>
        <Lang value="dashboard.home" />
      </Item>
    </Breadcrumb>
    <Content class="content__panel pa-24">
      Dashboard
    </Content>
  </div>
</template>

<script lang="ts" setup>
import Breadcrumb from 'ant-design-vue/lib/breadcrumb';
import Layout from 'ant-design-vue/lib/layout';
import { useMeta } from 'vue-meta';

import Lang from '@/components/atoms/Lang.vue';
import lang from '@/helpers/lang';

const {
  Content,
} = Layout;

const {
  Item,
} = Breadcrumb;

useMeta({
  title: lang('dashboard.dashboard'),
});
</script>
