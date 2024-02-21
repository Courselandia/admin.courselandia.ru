<template>
  <Sider
    breakpoint="lg"
    width="200"
    style="background: #fff; overflow-y: auto; overflow-x: hidden"
  >
    <Menu
      v-model:selectedKeys="menu"
      v-model:openKeys="opens"
      mode="inline"
      :style="{ height: '100%', borderRight: 0 }"
    >
      <Item
        v-if="hasRole([ERole.ADMIN, ERole.MANAGER])"
        key="courses"
        @click="onClickMenuItem('Courses')"
      >
        <template #icon>
          <AuditOutlined />
        </template>
        <Lang value="course.name" />
      </Item>
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
        key="sections"
        @click="onClickMenuItem('Sections')"
      >
        <template #icon>
          <FileTextOutlined />
        </template>
        <Lang value="sections.name" />
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
        key="categories"
        @click="onClickMenuItem('Categories')"
      >
        <template #icon>
          <AppstoreOutlined />
        </template>
        <Lang value="category.name" />
      </Item>
      <Item
        v-if="hasRole([ERole.ADMIN, ERole.MANAGER])"
        key="skills"
        @click="onClickMenuItem('Skills')"
      >
        <template #icon>
          <FormatPainterOutlined />
        </template>
        <Lang value="skill.name" />
      </Item>
      <Item
        v-if="hasRole([ERole.ADMIN, ERole.MANAGER])"
        key="tools"
        @click="onClickMenuItem('Tools')"
      >
        <template #icon>
          <ToolOutlined />
        </template>
        <Lang value="tool.name" />
      </Item>
      <Item
        v-if="hasRole([ERole.ADMIN, ERole.MANAGER])"
        key="schools"
        @click="onClickMenuItem('Schools')"
      >
        <template #icon>
          <ShopOutlined />
        </template>
        <Lang value="school.name" />
      </Item>
      <Item
        v-if="hasRole([ERole.ADMIN, ERole.MANAGER])"
        key="teachers"
        @click="onClickMenuItem('Teachers')"
      >
        <template #icon>
          <RobotOutlined />
        </template>
        <Lang value="teacher.name" />
      </Item>
      <Item
        v-if="hasRole([ERole.ADMIN, ERole.MANAGER])"
        key="employments"
        @click="onClickMenuItem('Employments')"
      >
        <template #icon>
          <IdcardOutlined />
        </template>
        <Lang value="employment.name" />
      </Item>
      <Item
        v-if="hasRole([ERole.ADMIN, ERole.MANAGER])"
        key="processes"
        @click="onClickMenuItem('Processes')"
      >
        <template #icon>
          <RocketOutlined />
        </template>
        <Lang value="process.name" />
      </Item>
      <Item
        v-if="hasRole([ERole.ADMIN, ERole.MANAGER])"
        key="salaries"
        @click="onClickMenuItem('Salaries')"
      >
        <template #icon>
          <DollarCircleOutlined />
        </template>
        <Lang value="salary.name" />
      </Item>
      <Item
        v-if="hasRole([ERole.ADMIN, ERole.MANAGER])"
        key="reviews"
        @click="onClickMenuItem('Reviews')"
      >
        <template #icon>
          <MessageOutlined />
        </template>
        <Lang value="review.name" />
      </Item>
      <Item
        v-if="hasRole([ERole.ADMIN, ERole.MANAGER])"
        key="faqs"
        @click="onClickMenuItem('Faqs')"
      >
        <template #icon>
          <QuestionOutlined />
        </template>
        <Lang value="faq.name" />
      </Item>
      <Item
        v-if="hasRole([ERole.ADMIN, ERole.MANAGER])"
        key="articles"
        @click="onClickMenuItem('Articles')"
      >
        <template #icon>
          <ReadOutlined />
        </template>
        <Lang value="article.name" />
      </Item>
      <Item
        v-if="hasRole([ERole.ADMIN, ERole.MANAGER])"
        key="analyzers"
        @click="onClickMenuItem('Analyzers')"
      >
        <template #icon>
          <ProjectOutlined />
        </template>
        <Lang value="analyzer.name" />
      </Item>
      <Item
        v-if="hasRole([ERole.ADMIN, ERole.MANAGER])"
        key="crawls"
        @click="onClickMenuItem('Crawls')"
      >
        <template #icon>
          <BugOutlined />
        </template>
        <Lang value="crawl.name" />
      </Item>
      <Item
        v-if="hasRole([ERole.ADMIN, ERole.MANAGER])"
        key="feedbacks"
        @click="onClickMenuItem('Feedbacks')"
      >
        <template #icon>
          <MailOutlined />
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
        v-if="hasRole([ERole.ADMIN, ERole.MANAGER])"
        key="tasks"
        @click="onClickMenuItem('Tasks')"
      >
        <template #icon>
          <SisternodeOutlined />
        </template>
        <Lang value="task.name" />
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
  AppstoreOutlined,
  AuditOutlined,
  BarsOutlined,
  BugOutlined,
  ContactsOutlined,
  DollarCircleOutlined,
  FileTextOutlined,
  FormatPainterOutlined,
  IdcardOutlined,
  MailOutlined,
  MessageOutlined,
  NodeIndexOutlined,
  NotificationOutlined,
  ProjectOutlined,
  QuestionOutlined,
  ReadOutlined,
  RobotOutlined,
  RocketOutlined,
  ShopOutlined,
  SisternodeOutlined,
  TeamOutlined,
  ToolOutlined,
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
import ERole from '@/enums/modules/user/role';
import access from '@/stores/access';

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
  const paths: Record<string, string> = {
    users: '/dashboard/users',
    courses: '/dashboard/courses',
    publications: '/dashboard/publications',
    sections: '/dashboard/sections',
    directions: '/dashboard/directions',
    crawls: '/dashboard/crawls',
    articles: '/dashboard/articles',
    analyzers: '/dashboard/analyzers',
    professions: '/dashboard/professions',
    categories: '/dashboard/categories',
    skills: '/dashboard/skills',
    tools: '/dashboard/tools',
    schools: '/dashboard/schools',
    teachers: '/dashboard/teachers',
    employments: '/dashboard/employments',
    processes: '/dashboard/processes',
    salaries: '/dashboard/salaries',
    reviews: '/dashboard/reviews',
    faqs: '/dashboard/faqs',
    alerts: '/dashboard/alerts',
    tasks: '/dashboard/tasks',
    feedbacks: '/dashboard/feedbacks',
    logs: '/dashboard/logs',
  };

  let found = false;
  rt.matched.forEach(({ path }) => {
    Object.keys(paths).some((pathItem) => {
      if (path.indexOf(paths[pathItem]) !== -1) {
        menu.value[0] = pathItem;
        found = true;
      }

      return false;
    });
  });

  if (!found) {
    menu.value = [];
  }
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
