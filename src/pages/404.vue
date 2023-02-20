<template>
  <Col :span="24">
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
          <Lang value="dashboard.backHome" />
        </Button>
      </template>
    </Result>
  </Col>
</template>

<script lang="ts" setup>
import Button from 'ant-design-vue/lib/button';
import Col from 'ant-design-vue/lib/col';
import Result from 'ant-design-vue/lib/result';
import { useMeta } from 'vue-meta';
import { useRouter } from 'vue-router';

import Lang from '@/components/atoms/Lang.vue';
import lang from '@/helpers/lang';
import access from '@/stores/access';

const router = useRouter();
const { user } = access();

useMeta({
  title: lang('dashboard.page404'),
});

const onClickBackHome = () => {
  router.push({
    name: user ? 'Dashboard' : 'Entrance',
  });
};
</script>
