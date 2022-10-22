<template>
  <Row :gutter="[20, 20]">
    <Col :span="24">
      <Card>
        <template #title>
          <div>
            <Lang value="log.showLog" />
          </div>
        </template>

        <Descriptions
          bordered
          layout="horizontal"
          class="mb-20"
        >
          <Item
            :span="3"
            :label="lang('log.level_name')"
          >
            <Tag
              v-if="item.level_name === 'INFO'"
              color="green"
            >
              <template #icon>
                <CheckOutlined />
              </template>
              <Lang value="log.info" />
            </Tag>
            <Tag
              v-else-if="item.level_name === 'ALERT'"
              color="yellow"
            >
              <template #icon>
                <ExclamationOutlined />
              </template>
              <Lang value="log.alert" />
            </Tag>
            <Tag
              v-else-if="item.level_name === 'CRITICAL'"
              color="orange"
            >
              <template #icon>
                <AlertOutlined />
              </template>
              <Lang value="log.critical" />
            </Tag>
            <Tag
              v-else-if="item.level_name === 'DEBUG'"
              color="cyan"
            >
              <template #icon>
                <ApiOutlined />
              </template>
              <Lang value="log.debug" />
            </Tag>
            <Tag
              v-else-if="item.level_name === 'ERROR'"
              color="red"
            >
              <template #icon>
                <BugOutlined />
              </template>
              <Lang value="log.error" />
            </Tag>
            <Tag
              v-else-if="item.level_name === 'NOTICE'"
              color="cyan"
            >
              <template #icon>
                <QuestionCircleOutlined />
              </template>
              <Lang value="log.notice" />
            </Tag>
            <Tag
              v-else-if="item.level === 'WARNING'"
              color="purple"
            >
              <template #icon>
                <WarningOutlined />
              </template>
              <Lang value="log.warning" />
            </Tag>
          </Item>
          <Item
            :span="3"
            :label="lang('log.created_at')"
          >
            {{ dayjs(item.created_at).format('D MMMM YYYY, HH:mm:ss') }}
          </Item>
          <Item
            v-if="item.message"
            :span="3"
            :label="lang('log.message')"
          >
            {{ item.message }}
          </Item>
          <Item
            :span="3"
            :label="lang('log.channel')"
          >
            {{ item.channel }}
          </Item>
          <Item
            :span="3"
            :label="lang('log.level')"
          >
            {{ item.level }}
          </Item>
          <Item
            v-if="trace"
            :span="3"
            :label="lang('log.trace')"
          >
            <span v-html="trace" />
          </Item>
        </Descriptions>

        <div v-if="item.context">
          <codemirror
            v-model="code"
            :style="{ height: '400px' }"
            :indent-with-tab="true"
            :tab-size="2"
            :extensions="extensions"
            disabled
          />
        </div>
      </Card>
    </Col>
  </Row>
</template>

<script lang="ts" setup>
import {
  AlertOutlined,
  ApiOutlined,
  BugOutlined,
  CheckOutlined,
  ExclamationOutlined,
  QuestionCircleOutlined,
  WarningOutlined,
} from '@ant-design/icons-vue';
import { json } from '@codemirror/lang-json';
import Card from 'ant-design-vue/lib/card';
import Col from 'ant-design-vue/lib/col';
import Descriptions from 'ant-design-vue/lib/descriptions';
import Row from 'ant-design-vue/lib/row';
import Tag from 'ant-design-vue/lib/tag';
import dayjs from 'dayjs';
import beautify from 'js-beautify';
import { storeToRefs } from 'pinia';
import {
  ref,
} from 'vue';
import { Codemirror } from 'vue-codemirror';
import { useMeta } from 'vue-meta';

import Lang from '@/components/atoms/Lang.vue';
import { rnToBr } from '@/helpers/format';
import lang from '@/helpers/lang';
import log from '@/store/log';

useMeta({
  title: lang('log.showLog'),
});

const { Item } = Descriptions;
const { item } = storeToRefs(log());

const extensions = [json()];
const context: any = item.value?.context;
const code = ref(beautify.js_beautify(JSON.stringify(context)) || null);
const trace = ref(rnToBr(context?.exception?.trace) || null);
</script>
