import Modal from 'ant-design-vue/lib/modal';
import { cloneDeep } from 'lodash';
import {
  reactive,
  Ref,
  ref,
  UnwrapRef,
} from 'vue';

import EIcon from '@/enums/modules/course/icon';
import lang from '@/helpers/lang';
import IEmployment from '@/interfaces/modules/course/employment';
import IFeature from '@/interfaces/modules/course/feature';
import ILearn from '@/interfaces/modules/course/learn';
import TId from '@/types/id';

export const learnColumns = [
  {
    title: lang('dashboard.description'),
    dataIndex: 'text',
  },
  {
    dataIndex: 'actions',
    width: 150,
  },
];

export const learnItems: Ref<ILearn[]> = ref([]);
export const learnEditableData: UnwrapRef<Record<TId, ILearn>> = reactive({});

export const employmentColumns = [
  {
    title: lang('dashboard.description'),
    dataIndex: 'text',
  },
  {
    dataIndex: 'actions',
    width: 150,
  },
];

export const employmentItems: Ref<IEmployment[]> = ref([]);
export const employmentEditableData: UnwrapRef<Record<TId, IEmployment>> = reactive({});

export const featureColumns = [
  {
    title: lang('dashboard.icon'),
    dataIndex: 'icon',
    width: 200,
  },
  {
    title: lang('dashboard.description'),
    dataIndex: 'text',
  },
  {
    dataIndex: 'actions',
    width: 150,
  },
];

export const featureItems: Ref<IFeature[]> = ref([]);
export const featureEditableData: UnwrapRef<Record<TId, IFeature>> = reactive({});

export const onClickAddLearn = (): void => {
  const newData: ILearn = {
    id: Date.now(),
    text: lang('dashboard.description') || '',
  };

  learnItems.value.push(newData);
};

export const learnSave = (id: TId): void => {
  if (learnEditableData[id].text) {
    Object.assign(learnItems.value.filter((item) => id === item.id)[0], learnEditableData[id]);

    delete learnEditableData[id];
  } else {
    Modal.warning({
      title: lang('dashboard.warning'),
      content: lang('dashboard.notEmpty'),
    });
  }
};

export const learnEdit = (id: TId): void => {
  learnEditableData[id] = cloneDeep(learnItems.value.filter((item) => id === item.id)[0]);
};

export const onClickDeleteLearn = (id: TId): void => {
  learnItems.value = learnItems.value.filter((item) => item.id !== id);
};

//

export const onClickAddEmployment = (): void => {
  const newData: IEmployment = {
    id: Date.now(),
    text: lang('dashboard.description') || '',
  };

  employmentItems.value.push(newData);
};

export const employmentSave = (id: TId): void => {
  if (employmentEditableData[id].text) {
    Object.assign(
      employmentItems.value.filter((item) => id === item.id)[0],
      employmentEditableData[id],
    );

    delete employmentEditableData[id];
  } else {
    Modal.warning({
      title: lang('dashboard.warning'),
      content: lang('dashboard.notEmpty'),
    });
  }
};

export const employmentEdit = (id: TId): void => {
  employmentEditableData[id] = cloneDeep(employmentItems.value.filter((item) => id === item.id)[0]);
};

export const onClickDeleteEmployment = (id: TId): void => {
  employmentItems.value = employmentItems.value.filter((item) => item.id !== id);
};

//

export const onClickAddFeature = (): void => {
  const newData: IFeature = {
    id: Date.now(),
    icon: EIcon.VIDEO,
    text: lang('dashboard.description') || '',
  };

  featureItems.value.push(newData);
};

export const featureSave = (id: TId): void => {
  const itemFound = featureItems.value.filter((item) => id === item.id)[0];

  if (
    (featureEditableData[id]?.icon && featureEditableData[id].icon !== '')
    || (featureEditableData[id]?.text && featureEditableData[id].text !== '')
  ) {
    Object.keys(featureEditableData[id]).forEach((filedKey) => {
      itemFound[filedKey] = featureEditableData[id][filedKey];
    });

    delete featureEditableData[id];
  } else {
    Modal.warning({
      title: lang('dashboard.warning'),
      content: lang('dashboard.notEmpty'),
    });
  }
};

export const featureEdit = (id: TId, field: string): void => {
  const cloned = cloneDeep(featureItems.value.filter((item) => id === item.id)[0]);

  if (!featureEditableData[id]) {
    featureEditableData[id] = {};
  }

  featureEditableData[id][field] = cloned[field];
};

export const onClickDeleteFeature = (id: TId): void => {
  featureItems.value = featureItems.value.filter((item) => item.id !== id);
};
