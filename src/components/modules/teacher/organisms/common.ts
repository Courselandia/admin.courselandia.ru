import Modal from 'ant-design-vue/lib/modal';
import { cloneDeep } from 'lodash';
import {
  reactive,
  Ref,
  ref,
  UnwrapRef,
} from 'vue';

import lang from '@/helpers/lang';
import ITeacherExperience from '@/interfaces/modules/teacher/experience';
import ITeacherSocialMedia from '@/interfaces/modules/teacher/socialMedia';
import TId from '@/types/id';

export const experienceColumns = [
  {
    title: lang('teacher.place'),
    dataIndex: 'place',
  },
  {
    title: lang('teacher.position'),
    dataIndex: 'position',
  },
  {
    title: lang('teacher.started'),
    dataIndex: 'started',
  },
  {
    title: lang('teacher.finished'),
    dataIndex: 'finished',
  },
  {
    title: lang('teacher.weight'),
    dataIndex: 'weight',
    width: 130,
  },
  {
    dataIndex: 'actions',
    width: 150,
  },
];

export const experienceItems: Ref<ITeacherExperience[]> = ref([]);
export const experienceEditableData: UnwrapRef<Record<TId, ITeacherExperience>> = reactive({});

export const experienceSave = (id: TId, index: string): void => {
  const itemFound = experienceItems.value.filter((item) => id === item.id)[0];

  if (
    (index === 'place' && !experienceEditableData[id].place)
    || (index === 'position' && !experienceEditableData[id].position)
    || (index === 'weight' && (
      experienceEditableData[id].weight === undefined
      || experienceEditableData[id].weight === null
      || experienceEditableData[id].weight === '')
    )
  ) {
    Modal.warning({
      title: lang('dashboard.warning'),
      content: lang('dashboard.notEmpty'),
    });
  } else {
    Object.keys(experienceEditableData[id]).forEach((filedKey) => {
      itemFound[filedKey] = experienceEditableData[id][filedKey];
    });

    delete experienceEditableData[id];
  }
};

export const experienceEdit = (id: TId, field: string): void => {
  const cloned = cloneDeep(experienceItems.value.filter((item) => id === item.id)[0]);

  if (!experienceEditableData[id]) {
    experienceEditableData[id] = {};
  }

  experienceEditableData[id][field] = cloned[field];
};

export const onClickAddExperience = (): void => {
  const newData: ITeacherExperience = {
    id: Date.now(),
    place: undefined,
    position: undefined,
    started: undefined,
    finished: undefined,
    weight: undefined,
  };

  experienceItems.value.push(newData);
};

export const onClickDeleteExperience = (id: TId): void => {
  experienceItems.value = experienceItems.value.filter((item) => item.id !== id);
};

// ***************

export const socialMediaColumns = [
  {
    title: lang('teacher.nameSocialMedia'),
    dataIndex: 'name',
    width: 250,
  },
  {
    title: lang('teacher.value'),
    dataIndex: 'value',
  },
  {
    dataIndex: 'actions',
    width: 150,
  },
];

export const socialMediaItems: Ref<ITeacherSocialMedia[]> = ref([]);
export const socialMediaEditableData: UnwrapRef<Record<TId, ITeacherSocialMedia>> = reactive({});

export const socialMediaSave = (id: TId, index: string): void => {
  const itemFound = socialMediaItems.value.filter((item) => id === item.id)[0];

  if (
    (index === 'name' && !socialMediaEditableData[id].name)
    || (index === 'value' && !socialMediaEditableData[id].value)
  ) {
    Modal.warning({
      title: lang('dashboard.warning'),
      content: lang('dashboard.notEmpty'),
    });
  } else {
    Object.keys(socialMediaEditableData[id]).forEach((filedKey) => {
      itemFound[filedKey] = socialMediaEditableData[id][filedKey];
    });

    delete socialMediaEditableData[id];
  }
};

export const socialMediaEdit = (id: TId, field: string): void => {
  const cloned = cloneDeep(socialMediaItems.value.filter((item) => id === item.id)[0]);

  if (!socialMediaEditableData[id]) {
    socialMediaEditableData[id] = {};
  }

  socialMediaEditableData[id][field] = cloned[field];
};

export const onClickAddSocialMedia = (): void => {
  const newData: ITeacherSocialMedia = {
    id: Date.now(),
    name: undefined,
    value: undefined,
  };

  socialMediaItems.value.push(newData);
};

export const onClickDeleteSocialMedia = (id: TId): void => {
  socialMediaItems.value = socialMediaItems.value.filter((item) => item.id !== id);
};
