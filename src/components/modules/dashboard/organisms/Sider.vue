<template>
  <Sider
    breakpoint="lg"
    width="200"
    style="background: #fff"
  >
    <Menu
      v-model:selectedKeys="menu"
      v-model:openKeys="opens"
      mode="inline"
      :style="{ height: '100%', borderRight: 0 }"
    >
      <Item
        v-if="hasRole([ERole.ADMIN, ERole.MANAGER])"
        key="publications"
        @click="onClickMenuItem('Publications')"
      >
        <template #icon>
          <FileTextOutlined />
        </template>
        <Lang value="publication.name" />
      </Item>
      <Item
        v-if="hasRole([ERole.ADMIN, ERole.MANAGER])"
        key="directions"
        @click="onClickMenuItem('Directions')"
      >
        <template #icon>
          <NodeIndexOutlined />
        </template>
        <Lang value="direction.name" />
      </Item>
      <Item
        v-if="hasRole([ERole.ADMIN, ERole.MANAGER])"
        key="professions"
        @click="onClickMenuItem('Professions')"
      >
        <template #icon>
          <ContactsOutlined />
        </template>
        <Lang value="profession.name" />
      </Item>
      <Item
        v-if="hasRole([ERole.ADMIN, ERole.MANAGER])"
        key="feedbacks"
        @click="onClickMenuItem('Feedbacks')"
      >
        <template #icon>
          <MessageOutlined />
        </template>
        <Lang value="feedback.name" />
      </Item>
      <Item
        v-if="hasRole([ERole.ADMIN])"
        key="users"
        @click="onClickMenuItem('Users')"
      >
        <template #icon>
          <TeamOutlined />
        </template>
        <Lang value="user.name" />
      </Item>
      <Item
        v-if="hasRole([ERole.ADMIN, ERole.MANAGER])"
        key="alerts"
        @click="onClickMenuItem('Alerts')"
      >
        <template #icon>
          <NotificationOutlined />
        </template>
        <Lang value="dashboard.alerts" />
      </Item>
      <Item
        v-if="hasRole([ERole.ADMIN])"
        key="logs"
        @click="onClickMenuItem('Logs')"
      >
        <template #icon>
          <BarsOutlined />
        </template>
        <Lang value="log.name" />
      </Item>
    </Menu>
  </Sider>
</template>

<script lang="ts" setup>
import {
  BarsOutlined,
  ContactsOutlined,
  FileTextOutlined,
  MessageOutlined,
  NodeIndexOutlined,
  NotificationOutlined,
  TeamOutlined,
} from '@ant-design/icons-vue';
import Layout from 'ant-design-vue/lib/layout';
import Menu from 'ant-design-vue/lib/menu';
import { storeToRefs } from 'pinia';
import { onMounted, ref, watch } from 'vue';
import {
  RouteLocationNormalizedLoaded,
  useRoute,
  useRouter,
} from 'vue-router';

import Lang from '@/components/atoms/Lang.vue';
import ERole from '@/enums/role';
import access from '@/store/access';

const router = useRouter();
const route = useRoute();

const {
  Sider,
} = Layout;

const {
  Item,
} = Menu;

const { role } = storeToRefs(access());

const menu = ref<Array<string>>([]);
const opens = ref<Array<string>>([]);

const onClickMenuItem = (name: string): void => {
  router.push({
    name,
  });
};

const select = (rt: RouteLocationNormalizedLoaded) => {
  rt.matched.forEach(({ path }) => {
    if (path.indexOf('/dashboard/users') !== -1) {
      menu.value[0] = 'users';
    } else if (path.indexOf('/dashboard/publications') !== -1) {
      menu.value[0] = 'publications';
    } else if (path.indexOf('/dashboard/directions') !== -1) {
      menu.value[0] = 'directions';
    } else if (path.indexOf('/dashboard/professions') !== -1) {
      menu.value[0] = 'professions';
    } else if (path.indexOf('/dashboard/alerts') !== -1) {
      menu.value[0] = 'alerts';
    } else if (path.indexOf('/dashboard/feedbacks') !== -1) {
      menu.value[0] = 'feedbacks';
    } else if (path.indexOf('/dashboard/logs') !== -1) {
      menu.value[0] = 'logs';
    } else {
      menu.value = [];
    }
  });
};

watch(route, (): void => {
  select(route);
});

onMounted(() => {
  select(route);
});

const hasRole = (roles: Array<ERole>) => {
  if (role?.value) {
    return roles.indexOf(role?.value) !== -1;
  }

  return false;
};
</script>
