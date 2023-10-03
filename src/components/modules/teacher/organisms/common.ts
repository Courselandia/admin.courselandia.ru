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
    place: null,
    position: null,
    started: null,
    finished: null,
    weight: null,
  };

  experienceItems.value.push(newData);
};

export const onClickDeleteExperience = (id: TId): void => {
  experienceItems.value = experienceItems.value.filter((item) => item.id !== id);
};
