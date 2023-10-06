<template>
  <Row :gutter="[20, 20]">
    <Col
      :xxxl="17"
      :xxl="17"
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
                  <Lang value="dashboard.create" />
                </span>
              </Button>
              <Button
                html-type="reset"
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
      :xxxl="7"
      :xxl="7"
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

        <Upload
          :max-count="1"
          :multiple="false"
          :before-upload="onBeforeUploadFile"
          :show-upload-list="false"
          name="file"
          accept="image/*"
          list-type="picture-card"
        >
          <img
            v-if="image"
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
  CheckOutlined,
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
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
import Upload from 'ant-design-vue/lib/upload';
import dayjs from 'dayjs';
import { storeToRefs } from 'pinia';
import {
  createVNode,
  h,
  onMounted,
  ref,
} from 'vue';
import { useMeta } from 'vue-meta';

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
import ESocialMedia from '@/enums/modules/teacher/socialMedia';
import base64 from '@/helpers/base64';
import { latin } from '@/helpers/format';
import lang from '@/helpers/lang';
import ITeacherForm from '@/interfaces/modules/teacher/teacherForm';
import IAlert from '@/interfaces/molecules/alert/alert';
import ISorts from '@/interfaces/molecules/table/sorts';
import direction from '@/stores/direction';
import school from '@/stores/school';
import teacher from '@/stores/teacher';

useMeta({
  title: lang('teacher.createTeacher'),
});

const loadingSelects = ref(true);
const readDirections = direction().read;
const readSchools = school().read;
const { Item } = Form;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
const { TabPane } = Tabs;
const { create } = teacher();
const { Option } = Select;
experienceItems.value = [];
socialMediaItems.value = [];

const directionData = storeToRefs(direction());
const directionItems = directionData.items;

const schoolData = storeToRefs(school());
const schoolItems = schoolData.items;

const formRef = ref<FormInstance>();
const titleRef = ref<HTMLElement|null>();
const loading = ref(false);
const image = ref<string>();
const alphaDash = /^[A-Za-z0-9_-]*$/;

const alert = ref<IAlert>({
  message: null,
  type: undefined,
});

const form = ref<ITeacherForm>({
  name: undefined,
  link: undefined,
  text: undefined,
  rating: undefined,
  city: undefined,
  image: undefined,
  directions: [],
  schools: [],
  title: undefined,
  description: undefined,
  title_template: 'Преподаватель {teacher} — отзывы, рейтинг[countTeacherCourses:, список из {countTeacherCourses:курс|genitive}] — Courselandia',
  description_template: 'Все курсы преподавателя {teacher} — полный список обучающих онлайн-курсов в каталоге Courselandia.',
  keywords: undefined,
  status: true,
  copied: true,
  comment: undefined,
  experiences: [],
  socialMedias: [],
});

const onClickReset = (): void => {
  formRef.value?.resetFields();
  form.value.text = '';
  form.value.image = undefined;
  image.value = undefined;

  form.value.experiences = [];
  experienceItems.value = [];

  form.value.socialMedias = [];
  socialMediaItems.value = [];
};

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

const onSubmit = async (): Promise<void> => {
  alert.value.message = '';
  loading.value = true;

  try {
    if (!form.value.experiences) {
      form.value.experiences = [];
    }

    if (!form.value.socialMedias) {
      form.value.socialMedias = [];
    }

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

    await create(form.value);

    alert.value.message = lang('dashboard.successCreateText');
    alert.value.type = 'success';
    form.value.image = undefined;
    form.value.text = '';
    image.value = '';

    form.value.experiences = [];
    experienceItems.value = [];

    form.value.socialMedias = [];
    socialMediaItems.value = [];

    onClickReset();
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
  form.value.image = file;
  image.value = await base64(file) as string || '';

  return false;
};

const onClickImageDestroy = async (): Promise<void> => {
  Modal.confirm({
    title: lang('dashboard.alert'),
    icon: createVNode(ExclamationCircleOutlined),
    content: lang('dashboard.confirmDestroyImage'),
    async onOk() {
      form.value.image = undefined;
      image.value = '';
    },
  });
};

const onChangeName = () => {
  form.value.link = latin(form.value.name || '');
};

const filterOption = (input: string, option: any) => option
  ?.label
  ?.toLowerCase()
  ?.indexOf(input.toLowerCase()) >= 0;
</script>

<style lang="scss">
@import "@/assets/components/organisms/editableCell.scss";

.ant-upload.ant-upload-select-picture-card {
  width: 208px !important;
  height: 208px !important;
}
</style>
