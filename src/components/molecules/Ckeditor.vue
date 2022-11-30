<template>
  <ckeditor
    :id="name"
    v-model="val"
    :name="name"
    :config="allConfigs"
  />
</template>

<script lang="ts" setup>
import {
  ref,
  toRefs,
  watch,
} from 'vue';

const props = defineProps({
  value: {
    required: false,
    type: String,
    default: '',
  },
  name: {
    required: true,
    type: String,
  },
  configs: {
    required: false,
    type: Object,
    default: () => {
    },
  },
});

const emit = defineEmits({
  'update:value': (_: string) => true,
});

const {
  configs,
  value,
} = toRefs(props);
const val = ref(value.value);
const dateNow = new Date();
const timeStamp = dateNow.getTime();
let extraPlugins = '';
extraPlugins += ',codemirror';

const mainConfig = {
  bodyClass: 'main title--titles list--lists link--links padding--aside-4',
  contentsCss: `${process.env.VUE_APP_CSS_URL}?${timeStamp}`,
  baseHref: process.env.APP_API_URL,
  height: 400,

  extraPlugins,
  filebrowserBrowseUrl: `${process.env.VUE_APP_ADMIN_URL}/php/ckfinder.php?env=${process.env.NODE_ENV}`,
  filebrowserFlashBrowseUrl: `${process.env.VUE_APP_ADMIN_URL}/php/ckfinder.php?type=Flash&env=${process.env.NODE_ENV}`,
  filebrowserImageBrowseUrl: `${process.env.VUE_APP_ADMIN_URL}/php/ckfinder.php?type=Images&env=${process.env.NODE_ENV}`,
  toolbar_MyToolbarAll: [
    {
      name: 'document',
      items: ['Source', '-', 'Preview', '-', 'Templates'],
    },
    {
      name: 'clipboard',
      items: ['Cut', 'Copy', 'Paste', '-', 'Undo', 'Redo'],
    },
    {
      name: 'editing',
      items: ['Find', 'Replace', '-', 'SelectAll'],
    },
    {
      name: 'basicstyles',
      items: [
        'Bold',
        'Italic',
        'Underline',
        'Strike',
        'Subscript',
        'Superscript',
        '-',
        'RemoveFormat',
      ],
    },
    '/',
    {
      name: 'paragraph',
      items: [
        'NumberedList',
        'BulletedList',
        '-',
        'Blockquote',
        'CreateDiv',
        '-',
        'JustifyLeft',
        'JustifyCenter',
        'JustifyRight',
        'JustifyBlock',
      ],
    },
    {
      name: 'links',
      items: ['Link', 'Unlink', 'Anchor'],
    },
    {
      name: 'insert',
      items: ['Image', 'Flash', 'Table', 'SpecialChar'],
    },
    {
      name: 'styles',
      items: ['Format', 'Styles'],
    },
    {
      name: 'tools',
      items: ['Maximize', 'ShowBlocks'],
    },
  ],
  language: 'ru',
  forcePasteAsPlainText: false,
  templates_replaceContent: false,
  format_tags: 'p;div;h1;h2;h3;h4;h5',
  entities: false,
  toolbar: 'MyToolbarAll',
  fillEmptyBlocks: false,
  isableNativeSpellChecker: false,
  disallowedContent: 'img{width,height}',
  allowedContent: true,
};
const allConfigs = ref({ ...mainConfig, ...configs.value });

watch(val, () => {
  emit('update:value', val.value);
});

watch(value, () => {
  val.value = value.value;
});
</script>
