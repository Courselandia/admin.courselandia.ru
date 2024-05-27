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
          @click="onClickBreadcrumbItem('Promocodes')"
        >
          <Lang value="promocode.name" />
        </Item>
        <Item>
          <Lang value="promocode.updatePromocode" />
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
          <Lang value="promocode.name" />
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
import FormUpdate from '@/components/modules/promocode/organisms/FormUpdate.vue';
import lang from '@/helpers/lang';
import promocode from '@/stores/promocode';

const {
  Item,
} = Breadcrumb;
const { item } = storeToRefs(promocode());

const router = useRouter();

useMeta({
  title: lang('promocode.updatePromocode'),
});

const onClickBreadcrumbItem = async (name: string) => {
  await router.push({
    name,
  });
};

const onClickBackHome = () => {
  router.push({
    name: 'Promocodes',
  });
};
</script>
