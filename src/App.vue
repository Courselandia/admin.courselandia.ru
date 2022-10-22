<template>
  <metainfo>
    <template
      #title="{ content }"
    >
      {{ content }}
    </template>
    <template
      #description="{ description }"
    >
      {{ description }}
    </template>
  </metainfo>
  <component
    :is="layout"
    v-if="layout"
  >
    <router-view v-slot="{ Component, route }">
      <ConfigProvider :locale="ruRU">
        <transition
          name="fade"
          mode="out-in"
        >
          <component
            :is="Component"
            :key="route.path"
          />
        </transition>
      </ConfigProvider>
    </router-view>
  </component>
</template>

<script lang="ts" setup>
import ruRU from 'ant-design-vue/es/locale/ru_RU';
import ConfigProvider from 'ant-design-vue/lib/config-provider';
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const routeCurrent = useRoute();
const layout = computed(() => routeCurrent.meta.layout);
</script>

<style lang="scss">
@import '@/assets/main.scss';
</style>
