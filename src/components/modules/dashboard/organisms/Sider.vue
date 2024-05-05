<template>
  <Sider
    breakpoint="lg"
    width="230"
    style="background: #fff; overflow-y: auto; overflow-x: hidden"
  >
    <Menu
      v-model:selectedKeys="selected"
      v-model:openKeys="opened"
      :items="items"
      mode="inline"
      :style="{ height: '100%', borderRight: 0 }"
      @click="onClickMenu"
    />
  </Sider>
</template>

<script lang="ts" setup>
import {
  AppstoreOutlined,
  AuditOutlined,
  BarsOutlined,
  BugOutlined,
  BuildOutlined,
  CodeOutlined,
  CompassOutlined,
  ContactsOutlined,
  DatabaseOutlined,
  DollarCircleOutlined,
  FileTextOutlined,
  FormatPainterOutlined,
  IdcardOutlined,
  LaptopOutlined,
  MailOutlined,
  MessageOutlined,
  NodeIndexOutlined,
  NotificationOutlined,
  ProfileOutlined,
  ProjectOutlined,
  QuestionOutlined,
  ReadOutlined,
  RobotOutlined,
  RocketOutlined,
  ShopOutlined,
  SisternodeOutlined,
  SolutionOutlined,
  SoundOutlined,
  TagsOutlined,
  TeamOutlined,
  ToolOutlined,
} from '@ant-design/icons-vue';
import type { Key } from 'ant-design-vue/es/_util/type';
import Layout from 'ant-design-vue/lib/layout';
import Menu from 'ant-design-vue/lib/menu';
import { storeToRefs } from 'pinia';
import {
  computed,
  h,
  onMounted,
  ref,
  watch,
} from 'vue';
import {
  RouteLocationNormalizedLoaded,
  useRoute,
  useRouter,
} from 'vue-router';

import ERole from '@/enums/modules/user/role';
import lang from '@/helpers/lang';
import access from '@/stores/access';
import type { ItemType } from '@/types/itemType';

const router = useRouter();
const route = useRoute();

const {
  Sider,
} = Layout;

const { role } = storeToRefs(access());

const selected = ref<Array<Key>>([]);
const opened = ref<Array<Key>>([]);

const hasRole = (roles: Array<ERole>) => {
  if (role?.value) {
    return roles.indexOf(role?.value) !== -1;
  }

  return false;
};

const items = computed<ItemType[]>((): ItemType[] => {
  let result: ItemType[] = [
    {
      key: 'Catalog',
      icon: () => h(DatabaseOutlined),
      label: lang('dashboard.catalog'),
      title: lang('dashboard.catalog') as string,
      children: [
        {
          key: 'Courses',
          icon: () => h(AuditOutlined),
          label: lang('course.name'),
          title: lang('course.name') as string,
          visible: hasRole([ERole.ADMIN, ERole.MANAGER]),
          path: '/dashboard/courses',
        },
        {
          key: 'Sections',
          icon: () => h(BuildOutlined),
          label: lang('section.name'),
          title: lang('section.name') as string,
          visible: hasRole([ERole.ADMIN, ERole.MANAGER]),
          path: '/dashboard/sections',
        },
        {
          key: 'Collections',
          icon: () => h(CompassOutlined),
          label: lang('collection.name'),
          title: lang('collection.name') as string,
          visible: hasRole([ERole.ADMIN, ERole.MANAGER]),
          path: '/dashboard/collections',
        },
        {
          key: 'Directions',
          icon: () => h(NodeIndexOutlined),
          label: lang('direction.name'),
          title: lang('direction.name') as string,
          visible: hasRole([ERole.ADMIN, ERole.MANAGER]),
          path: '/dashboard/directions',
        },
        {
          key: 'Professions',
          icon: () => h(ContactsOutlined),
          label: lang('profession.name'),
          title: lang('profession.name') as string,
          visible: hasRole([ERole.ADMIN, ERole.MANAGER]),
          path: '/dashboard/professions',
        },
        {
          key: 'Categories',
          icon: () => h(AppstoreOutlined),
          label: lang('category.name'),
          title: lang('category.name') as string,
          visible: hasRole([ERole.ADMIN, ERole.MANAGER]),
          path: '/dashboard/categories',
        },
        {
          key: 'Skills',
          icon: () => h(FormatPainterOutlined),
          label: lang('skill.name'),
          title: lang('skill.name') as string,
          visible: hasRole([ERole.ADMIN, ERole.MANAGER]),
          path: '/dashboard/skills',
        },
        {
          key: 'Tools',
          icon: () => h(ToolOutlined),
          label: lang('tool.name'),
          title: lang('tool.name') as string,
          visible: hasRole([ERole.ADMIN, ERole.MANAGER]),
          path: '/dashboard/tools',
        },
        {
          key: 'Schools',
          icon: () => h(ShopOutlined),
          label: lang('school.name'),
          title: lang('school.name') as string,
          visible: hasRole([ERole.ADMIN, ERole.MANAGER]),
          path: '/dashboard/schools',
        },
        {
          key: 'Teachers',
          icon: () => h(RobotOutlined),
          label: lang('teacher.name'),
          title: lang('teacher.name') as string,
          visible: hasRole([ERole.ADMIN, ERole.MANAGER]),
          path: '/dashboard/teachers',
        },
        {
          key: 'Employments',
          icon: () => h(IdcardOutlined),
          label: lang('employment.name'),
          title: lang('employment.name') as string,
          visible: hasRole([ERole.ADMIN, ERole.MANAGER]),
          path: '/dashboard/employments',
        },
        {
          key: 'Processes',
          icon: () => h(RocketOutlined),
          label: lang('process.name'),
          title: lang('process.name') as string,
          visible: hasRole([ERole.ADMIN, ERole.MANAGER]),
          path: '/dashboard/processes',
        },
        {
          key: 'Salaries',
          icon: () => h(DollarCircleOutlined),
          label: lang('salary.name'),
          title: lang('salary.name') as string,
          visible: hasRole([ERole.ADMIN, ERole.MANAGER]),
          path: '/dashboard/salaries',
        },
        {
          key: 'Promocodes',
          icon: () => h(TagsOutlined),
          label: lang('promocode.name'),
          title: lang('promocode.name') as string,
          visible: hasRole([ERole.ADMIN, ERole.MANAGER]),
          path: '/dashboard/promocodes',
        },
        {
          key: 'Promotions',
          icon: () => h(SoundOutlined),
          label: lang('promotion.name'),
          title: lang('promotion.name') as string,
          visible: hasRole([ERole.ADMIN, ERole.MANAGER]),
          path: '/dashboard/promotions',
        },
      ],
    },
    {
      key: 'Content',
      icon: () => h(SolutionOutlined),
      label: lang('dashboard.content'),
      title: lang('dashboard.content') as string,
      children: [
        {
          key: 'Publications',
          icon: () => h(FileTextOutlined),
          label: lang('publication.name'),
          title: lang('publication.name') as string,
          visible: hasRole([ERole.ADMIN, ERole.MANAGER]),
          path: '/dashboard/publications',
        },
        {
          key: 'Reviews',
          icon: () => h(MessageOutlined),
          label: lang('review.name'),
          title: lang('review.name') as string,
          visible: hasRole([ERole.ADMIN, ERole.MANAGER]),
          path: '/dashboard/reviews',
        },
        {
          key: 'Faqs',
          icon: () => h(QuestionOutlined),
          label: lang('faq.name'),
          title: lang('faq.name') as string,
          visible: hasRole([ERole.ADMIN, ERole.MANAGER]),
          path: '/dashboard/faqs',
        },
        {
          key: 'Terms',
          icon: () => h(ProfileOutlined),
          label: lang('term.name'),
          title: lang('term.name') as string,
          visible: hasRole([ERole.ADMIN, ERole.MANAGER]),
          path: '/dashboard/terms',
        },
      ],
    },
    {
      key: 'Services',
      icon: () => h(CodeOutlined),
      label: lang('dashboard.services'),
      title: lang('dashboard.services') as string,
      children: [
        {
          key: 'Articles',
          icon: () => h(ReadOutlined),
          label: lang('article.name'),
          title: lang('article.name') as string,
          visible: hasRole([ERole.ADMIN, ERole.MANAGER]),
          path: '/dashboard/articles',
        },
        {
          key: 'Analyzers',
          icon: () => h(ProjectOutlined),
          label: lang('analyzer.name'),
          title: lang('analyzer.name') as string,
          visible: hasRole([ERole.ADMIN, ERole.MANAGER]),
          path: '/dashboard/analyzers',
        },
        {
          key: 'Crawls',
          icon: () => h(BugOutlined),
          label: lang('crawl.name'),
          title: lang('crawl.name') as string,
          visible: hasRole([ERole.ADMIN, ERole.MANAGER]),
          path: '/dashboard/crawls',
        },
        {
          key: 'Feedbacks',
          icon: () => h(MailOutlined),
          label: lang('feedback.name'),
          title: lang('feedback.name') as string,
          visible: hasRole([ERole.ADMIN, ERole.MANAGER]),
          path: '/dashboard/feedbacks',
        },
      ],
    },
    {
      key: 'System',
      icon: () => h(LaptopOutlined),
      label: lang('dashboard.system'),
      title: lang('dashboard.system') as string,
      children: [
        {
          key: 'Users',
          icon: () => h(TeamOutlined),
          label: lang('user.name'),
          title: lang('user.name') as string,
          visible: hasRole([ERole.ADMIN]),
          path: '/dashboard/users',
        },
        {
          key: 'Alerts',
          icon: () => h(NotificationOutlined),
          label: lang('dashboard.alerts'),
          title: lang('dashboard.alerts') as string,
          visible: hasRole([ERole.ADMIN, ERole.MANAGER]),
          path: '/dashboard/alerts',
        },
        {
          key: 'Tasks',
          icon: () => h(SisternodeOutlined),
          label: lang('task.name'),
          title: lang('task.name') as string,
          visible: hasRole([ERole.ADMIN, ERole.MANAGER]),
          path: '/dashboard/tasks',
        },
        {
          key: 'Logs',
          icon: () => h(BarsOutlined),
          label: lang('log.name'),
          title: lang('log.name') as string,
          visible: hasRole([ERole.ADMIN]),
          path: '/dashboard/logs',
        },
      ],
    },
  ];

  result = result.filter((itm: ItemType) => (itm && 'visible' in itm && itm.visible) || (itm && !('path' in itm)));

  return result;
});

const getSelected = (menuItems: ItemType[], path: string): Key | null => {
  let foundKey: Key | null = null;

  Object.values(menuItems).forEach((item) => {
    if (item) {
      if ('path' in item && item.path && path.indexOf(item.path) !== -1) {
        foundKey = item.key;
      }

      if ('children' in item) {
        const foundInsideKey = getSelected(item.children as ItemType[], path);

        if (foundInsideKey) {
          foundKey = foundInsideKey;
        }
      }
    }
  });

  return foundKey;
};

const setSelected = (rt: RouteLocationNormalizedLoaded) => {
  rt.matched.forEach(({ path }) => {
    const key = getSelected(items.value, path);

    if (key) {
      selected.value[0] = key;
    } else {
      selected.value = [];
    }
  });
};

const setOpened = (rt: RouteLocationNormalizedLoaded) => {
  rt.matched.forEach(({ path }) => {
    const key = getSelected(items.value, path);

    if (key) {
      Object.values(items.value).forEach((item) => {
        if (item && 'children' in item && item.children) {
          Object.values(item.children).forEach((insideItem) => {
            if (typeof insideItem === 'object' && insideItem && 'key' in insideItem && item.key && insideItem.key === key) {
              opened.value[opened.value.length] = item.key;
            }
          });
        }
      });
    } else {
      opened.value = [];
    }
  });
};

const onClickMenu = (item: any): void => {
  if (item.item.path) {
    router.push({
      name: item.key,
    });
  }
};

watch(route, (): void => {
  setSelected(route);
});

onMounted(() => {
  setSelected(route);
  setOpened(route);
});
</script>
