<template>
  <Header class="menu">
    <div class="menu__item menu__item--logo">
      <div class="logo">
        Courselandia.ru
      </div>
    </div>
    <div class="menu__item menu__item--center">
      <Menu
        v-model:selectedKeys="menu"
        :style="{ lineHeight: '64px' }"
        :selectable="false"
        theme="dark"
        mode="horizontal"
      >
        <Item
          key="home"
          @click="onClickHome"
        >
          <template #icon>
            <HomeOutlined />
          </template>
          <Lang value="dashboard.home" />
        </Item>
        <Item
          key="clear"
          @click="onClickCleanCache"
        >
          <template #icon>
            <LoadingOutlined v-if="cacheLoading" />
            <ClearOutlined v-else />
          </template>
          <Lang value="dashboard.cleanCache" />
        </Item>
        <Item
          key="alerts"
          @click="onClickAlerts"
        >
          <template #icon>
            <NotificationOutlined />
          </template>
          <Lang value="dashboard.alerts" /> <Badge
            :count="count"
            class="ml-5"
          />
        </Item>
      </Menu>
    </div>
    <div class="menu__item menu__item--right">
      <Menu
        v-model:selectedKeys="menu"
        :style="{ lineHeight: '64px', 'justify-content': 'end' }"
        :selectable="false"
        theme="dark"
        mode="horizontal"
      >
        <SubMenu key="users">
          <template
            v-if="nameUser"
            #title
          >
            <UserOutlined />
            {{ nameUser }}
          </template>
          <Item
            key="profile"
            @click="onClickProfile"
          >
            <template #icon>
              <ContactsOutlined />
            </template>
            <Lang value="dashboard.profile" />
          </Item>
          <Item
            key="logout"
            @click="onClickLogout"
          >
            <template #icon>
              <LoadingOutlined v-if="logoutLoading" />
              <LogoutOutlined v-else />
            </template>
            <Lang value="dashboard.logout" />
          </Item>
        </SubMenu>
      </Menu>
    </div>
  </Header>
</template>

<script lang="ts" setup>
import {
  ClearOutlined,
  ContactsOutlined,
  ExclamationCircleOutlined,
  HomeOutlined,
  LoadingOutlined,
  LogoutOutlined,
  MehOutlined,
  NotificationOutlined,
  SmileOutlined,
  UserOutlined,
} from '@ant-design/icons-vue';
import Badge from 'ant-design-vue/lib/badge';
import Layout from 'ant-design-vue/lib/layout';
import Menu from 'ant-design-vue/lib/menu';
import Modal from 'ant-design-vue/lib/modal';
import notification from 'ant-design-vue/lib/notification';
import { storeToRefs } from 'pinia';
import {
  computed,
  createVNode,
  h,
  onMounted,
  ref,
} from 'vue';
import { useRouter } from 'vue-router';

import Lang from '@/components/atoms/Lang.vue';
import lang from '@/helpers/lang';
import access from '@/stores/access';
import alert from '@/stores/alert';
import cache from '@/stores/cache';

const {
  countUnread,
} = alert();

const {
  count,
} = storeToRefs(alert());

const {
  Header,
} = Layout;

const {
  Item,
  SubMenu,
} = Menu;

const { clean } = cache();
const { logOut } = access();
const { user } = storeToRefs(access());

const router = useRouter();
const menu = ref<Array<string>>([]);
const cacheLoading = ref(false);
const logoutLoading = ref(false);

const nameUser = computed(() => {
  if (user.value) {
    if (user.value?.first_name || user.value?.second_name) {
      return `${user.value?.first_name} ${user.value?.second_name}`;
    }

    return user.value?.login;
  }

  return '';
});

onMounted(async (): Promise<void> => {
  try {
    await countUnread();
  } catch (error: Error | any) {
    notification.open({
      icon: () => h(MehOutlined, { style: 'color: #ff0000' }),
      message: lang('dashboard.error'),
      description: error.message,
      style: {
        color: '#ff0000',
      },
    });
  }
});

const onClickHome = (): void => {
  router.push({
    name: 'Dashboard',
  });
};

const onClickCleanCache = async (): Promise<void> => {
  cacheLoading.value = true;

  try {
    await clean();
    cacheLoading.value = false;

    notification.open({
      icon: () => h(SmileOutlined, { style: 'color: #108ee9' }),
      message: lang('dashboard.cleanCache'),
      description: lang('dashboard.cleanedCache'),
    });
  } catch (error: Error | any) {
    notification.open({
      icon: () => h(MehOutlined, { style: 'color: #ff0000' }),
      message: lang('dashboard.cleanCache'),
      description: error.response.data.message ? error.response.data.message : error.message,
      style: {
        color: '#ff0000',
      },
    });

    cacheLoading.value = false;
  }
};

const onClickAlerts = (): void => {
  router.push({
    name: 'Alerts',
  });
};

const onClickProfile = (): void => {
  router.push({
    name: 'Profile',
  });
};

const onClickLogout = async (): Promise<void> => {
  Modal.confirm({
    title: lang('dashboard.alert'),
    icon: createVNode(ExclamationCircleOutlined),
    content: lang('dashboard.confirmLogout'),
    async onOk() {
      logoutLoading.value = true;

      try {
        await logOut();
        await router.push({
          name: 'Entrance',
        });
      } catch (error: Error | any) {
        notification.open({
          icon: () => h(MehOutlined, { style: 'color: #ff0000' }),
          message: lang('dashboard.cleanCache'),
          description: error.response.data.message ? error.response.data.message : error.message,
          style: {
            color: '#ff0000',
          },
        });

        logoutLoading.value = false;
      }
    },
  });
};
</script>

<style lang="scss">
@import '@/assets/components/atoms/logo.scss';
@import '@/assets/components/organisms/menu.scss';

.ant-layout-header {
  display: flex;
}
</style>
