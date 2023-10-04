<template>
  <Row :gutter="[20, 20]">
    <Col
      :xxxl="16"
      :xxl="16"
      :xl="24"
      :lg="24"
      :md="24"
      :sm="24"
      :xs="24"
      class="mb-20"
    >
      <Card>
        <template #title>
          <div ref="titleRef">
            <Lang value="teacher.addTeacher" />
          </div>
        </template>

        <Alert
          v-if="alert.message"
          :message="alert.type === 'success'
            ? lang('dashboard.success')
            : lang('dashboard.error')"
          :description="alert.message"
          :type="alert.type"
          class="mb-25"
        />

        <Form
          ref="formRef"
          :model="form"
          :label-col="{ span: 6 }"
          @finish="onSubmit"
        >
          <Tabs>
            <TabPane
              key="info"
              :tab="lang('dashboard.info')"
            >
              <div class="width--wide max--width-600">
                <Item
                  :label="lang('dashboard.status')"
                  name="status"
                  :rules="[{ required: true }]"
                >
                  <RadioGroup
                    v-model:value="form.status"
                  >
                    <RadioButton :value="true">
                      <Lang value="dashboard.active" />
                    </RadioButton>
                    <RadioButton :value="false">
                      <Lang value="dashboard.deactivated" />
                    </RadioButton>
                  </RadioGroup>
                </Item>
                <Item
                  :label="lang('teacher.nameField')"
                  name="name"
                  has-feedback
                  :rules="[{ required: true, type: 'string', max: 191 }]"
                >
                  <Input
                    v-model:value="form.name"
                    @keyup="onChangeName"
                  />
                </Item>
                <Item
                  :label="lang('teacher.link')"
                  name="link"
                  has-feedback
                  :rules="[{ required: true, type: 'string', max: 191, pattern: alphaDash }]"
                >
                  <Input v-model:value="form.link" />
                </Item>
                <Item
                  :label="lang('teacher.city')"
                  name="city"
                  has-feedback
                  :rules="[{ required: false, type: 'string', max: 191 }]"
                >
                  <Input
                    v-model:value="form.city"
                  />
                </Item>
                <Item
                  :label="lang('teacher.comment')"
                  name="comment"
                  has-feedback
                  :rules="[{ required: false, type: 'string', max: 191 }]"
                >
                  <Input
                    v-model:value="form.comment"
                  />
                </Item>
                <Item
                  :label="lang('teacher.rating')"
                  name="rating"
                  has-feedback
                  :rules="[{ required: false, type: 'number', min: 0, max: 5 }]"
                >
                  <InputNumber
                    v-model:value="form.rating"
                    class="width--wide"
                  />
                </Item>
                <Item
                  :label="lang('teacher.directions')"
                  name="directions"
                  has-feedback
                >
                  <Select
                    v-model:value="form.directions"
                    label-in-value
                    mode="multiple"
                    class="width--wide"
                    show-search
                    :filter-option="filterOption"
                    :options="directionItems?.map((itm) => ({ value: itm.id, label: itm.name }))"
                    :loading="loadingSelects"
                  />
                </Item>
                <Item
                  :label="lang('teacher.schools')"
                  name="schools"
                  has-feedback
                >
                  <Select
                    v-model:value="form.schools"
                    label-in-value
                    mode="multiple"
                    class="width--wide"
                    show-search
                    :filter-option="filterOption"
                    :options="schoolItems?.map((itm) => ({ value: itm.id, label: itm.name }))"
                    :loading="loadingSelects"
                  />
                </Item>
              </div>
            </TabPane>
            <TabPane
              key="experiences"
              :tab="lang('teacher.experiences')"
            >
              <Button
                class="mb-10"
                @click="onClickAddExperience"
              >
                <template #icon>
                  <PlusOutlined />
                </template>
                <span>
                  <Lang value="dashboard.add" />
                </span>
              </Button>
              <Table
                bordered
                class="mb-25"
                row-key="id"
                :pagination="false"
                :data-source="experienceItems"
                :columns="experienceColumns"
                sticky
              >
                <template #bodyCell="{ column, text, record }">
                  <template v-if="column.dataIndex === 'place'">
                    <div class="editable-cell">
                      <div
                        v-if="experienceEditableData[record.id]?.place !== undefined"
                        class="editable-cell-input-wrapper"
                      >
                        <Input
                          v-model:value="experienceEditableData[record.id].place"
                          @press-enter="experienceSave(record.id, 'place')"
                        />
                        <CheckOutlined
                          class="editable-cell-icon-check"
                          @click="experienceSave(record.id, 'place')"
                        />
                      </div>
                      <div
                        v-else
                        class="editable-cell-text-wrapper"
                        @click="experienceEdit(record.id, 'place')"
                        @keydown.enter="experienceEdit(record.id, 'place')"
                      >
                        {{ text ? text : '&nbsp;' }}
                        <EditOutlined class="editable-cell-icon" />
                      </div>
                    </div>
                  </template>
                  <template v-if="column.dataIndex === 'position'">
                    <div class="editable-cell">
                      <div
                        v-if="experienceEditableData[record.id]?.position !== undefined"
                        class="editable-cell-input-wrapper"
                      >
                        <Input
                          v-model:value="experienceEditableData[record.id].position"
                          @press-enter="experienceSave(record.id, 'position')"
                        />
                        <CheckOutlined
                          class="editable-cell-icon-check"
                          @click="experienceSave(record.id, 'position')"
                        />
                      </div>
                      <div
                        v-else
                        class="editable-cell-text-wrapper"
                        @click="experienceEdit(record.id, 'position')"
                        @keydown.enter="experienceEdit(record.id, 'position')"
                      >
                        {{ text ? text : '&nbsp;' }}
                        <EditOutlined class="editable-cell-icon" />
                      </div>
                    </div>
                  </template>
                  <template v-if="column.dataIndex === 'started'">
                    <div class="editable-cell">
                      <div
                        v-if="experienceEditableData[record.id]?.started !== undefined"
                        class="editable-cell-input-wrapper"
                      >
                        <DatePicker
                          v-model:value="experienceEditableData[record.id].started"
                          format="DD.MM.YYYY"
                          @change="experienceSave(record.id, 'started')"
                        />
                        <CheckOutlined
                          class="editable-cell-icon-check"
                          @click="experienceSave(record.id, 'started')"
                        />
                      </div>
                      <div
                        v-else
                        class="editable-cell-text-wrapper"
                        @click="experienceEdit(record.id, 'started')"
                        @keydown.enter="experienceEdit(record.id, 'started')"
                      >
                        {{ text
                          ? dayjs.utc(text).format('D MMMM YYYY')
                          : '&nbsp;' }}
                        <EditOutlined class="editable-cell-icon" />
                      </div>
                    </div>
                  </template>
                  <template v-if="column.dataIndex === 'finished'">
                    <div class="editable-cell">
                      <div
                        v-if="experienceEditableData[record.id]?.finished !== undefined"
                        class="editable-cell-input-wrapper"
                      >
                        <DatePicker
                          v-model:value="experienceEditableData[record.id].finished"
                          format="DD.MM.YYYY"
                          @change="experienceSave(record.id, 'finished')"
                        />
                        <CheckOutlined
                          class="editable-cell-icon-check"
                          @click="experienceSave(record.id, 'finished')"
                        />
                      </div>
                      <div
                        v-else
                        class="editable-cell-text-wrapper"
                        @click="experienceEdit(record.id, 'finished')"
                        @keydown.enter="experienceEdit(record.id, 'finished')"
                      >
                        {{ text
                          ? dayjs.utc(text).format('D MMMM YYYY')
                          : '&nbsp;' }}
                        <EditOutlined class="editable-cell-icon" />
                      </div>
                    </div>
                  </template>
                  <template v-if="column.dataIndex === 'weight'">
                    <div class="editable-cell">
                      <div
                        v-if="experienceEditableData[record.id]?.weight !== undefined"
                        class="editable-cell-input-wrapper"
                      >
                        <Input
                          v-model:value="experienceEditableData[record.id].weight"
                          type="number"
                          @press-enter="experienceSave(record.id, 'weight')"
                        />
                        <CheckOutlined
                          class="editable-cell-icon-check"
                          @click="experienceSave(record.id, 'weight')"
                        />
                      </div>
                      <div
                        v-else
                        class="editable-cell-text-wrapper"
                        @click="experienceEdit(record.id, 'weight')"
                        @keydown.enter="experienceEdit(record.id, 'weight')"
                      >
                        {{ text ? text : '&nbsp;' }}
                        <EditOutlined class="editable-cell-icon" />
                      </div>
                    </div>
                  </template>
                  <template v-else-if="column.dataIndex === 'actions'">
                    <Popconfirm
                      v-if="experienceItems.length"
                      :title="lang('dashboard.askDestroyRecord')"
                      @confirm="onClickDeleteExperience(record.id)"
                    >
                      <Button danger>
                        <template #icon>
                          <DeleteOutlined />
                        </template>
                        <span>
                          <Lang value="dashboard.destroy" />
                        </span>
                      </Button>
                    </Popconfirm>
                  </template>
                </template>
              </Table>
            </TabPane>
            <TabPane
              key="social_medias"
              :tab="lang('teacher.socialMedias')"
            >
              <Button
                class="mb-10"
                @click="onClickAddSocialMedia"
              >
                <template #icon>
                  <PlusOutlined />
                </template>
                <span>
                  <Lang value="dashboard.add" />
                </span>
              </Button>
              <Table
                bordered
                class="mb-25"
                row-key="id"
                :pagination="false"
                :data-source="socialMediaItems"
                :columns="socialMediaColumns"
                sticky
              >
                <template #bodyCell="{ column, text, record }">
                  <template v-if="column.dataIndex === 'name'">
                    <div class="editable-cell">
                      <div
                        v-if="socialMediaEditableData[record.id]?.name !== undefined"
                        class="editable-cell-input-wrapper"
                      >
                        <Select
                          v-model:value="socialMediaEditableData[record.id].name"
                          class="width--wide"
                        >
                          <Option :value="ESocialMedia.LINKED_ID">
                            <Lang value="teacher.linkedIn" />
                          </Option>
                          <Option :value="ESocialMedia.FACEBOOK">
                            <Lang value="teacher.facebook" />
                          </Option>
                          <Option :value="ESocialMedia.VK">
                            <Lang value="teacher.vk" />
                          </Option>
                          <Option :value="ESocialMedia.OK">
                            <Lang value="teacher.ok" />
                          </Option>
                          <Option :value="ESocialMedia.TELEGRAM">
                            <Lang value="teacher.telegram" />
                          </Option>
                          <Option :value="ESocialMedia.WHATS_APP">
                            <Lang value="teacher.whatsApp" />
                          </Option>
                          <Option :value="ESocialMedia.BEHANCE">
                            <Lang value="teacher.behance" />
                          </Option>
                          <Option :value="ESocialMedia.DRIBBLE">
                            <Lang value="teacher.dribble" />
                          </Option>
                          <Option :value="ESocialMedia.INSTAGRAM">
                            <Lang value="teacher.instagram" />
                          </Option>
                          <Option :value="ESocialMedia.TWITTER">
                            <Lang value="teacher.twitter" />
                          </Option>
                          <Option :value="ESocialMedia.DISCORD">
                            <Lang value="teacher.discord" />
                          </Option>
                          <Option :value="ESocialMedia.YOU_TUBE">
                            <Lang value="teacher.youTube" />
                          </Option>
                          <Option :value="ESocialMedia.TWITCH">
                            <Lang value="teacher.twitch" />
                          </Option>
                          <Option :value="ESocialMedia.TIK_TOK">
                            <Lang value="teacher.tikTok" />
                          </Option>
                          <Option :value="ESocialMedia.SITE">
                            <Lang value="teacher.site" />
                          </Option>
                          <Option :value="ESocialMedia.VC">
                            <Lang value="teacher.vc" />
                          </Option>
                          <Option :value="ESocialMedia.YANDEX_Q">
                            <Lang value="teacher.yandex_q" />
                          </Option>
                          <Option :value="ESocialMedia.GITHUB">
                            <Lang value="teacher.github" />
                          </Option>
                          <Option :value="ESocialMedia.GITLAB">
                            <Lang value="teacher.gitlab" />
                          </Option>
                          <Option :value="ESocialMedia.SKYPE">
                            <Lang value="teacher.skype" />
                          </Option>
                          <Option :value="ESocialMedia.YOUDO">
                            <Lang value="teacher.youdo" />
                          </Option>
                          <Option :value="ESocialMedia.PINTEREST">
                            <Lang value="teacher.pinterest" />
                          </Option>
                          <Option :value="ESocialMedia.YANDEX_DZEN">
                            <Lang value="teacher.yandex_dzen" />
                          </Option>
                          <Option :value="ESocialMedia.HABR_CAREER">
                            <Lang value="teacher.habr_career" />
                          </Option>
                        </Select>
                        <CheckOutlined
                          class="editable-cell-icon-check"
                          @click="socialMediaSave(record.id, 'name')"
                        />
                      </div>
                      <div
                        v-else
                        class="editable-cell-text-wrapper"
                        @click="socialMediaEdit(record.id, 'name')"
                        @keydown.enter="socialMediaEdit(record.id, 'name')"
                      >
                        <template v-if="text === ESocialMedia.LINKED_ID">
                          <Lang value="teacher.linkedIn" />
                        </template>
                        <template v-else-if="text === ESocialMedia.FACEBOOK">
                          <Lang value="teacher.facebook" />
                        </template>
                        <template v-else-if="text === ESocialMedia.VK">
                          <Lang value="teacher.vk" />
                        </template>
                        <template v-else-if="text === ESocialMedia.OK">
                          <Lang value="teacher.ok" />
                        </template>
                        <template v-else-if="text === ESocialMedia.TELEGRAM">
                          <Lang value="teacher.telegram" />
                        </template>
                        <template v-else-if="text === ESocialMedia.WHATS_APP">
                          <Lang value="teacher.whatsApp" />
                        </template>
                        <template v-else-if="text === ESocialMedia.BEHANCE">
                          <Lang value="teacher.behance" />
                        </template>
                        <template v-else-if="text === ESocialMedia.DRIBBLE">
                          <Lang value="teacher.dribble" />
                        </template>
                        <template v-else-if="text === ESocialMedia.INSTAGRAM">
                          <Lang value="teacher.instagram" />
                        </template>
                        <template v-else-if="text === ESocialMedia.TWITTER">
                          <Lang value="teacher.twitter" />
                        </template>
                        <template v-else-if="text === ESocialMedia.DISCORD">
                          <Lang value="teacher.discord" />
                        </template>
                        <template v-else-if="text === ESocialMedia.YOU_TUBE">
                          <Lang value="teacher.youTube" />
                        </template>
                        <template v-else-if="text === ESocialMedia.TWITCH">
                          <Lang value="teacher.twitch" />
                        </template>
                        <template v-else-if="text === ESocialMedia.TIK_TOK">
                          <Lang value="teacher.tikTok" />
                        </template>
                        <template v-else-if="text === ESocialMedia.SITE">
                          <Lang value="teacher.site" />
                        </template>
                        <template v-else-if="text === ESocialMedia.VC">
                          <Lang value="teacher.vc" />
                        </template>
                        <template v-else-if="text === ESocialMedia.YANDEX_Q">
                          <Lang value="teacher.yandex_q" />
                        </template>
                        <template v-else-if="text === ESocialMedia.GITHUB">
                          <Lang value="teacher.github" />
                        </template>
                        <template v-else-if="text === ESocialMedia.GITLAB">
                          <Lang value="teacher.gitlab" />
                        </template>
                        <template v-else-if="text === ESocialMedia.SKYPE">
                          <Lang value="teacher.skype" />
                        </template>
                        <template v-else-if="text === ESocialMedia.YOUDO">
                          <Lang value="teacher.youdo" />
                        </template>
                        <template v-else-if="text === ESocialMedia.PINTEREST">
                          <Lang value="teacher.pinterest" />
                        </template>
                        <template v-else-if="text === ESocialMedia.YANDEX_DZEN">
                          <Lang value="teacher.yandex_dzen" />
                        </template>
                        <template v-else-if="text === ESocialMedia.HABR_CAREER">
                          <Lang value="teacher.habr_career" />
                        </template>
                        <template v-else>
                          &nbsp;
                        </template>
                        <EditOutlined class="editable-cell-icon" />
                      </div>
                    </div>
                  </template>
                  <template v-if="column.dataIndex === 'value'">
                    <div class="editable-cell">
                      <div
                        v-if="socialMediaEditableData[record.id]?.value !== undefined"
                        class="editable-cell-input-wrapper"
                      >
                        <Input
                          v-model:value="socialMediaEditableData[record.id].value"
                          @press-enter="socialMediaSave(record.id, 'value')"
                        />
                        <CheckOutlined
                          class="editable-cell-icon-check"
                          @click="socialMediaSave(record.id, 'value')"
                        />
                      </div>
                      <div
                        v-else
                        class="editable-cell-text-wrapper"
                        @click="socialMediaEdit(record.id, 'value')"
                        @keydown.enter="socialMediaEdit(record.id, 'value')"
                      >
                        {{ text ? text : '&nbsp;' }}
                        <EditOutlined class="editable-cell-icon" />
                      </div>
                    </div>
                  </template>
                  <template v-else-if="column.dataIndex === 'actions'">
                    <Popconfirm
                      v-if="socialMediaItems.length"
                      :title="lang('dashboard.askDestroyRecord')"
                      @confirm="onClickDeleteSocialMedia(record.id)"
                    >
                      <Button danger>
                        <template #icon>
                          <DeleteOutlined />
                        </template>
                        <span>
                          <Lang value="dashboard.destroy" />
                        </span>
                      </Button>
                    </Popconfirm>
                  </template>
                </template>
              </Table>
            </TabPane>
            <TabPane
              key="meta"
              :tab="lang('dashboard.meta')"
            >
              <div class="width--wide max--width-600">
                <Item
                  :label="lang('teacher.title')"
                  name="title_template"
                  has-feedback
                  :rules="[{ type: 'string', max: 500 }]"
                  :extra="form.title"
                >
                  <Input v-model:value="form.title_template" />
                </Item>
                <Item
                  :label="lang('teacher.description')"
                  name="description_template"
                  has-feedback
                  :rules="[{ type: 'string', max: 1000 }]"
                  :extra="form.description"
                >
                  <Input v-model:value="form.description_template" />
                </Item>
                <Item
                  :label="lang('teacher.keywords')"
                  name="keywords"
                  has-feedback
                  :rules="[{ type: 'string', max: 1000 }]"
                >
                  <Input v-model:value="form.keywords" />
                </Item>
              </div>
            </TabPane>
            <TabPane
              key="text"
              :tab="lang('teacher.text')"
            >
              <Ckeditor
                v-model:value="form.text"
                name="text"
                class="mb-30"
              />
              <Item
                :wrapper-col="{offset: 0, span: 19}"
                name="remember"
                class="buttons-flex"
              >
                <Checkbox
                  v-model:checked="form.copied"
                >
                  <Lang value="teacher.copied" />
                </Checkbox>
              </Item>
            </TabPane>
            <TabPane
              key="courses"
              :tab="lang('course.name')"
            >
              <Table
                :columns="coursesColumns"
                :data-source="courses || undefined"
                :loading="coursesLoading"
                row-key="id"
                class="table--responsive mb-20"
                sticky
                :pagination="false"
              >
                <template #bodyCell="{ column, record }">
                  <template v-if="column.key === 'actions'">
                    <Space>
                      <Button
                        :title="lang('dashboard.go')"
                        shape="circle"
                        @click="onClickGo(record.id)"
                      >
                        <template #icon>
                          <ArrowRightOutlined />
                        </template>
                      </Button>
                      <Button
                        :title="lang('dashboard.detach')"
                        :loading="detachLoading[record.id]"
                        type="primary"
                        shape="circle"
                        danger
                        @click="onClickDetach(record.id)"
                      >
                        <template #icon>
                          <ApiOutlined />
                        </template>
                      </Button>
                    </Space>
                  </template>
                  <template v-if="column.key === 'school-name'">
                    {{ record?.school?.name }}
                  </template>
                  <template v-if="column.key === 'price'">
                    <template v-if="record.price">
                      {{ money(record.price, 0, getCurrencyLabel(record.currency)) }}
                    </template>
                    <template v-else>
                      <Tag>
                        {{ lang('dashboard.free') }}
                      </Tag>
                    </template>
                  </template>
                  <template v-if="column.key === 'status'">
                    <template v-if="record.status === EStatus.ACTIVE">
                      <Tag color="green">
                        {{ lang('dashboard.active') }}
                      </Tag>
                    </template>
                    <template v-else-if="record.status === EStatus.DISABLED">
                      <Tag color="red">
                        {{ lang('dashboard.disabled') }}
                      </Tag>
                    </template>
                    <template v-else-if="record.status === EStatus.DRAFT">
                      <Tag color="yellow">
                        {{ lang('dashboard.draft') }}
                      </Tag>
                    </template>
                  </template>
                </template>
              </Table>
            </TabPane>
          </Tabs>
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
                  <Lang value="dashboard.update" />
                </span>
              </Button>
              <Button
                @click="onClickReset"
              >
                <Lang value="dashboard.reset" />
              </Button>
            </Space>
          </Item>
        </Form>
      </Card>
    </Col>
    <Col
      :xxxl="8"
      :xxl="8"
      :xl="24"
      :lg="24"
      :md="24"
      :sm="24"
      :xs="24"
      class="mb-20"
    >
      <Card class="mb-20">
        <template #title>
          <Lang value="teacher.image" />
        </template>
        <template
          v-if="image"
          #extra
        >
          <Button
            danger
            @click="onClickImageDestroy"
          >
            <template #icon>
              <DeleteOutlined />
            </template>
            <span>
              <Lang value="dashboard.destroy" />
            </span>
          </Button>
        </template>

        <Alert
          v-if="imageAlert.message"
          :message="imageAlert.type === 'success'
            ? lang('dashboard.success')
            : lang('dashboard.error')"
          :description="imageAlert.message"
          :type="imageAlert.type"
          class="mb-25"
        />

        <Upload
          :max-count="1"
          :multiple="false"
          :before-upload="onBeforeUploadFile"
          :show-upload-list="false"
          name="file"
          accept="image/*"
          list-type="picture-card"
        >
          <LoadingOutlined v-if="imageUpdateLoading" />
          <img
            v-else-if="image"
            :src="image"
            alt="avatar"
            width="208"
          >
          <div v-else>
            <PlusOutlined />
            <div class="ant-upload-text">
              <Lang value="dashboard.upload" />
            </div>
          </div>
        </Upload>
      </Card>
    </Col>
  </Row>
</template>

<script lang="ts" setup>
import {
  ApiOutlined,
  ArrowRightOutlined,
  CheckOutlined,
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  LoadingOutlined,
  MehOutlined,
  PlusOutlined,
} from '@ant-design/icons-vue';
import type { FormInstance } from 'ant-design-vue';
import Alert from 'ant-design-vue/lib/alert';
import Button from 'ant-design-vue/lib/button';
import Card from 'ant-design-vue/lib/card';
import Checkbox from 'ant-design-vue/lib/checkbox';
import Col from 'ant-design-vue/lib/col';
import DatePicker from 'ant-design-vue/lib/date-picker';
import Form from 'ant-design-vue/lib/form';
import Input from 'ant-design-vue/lib/input';
import InputNumber from 'ant-design-vue/lib/input-number';
import Modal from 'ant-design-vue/lib/modal';
import notification from 'ant-design-vue/lib/notification';
import Popconfirm from 'ant-design-vue/lib/popconfirm';
import Radio from 'ant-design-vue/lib/radio';
import Row from 'ant-design-vue/lib/row';
import Select from 'ant-design-vue/lib/select';
import Space from 'ant-design-vue/lib/space';
import Table from 'ant-design-vue/lib/table';
import Tabs from 'ant-design-vue/lib/tabs';
import Tag from 'ant-design-vue/lib/tag';
import Upload from 'ant-design-vue/lib/upload';
import dayjs from 'dayjs';
import { storeToRefs } from 'pinia';
import {
  computed,
  createVNode,
  h,
  onMounted,
  ref,
} from 'vue';
import { useMeta } from 'vue-meta';
import { useRoute, useRouter } from 'vue-router';

import Lang from '@/components/atoms/Lang.vue';
import {
  experienceColumns,
  experienceEdit,
  experienceEditableData,
  experienceItems,
  experienceSave,
  onClickAddExperience,
  onClickAddSocialMedia,
  onClickDeleteExperience,
  onClickDeleteSocialMedia,
  socialMediaColumns,
  socialMediaEdit,
  socialMediaEditableData,
  socialMediaItems,
  socialMediaSave,
} from '@/components/modules/teacher/organisms/common';
import Ckeditor from '@/components/molecules/Ckeditor.vue';
import ECurrency from '@/enums/modules/course/currency';
import EStatus from '@/enums/modules/course/status';
import ESocialMedia from '@/enums/modules/teacher/socialMedia';
import base64 from '@/helpers/base64';
import { latin } from '@/helpers/format';
import lang from '@/helpers/lang';
import { money } from '@/helpers/number';
import ICourse from '@/interfaces/modules/course/course';
import ITeacherExperience from '@/interfaces/modules/teacher/experience';
import ITeacherSocialMedia from '@/interfaces/modules/teacher/socialMedia';
import ITeacherForm from '@/interfaces/modules/teacher/teacherForm';
import IAlert from '@/interfaces/molecules/alert/alert';
import ISorts from '@/interfaces/molecules/table/sorts';
import ITableColumnType from '@/interfaces/molecules/table/tableColumnType';
import direction from '@/stores/direction';
import school from '@/stores/school';
import teacher from '@/stores/teacher';
import TId from '@/types/id';

useMeta({
  title: lang('teacher.updateTeacher'),
});

const router = useRouter();
const loadingSelects = ref(true);
const readDirections = direction().read;
const readSchools = school().read;
const route = useRoute();
const imageUpdateLoading = ref(false);
const imageDestroyLoading = ref(false);
const { id } = route.params;
const { Item } = Form;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
const { TabPane } = Tabs;
const { Option } = Select;
const {
  update,
  get,
  imageUpdate,
  imageDestroy,
} = teacher();
const { item } = storeToRefs(teacher());

const directionData = storeToRefs(direction());
const directionItems = directionData.items;

const schoolData = storeToRefs(school());
const schoolItems = schoolData.items;

const formRef = ref<FormInstance>();
const titleRef = ref<HTMLElement|null>();
const loading = ref(false);
const image = ref<string | ArrayBuffer | null>(item.value?.image_middle_id?.path || null);

const alphaDash = /^[A-Za-z0-9_-]*$/;

const alert = ref<IAlert>({
  message: null,
  type: null,
});

const imageAlert = ref<IAlert>(
  {
    message: null,
    type: null,
  },
);

onMounted(async (): Promise<void> => {
  loadingSelects.value = true;

  try {
    await readDirections(null, null, { weight: 'ASC' } as ISorts);
    await readSchools(null, null, { name: 'ASC' } as ISorts);
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

  loadingSelects.value = false;
});

const getDefaultFormValue = (): ITeacherForm => ({
  id: id as TId,
  name: item.value?.name || '',
  link: item.value?.link || '',
  text: item.value?.text || '',
  city: item.value?.city || '',
  comment: item.value?.comment || '',
  rating: item.value?.rating || '',
  image: null,
  title: item.value?.metatag?.title || null,
  description: item.value?.metatag?.description || null,
  title_template: item.value?.metatag?.title_template || null,
  description_template: item.value?.metatag?.description_template || null,
  keywords: item.value?.metatag?.keywords || null,
  status: item.value?.status !== undefined ? item.value?.status : true,
  directions: item.value?.directions?.map((itm: any) => ({ key: itm.id, value: itm.name })) || [],
  schools: item.value?.schools?.map((itm: any) => ({ key: itm.id, value: itm.name })) || [],
  copied: item.value?.copied !== undefined ? item.value?.copied : true,
  experiences: item.value?.experiences?.map((itm: ITeacherExperience) => ({
    id: itm.id,
    place: itm.place,
    position: itm.position,
    started: itm.started ? dayjs.utc(itm.started) : null,
    finished: itm.finished ? dayjs.utc(itm.finished) : null,
    weight: itm.weight,
  })) || [],
  socialMedias: item.value?.social_medias?.map((itm: ITeacherSocialMedia) => ({
    id: itm.id,
    name: itm.name,
    value: itm.value,
  })) || [],
});

experienceItems.value = item.value?.experiences?.map((itm: ITeacherExperience) => ({
  id: itm.id,
  place: itm.place,
  position: itm.position,
  started: itm.started ? dayjs.utc(itm.started) : null,
  finished: itm.finished ? dayjs.utc(itm.finished) : null,
  weight: itm.weight,
})) || [];

socialMediaItems.value = item.value?.social_medias?.map((itm: ITeacherSocialMedia) => ({
  id: itm.id,
  name: itm.name,
  value: itm.value,
})) || [];

const form = ref<ITeacherForm>(getDefaultFormValue());

const onClickReset = (): void => {
  form.value = getDefaultFormValue();
};

const onSubmit = async (): Promise<void> => {
  alert.value.message = '';
  loading.value = true;

  try {
    form.value.experiences = [];
    form.value.socialMedias = [];

    Object.values(experienceItems.value).forEach((itm) => {
      if (
        form.value.experiences
        && itm.place
        && itm.position
      ) {
        form.value.experiences[form.value.experiences.length] = {
          place: itm.place,
          position: itm.position,
          started: itm.started,
          finished: itm.finished,
          weight: itm.weight,
        };
      }
    });

    Object.values(socialMediaItems.value).forEach((itm) => {
      if (
        form.value.socialMedias
        && itm.name
        && itm.value
      ) {
        form.value.socialMedias[form.value.socialMedias.length] = {
          name: itm.name,
          value: itm.value,
        };
      }
    });

    await update(form.value);

    alert.value.message = lang('dashboard.successUpdateText');
    alert.value.type = 'success';

    await get(id as TId);
    form.value = getDefaultFormValue();

    experienceItems.value = item.value?.experiences?.map((itm: ITeacherExperience) => ({
      id: itm.id,
      place: itm.place,
      position: itm.position,
      started: itm.started ? dayjs.utc(itm.started) : null,
      finished: itm.finished ? dayjs.utc(itm.finished) : null,
      weight: itm.weight,
    })) || [];

    socialMediaItems.value = item.value?.social_medias?.map((itm: ITeacherSocialMedia) => ({
      id: itm.id,
      name: itm.name,
      value: itm.value,
    })) || [];
  } catch (error: Error | any) {
    alert.value.message = error.response.data.message
      ? error.response.data.message
      : error.message;
    alert.value.type = 'error';
  }

  if (titleRef.value) {
    titleRef.value.scrollIntoView({ behavior: 'smooth' });
  }

  loading.value = false;
};

const onBeforeUploadFile = async (file: File): Promise<boolean> => {
  imageAlert.value.message = '';
  imageUpdateLoading.value = true;

  try {
    await imageUpdate(id as TId, file);

    image.value = await base64(file);
  } catch (error: Error | any) {
    imageAlert.value.message = error.response.data.message
      ? error.response.data.message
      : error.message;
    imageAlert.value.type = 'error';
  }

  imageUpdateLoading.value = false;

  return false;
};

const onClickImageDestroy = async (): Promise<void> => {
  Modal.confirm({
    title: lang('dashboard.alert'),
    icon: createVNode(ExclamationCircleOutlined),
    content: lang('dashboard.confirmDestroyImage'),
    async onOk() {
      imageAlert.value.message = '';
      imageDestroyLoading.value = true;

      try {
        await imageDestroy(id as TId);

        image.value = null;
      } catch (error: Error | any) {
        imageAlert.value.message = error.response.data.message
          ? error.response.data.message
          : error.message;
        imageAlert.value.type = 'error';
      }

      imageDestroyLoading.value = false;
    },
  });
};

const onChangeName = () => {
  form.value.link = latin(form.value.name);
};

const filterOption = (input: string, option: any) => option
  ?.label
  ?.toLowerCase()
  ?.indexOf(input.toLowerCase()) >= 0;

const {
  courses,
} = storeToRefs(teacher());

const {
  readCourses,
  detachCourses,
} = teacher();

const coursesLoading = ref(false);
const detachLoading = ref<Record<TId, boolean>>({});
const coursesColumns = computed<ITableColumnType<ICourse>[]>(() => [
  {
    title: lang('dashboard.id'),
    dataIndex: 'id',
    key: 'id',
    sorter: {
      multiple: 1,
    },
    width: 100,
  },
  {
    title: lang('course.school'),
    dataIndex: 'school-name',
    key: 'school-name',
    sorter: {
      multiple: 1,
    },
  },
  {
    title: lang('course.name'),
    dataIndex: 'name',
    key: 'name',
    sorter: {
      multiple: 1,
    },
  },
  {
    title: lang('course.price'),
    dataIndex: 'price',
    key: 'price',
    sorter: {
      multiple: 1,
    },
  },
  {
    title: lang('dashboard.status'),
    dataIndex: 'status',
    key: 'status',
    sorter: {
      multiple: 1,
    },
    width: 150,
  },
  {
    key: 'actions',
    width: 140,
  },
]);

const loadCourses = async (): Promise<void> => {
  coursesLoading.value = true;

  try {
    await readCourses(id as string);
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

  coursesLoading.value = false;
};

loadCourses();

const getCurrencyLabel = (currency: ECurrency): string | null => {
  if (currency === ECurrency.RUB) {
    return 'руб.';
  }

  if (currency === ECurrency.USD) {
    return '$';
  }

  if (currency === ECurrency.EUR) {
    return '€';
  }

  return null;
};

const onClickGo = (idCourse: TId) => {
  router.push(`/dashboard/courses/${idCourse}`);
};

const detachIds = async (ids: Array<TId>): Promise<void> => {
  try {
    await detachCourses(id as TId, ids);
    await loadCourses();
  } catch (error: Error | any) {
    notification.open({
      icon: () => h(MehOutlined, { style: 'color: #ff0000' }),
      message: lang('dashboard.error'),
      description: error.response.data.message ? error.response.data.message : error.message,
      style: {
        color: '#ff0000',
      },
    });
  }
};

const onClickDetach = async (idCourse: TId): Promise<void> => {
  Modal.confirm({
    title: lang('dashboard.alert'),
    icon: createVNode(ExclamationCircleOutlined),
    content: lang('dashboard.askDetachRecord'),
    async onOk() {
      detachLoading.value[idCourse] = true;
      await detachIds([idCourse]);
      detachLoading.value[idCourse] = false;
    },
  });
};
</script>

<style lang="scss">
@import "@/assets/components/organisms/editableCell.scss";

.ant-upload.ant-upload-select-picture-card {
  width: 208px !important;
  height: 208px !important;
}
</style>
