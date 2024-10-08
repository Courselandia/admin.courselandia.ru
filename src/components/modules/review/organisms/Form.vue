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
    @finish="onSubmit"
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
          <RadioButton :value="EStatus.ACTIVE">
            <Lang value="dashboard.active" />
          </RadioButton>
          <RadioButton :value="EStatus.REVIEW">
            <Lang value="dashboard.review" />
          </RadioButton>
          <RadioButton :value="EStatus.DISABLED">
            <Lang value="dashboard.disabled" />
          </RadioButton>
        </RadioGroup>
      </Item>
      <Item
        :label="lang('review.createdAt')"
        name="created_at"
        has-feedback
        :rules="[{ required: true }]"
      >
        <DatePicker
          v-model:value="form.created_at"
          format="DD.MM.YYYY HH:mm:ss"
          show-time
          style="width: 100%"
        />
      </Item>
      <Item
        :label="lang('review.school')"
        name="school_id"
        has-feedback
        :rules="[{ required: true }]"
      >
        <Select
          v-model:value="form.school_id"
          label-in-value
          class="width--wide"
          show-search
          :filter-option="filterOption"
          :options="schoolItems?.map((itm) => ({ value: itm.id, label: itm.name }))"
          :loading="loadingSelects"
        />
      </Item>
      <Item
        :label="lang('review.source')"
        name="source"
        has-feedback
        :rules="[{ required: false, type: 'string', max: 191 }]"
      >
        <Input
          v-model:value="form.source"
        />
      </Item>
      <Item
        :label="lang('review.course')"
        name="course_id"
        has-feedback
        :rules="[{ required: false }]"
      >
        <AutoComplete
          v-model:value="form.course_id"
          :options="courseItems?.map((itm) => ({ key: itm.id, value: itm.header }))"
          class="width--wide"
          allow-clear
          label-in-value
          @search="onSearchCourses"
        />
      </Item>
      <Item
        :label="lang('review.nameAuthor')"
        name="name"
        has-feedback
        :rules="[{ required: false, type: 'string', max: 191 }]"
      >
        <Input
          v-model:value="form.name"
        />
      </Item>
      <Item
        :label="lang('review.title')"
        name="title"
        has-feedback
        :rules="[{ required: false, type: 'string', max: 191 }]"
      >
        <Input
          v-model:value="form.title"
        />
      </Item>
    </div>
    <div class="width--wide max--width-900">
      <Item
        :label="lang('review.review')"
        name="review"
        has-feedback
        :rules="[{ required: false, type: 'string', max: 65000 }]"
        :label-col="{ span: 4 }"
      >
        <TextArea
          v-model:value="form.review"
          style="height: 200px"
        />
      </Item>
      <Item
        :label="lang('review.advantages')"
        name="advantages"
        has-feedback
        :rules="[{ required: false, type: 'string', max: 65000 }]"
        :label-col="{ span: 4 }"
      >
        <TextArea
          v-model:value="form.advantages"
          style="height: 200px"
        />
      </Item>
      <Item
        :label="lang('review.disadvantages')"
        name="disadvantages"
        has-feedback
        :rules="[{ required: false, type: 'string', max: 65000 }]"
        :label-col="{ span: 4 }"
      >
        <TextArea
          v-model:value="form.disadvantages"
          style="height: 200px"
        />
      </Item>
    </div>
    <div class="width--wide max--width-600">
      <Item
        :label="lang('review.rating')"
        name="rating"
        has-feedback
        :rules="[{ required: false, type: 'integer', min: 1, max: 5 }]"
      >
        <InputNumber
          v-model:value="form.rating"
          class="width--wide"
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
    </div>
  </Form>
</template>

<script lang="ts" setup>
import { MehOutlined } from '@ant-design/icons-vue';
import type { FormInstance } from 'ant-design-vue';
import Alert from 'ant-design-vue/lib/alert';
import AutoComplete from 'ant-design-vue/lib/auto-complete';
import Button from 'ant-design-vue/lib/button';
import DatePicker from 'ant-design-vue/lib/date-picker';
import Form from 'ant-design-vue/lib/form';
import Input from 'ant-design-vue/lib/input';
import InputNumber from 'ant-design-vue/lib/input-number';
import notification from 'ant-design-vue/lib/notification';
import Radio from 'ant-design-vue/lib/radio';
import Select, { LabeledValue } from 'ant-design-vue/lib/select';
import Space from 'ant-design-vue/lib/space';
import { storeToRefs } from 'pinia';
import {
  h,
  onMounted,
  PropType,
  ref,
  toRefs,
  watch,
} from 'vue';

import Lang from '@/components/atoms/Lang.vue';
import EStatus from '@/enums/modules/review/status';
import lang from '@/helpers/lang';
import IReviewForm from '@/interfaces/modules/review/reviewForm';
import IFilter from '@/interfaces/molecules/table/filters';
import ISorts from '@/interfaces/molecules/table/sorts';
import course from '@/stores/course';
import school from '@/stores/school';
import TAlert from '@/types/alert';

const formRef = ref<FormInstance>();

const props = defineProps({
  value: {
    type: Object as PropType<IReviewForm>,
    required: true,
  },
  alertMessage: {
    type: String,
    required: false,
    default: null,
  },
  alertType: {
    type: String as PropType<TAlert>,
    default: 'success',
  },
  loading: {
    type: Boolean,
    default: false,
  },
  buttonText: {
    type: String,
    default: lang('dashboard.create'),
  },
});

const {
  value,
} = toRefs(props);
const { Item } = Form;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
const { TextArea } = Input;

const loadingSelects = ref(true);

const readSchools = school().read;
const schoolData = storeToRefs(school());
const schoolItems = schoolData.items;

const readCourses = course().read;
const courseData = storeToRefs(course());
const courseItems = courseData.items;

const emit = defineEmits({
  'update:value': (_: IReviewForm) => true,
  submit: (_: IReviewForm, __?: FormInstance) => true,
  reset: (_?: FormInstance) => true,
});

const form = ref<IReviewForm>(value.value);

onMounted(async (): Promise<void> => {
  loadingSelects.value = true;

  try {
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

const filterOption = (input: string, option: any) => option
  ?.label
  ?.toLowerCase()
  ?.indexOf(input.toLowerCase()) >= 0;

let searchTimer: ReturnType<typeof setTimeout> | null = null;

const onSearchCourses = (searchText: string) => {
  if (searchTimer) {
    clearTimeout(searchTimer);
    searchTimer = null;
  }

  if (searchText.length > 3) {
    searchTimer = setTimeout(async () => {
      try {
        await readCourses(null, null, { header: 'ASC' } as ISorts, { header: searchText } as IFilter);
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
    }, 400);
  }
};
</script>
