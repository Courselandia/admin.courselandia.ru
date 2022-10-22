<template>
  <Col
    :xxxl="6"
    :xxl="6"
    :xl="8"
    :lg="9"
    :md="12"
    :sm="15"
    :xs="20"
  >
    <Form />
  </Col>
</template>

<script lang="ts" setup>
import Col from 'ant-design-vue/lib/col';

import Form from '@/components/modules/access/organisms/Form.vue';
</script>
