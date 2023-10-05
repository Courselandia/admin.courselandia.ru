import '@/plugins/dayjs';

// @ts-ignore
import CKEditor from '@mayasabha/ckeditor4-vue3';
import { vMaska } from 'maska';
import {
  createPinia,
} from 'pinia';
import {
  createApp,
} from 'vue';
import {
  createMetaManager,
} from 'vue-meta';

import App from '@/App.vue';
import outsideClickDirective from '@/directives/outsideClick';
import CenterLayout from '@/layouts/Center.vue';
import DefaultLayout from '@/layouts/Default.vue';
import router from '@/plugins/router';

const app = createApp(App);
const pinia = createPinia();
const metaManager = createMetaManager();

app.use(pinia)
  .use(router)
  .use(metaManager)
  .use(CKEditor)
  .directive('outside-click', outsideClickDirective);

app.directive('maska', vMaska);

app.component('CenterLayout', CenterLayout);
app.component('DefaultLayout', DefaultLayout);

app.mount('#app');
