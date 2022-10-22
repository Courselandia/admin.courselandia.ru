<template>
  <Row :gutter="[20, 20]">
    <Col :span="24">
      <Card>
        <template #title>
          <div>
            <Lang value="feedback.showFeedback" />
          </div>
        </template>

        <Descriptions
          bordered
          layout="horizontal"
          class="mb-20"
        >
          <Item
            :span="3"
            :label="lang('dashboard.id')"
          >
            {{ item.id }}
          </Item>
          <Item
            :span="3"
            :label="lang('feedback.fio')"
          >
            {{ item.name }}
          </Item>
          <Item
            :span="3"
            :label="lang('feedback.email')"
          >
            <a :href="'mailto:' + item.email">
              {{ item.email }}
            </a>
          </Item>
          <Item
            v-if="item.phone"
            :span="3"
            :label="lang('feedback.phone')"
          >
            <a :href="'tel:' + item.phone">
              {{ item.phone }}
            </a>
          </Item>
          <Item
            v-if="item.message"
            :span="3"
            :label="lang('feedback.message')"
          >
            <span v-html="item.message" />
          </Item>
          <Item
            :span="3"
            :label="lang('feedback.created_at')"
          >
            {{ dayjs(item.created_at).format('D MMMM YYYY, HH:mm:ss') }}
          </Item>
        </Descriptions>
      </Card>
    </Col>
  </Row>
</template>

<script lang="ts" setup>
import Card from 'ant-design-vue/lib/card';
import Col from 'ant-design-vue/lib/col';
import Descriptions from 'ant-design-vue/lib/descriptions';
import Row from 'ant-design-vue/lib/row';
import dayjs from 'dayjs';
import { storeToRefs } from 'pinia';
import { useMeta } from 'vue-meta';

import Lang from '@/components/atoms/Lang.vue';
import lang from '@/helpers/lang';
import feedback from '@/store/feedback';

useMeta({
  title: lang('feedback.showFeedback'),
});

const { Item } = Descriptions;
const { item } = storeToRefs(feedback());
</script>
