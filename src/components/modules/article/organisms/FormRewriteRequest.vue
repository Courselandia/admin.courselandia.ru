<template>
  <Alert
    v-if="alertMessage"
    :message="alertType === 'success'
      ? lang('dashboard.success')
      : lang('dashboard.error')"
    :description="alertMessage"
    :type="alertType"
    class="mb-25"
  />

  <Form
    ref="formRef"
    :model="form"
    :label-col="{ span: 6 }"
    layout="vertical"
    @finish="onSubmit"
  >
    <Descriptions
      v-if="form"
      bordered
      layout="horizontal"
      class="mb-20"
    >
      <ItemDescription
        v-if="form.articleable?.id && form.category"
        :span="3"
        :label="lang('article.ownId')"
      >
        <router-link
          :to="getLink(form.articleable.id, form.category) as string"
        >
          {{ form.articleable?.id }}
        </router-link>
      </ItemDescription>
      <ItemDescription
        :span="3"
        :label="lang('article.category')"
      >
        {{ form.category_name }}
        <template v-if="form.category_label">
          / {{ form.category_label }}
        </template>
      </ItemDescription>
      <ItemDescription
        :span="3"
        :label="lang('article.textCurrent')"
      >
        <div v-html="form.text_current" />
        <div
          v-if="form.text_current?.length"
        >
          <Tag
            color="purple"
            style="margin-top: 20px"
          >
            <Lang value="article.lengthText" />
            {{ form.text_current ? countLength(form.text_current) : 0 }}
          </Tag>
          <Info
            v-if="form.articleable?.analyzers?.length && form.category"
            :analyzers="form.articleable.analyzers"
            :category="form.category"
          />
        </div>
      </ItemDescription>
      <ItemDescription
        :span="3"
        :label="lang('article.text')"
      >
        <div v-html="form.text" />
        <div style="margin-top: 20px">
          <Tag
            v-if="form.text?.length"
            color="purple"
            style="margin-bottom: 5px"
          >
            <Lang value="article.lengthText" />
            {{ form.text ? countLength(form.text) : 0 }}
          </Tag>
          <Info
            v-if="form.analyzers?.length"
            :analyzers="form.analyzers"
            category="article.text"
          />
        </div>
      </ItemDescription>
      <ItemDescription
        v-if="form.status"
        :span="3"
        :label="lang('dashboard.status')"
      >
        <Tag
          v-if="form.status === EStatus.PENDING"
          color="cyan"
        >
          <Lang value="article.pending" />
        </Tag>
        <Tag
          v-else-if="form.status === EStatus.READY"
          color="blue"
        >
          <Lang value="article.ready" />
        </Tag>
        <Tag
          v-else-if="form.status === EStatus.PROCESSING"
          color="orange"
        >
          <Lang value="article.processing" />
        </Tag>
        <Tag
          v-else-if="form.status === EStatus.FAILED"
          color="red"
        >
          <Lang value="article.failed" />
        </Tag>
        <Tag
          v-else-if="form.status === EStatus.DISABLED"
          color="pink"
        >
          <Lang value="article.disabled" />
        </Tag>
        <Tag
          v-else-if="form.status === EStatus.APPLIED"
          color="green"
        >
          <Lang value="article.applied" />
        </Tag>
      </ItemDescription>
    </Descriptions>
    <Item
      :label="lang('article.request')"
      name="request"
      has-feedback
      :rules="[{ required: true, type: 'string', max: 65000 }]"
      :extra="lang('article.requestExplanation')"
    >
      <TextArea
        v-model:value="form.request"
        style="height: 200px"
      />
    </Item>
    <Item
      :wrapper-col="{ offset: 0 }"
      class="buttons-flex"
    >
      <Space>
        <Button
          :loading="loading"
          type="primary"
          html-type="submit"
        >
          <span>
            {{ buttonText }}
          </span>
        </Button>
        <Button
          @click="onReset"
        >
          <Lang value="dashboard.reset" />
        </Button>
      </Space>
    </Item>
  </Form>
</template>

<script lang="ts" setup>
import type { FormInstance } from 'ant-design-vue';
import Alert from 'ant-design-vue/lib/alert';
import Button from 'ant-design-vue/lib/button';
import Descriptions from 'ant-design-vue/lib/descriptions';
import Form from 'ant-design-vue/lib/form';
import Input from 'ant-design-vue/lib/input';
import Space from 'ant-design-vue/lib/space';
import Tag from 'ant-design-vue/lib/tag';
import trim from 'lodash/trim';
import {
  PropType,
  ref,
  toRefs,
  watch,
} from 'vue';

import Lang from '@/components/atoms/Lang.vue';
import Info from '@/components/modules/analyzer/organisms/Info.vue';
import getLink from '@/components/modules/article/getLink';
import EStatus from '@/enums/modules/article/status';
import countLength from '@/helpers/countLength';
import { stripTags } from '@/helpers/format';
import lang from '@/helpers/lang';
import IArticleRewriteForm from '@/interfaces/modules/article/articleRewriteForm';

const ItemDescription = Descriptions.Item;
const formRef = ref<FormInstance>();

const props = defineProps({
  value: {
    type: Object as PropType<IArticleRewriteForm>,
    required: true,
  },
  alertMessage: {
    type: String,
    required: false,
    default: null,
  },
  alertType: {
    type: String,
    default: 'success',
  },
  loading: {
    type: Boolean,
    default: false,
  },
  buttonText: {
    type: String,
    default: lang('article.rewrite'),
  },
});

const {
  value,
} = toRefs(props);
const { Item } = Form;
const { TextArea } = Input;

const emit = defineEmits({
  'update:value': (_: IArticleRewriteForm) => true,
  submit: (_: IArticleRewriteForm, __?: FormInstance) => true,
  reset: (_?: FormInstance) => true,
});

const form = ref<IArticleRewriteForm>(value.value);

watch(form, () => {
  emit('update:value', form.value);
}, {
  deep: true,
});

watch(value, () => {
  form.value = value.value;
}, {
  deep: true,
});

const onSubmit = () => {
  emit('submit', form.value, formRef.value);
};

const onReset = () => {
  emit('reset', formRef.value);
};
</script>
