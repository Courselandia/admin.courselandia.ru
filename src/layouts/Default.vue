<template>
  <Layout class="height--screen">
    <Header />
    <Layout>
      <Sider />
      <Layout style="padding: 0 24px 24px; overflow: auto">
        <div>
          <slot />
        </div>
      </Layout>
    </Layout>
  </Layout>
</template>

<script lang="ts" setup>
import Layout from 'ant-design-vue/lib/layout';

import Header from '@/components/modules/dashboard/organisms/Header.vue';
import Sider from '@/components/modules/dashboard/organisms/Sider.vue';
</script>
