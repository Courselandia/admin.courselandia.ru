<template>
  <Layout>
    <Content>
      <Row
        type="flex"
        justify="center"
        align="middle"
        :style="{ minHeight: '100vh' }"
      >
        <slot />
      </Row>
    </Content>
  </Layout>
</template>

<script lang="ts" setup>
import Layout from 'ant-design-vue/lib/layout';
import Row from 'ant-design-vue/lib/row';

const { Content } = Layout;
</script>
