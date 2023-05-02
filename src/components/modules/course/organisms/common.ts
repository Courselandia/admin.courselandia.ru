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
import IFeature from '@/interfaces/modules/course/feature';
import ILearn from '@/interfaces/modules/course/learn';
import IProgram from '@/interfaces/modules/course/program';
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

export const programColumns = [
  {
    title: lang('dashboard.id'),
    dataIndex: 'id',
    width: 100,
  },
  {
    title: lang('dashboard.name'),
    dataIndex: 'name',
    width: 300,
  },
  {
    title: lang('dashboard.description'),
    dataIndex: 'text',
  },
  {
    dataIndex: 'actions',
    width: 280,
  },
];

export const programItems: Ref<IProgram[]> = ref([]);
export const programEditableData: UnwrapRef<Record<TId, IProgram>> = reactive({});
export const programShowModalText: UnwrapRef<Record<number, boolean>> = reactive({});

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

//

const findItemById = (idSearch: TId, items: IProgram[]): IProgram | null => {
  for (let i = 0; i < items.length; i++) {
    if (items[i].id === idSearch) {
      return items[i];
    }

    if (items[i].children) {
      const found = findItemById(idSearch, items[i].children || []);

      if (found) {
        return found;
      }
    }
  }

  return null;
};

export const onClickAddProgram = (id?: TId): void => {
  const getLastId = (items: IProgram[]): number => {
    let lastId = 0;

    for (let i = 0; i < items.length; i++) {
      const idCurrent = items[i].id || 0;
      if (idCurrent > lastId) {
        lastId = idCurrent;
      }

      if (items[i].children) {
        const lastIdInside = getLastId(items[i].children || []);

        if (lastIdInside > lastId) {
          lastId = lastIdInside;
        }
      }
    }

    return lastId;
  };

  const nextId = getLastId(programItems.value) + 1;

  const newData: IProgram = {
    id: nextId,
    name: lang('course.programName') || '',
    text: lang('course.programDescription') || '',
  };

  if (id) {
    const item = findItemById(id, programItems.value);

    if (item) {
      if (!item.children) {
        item.children = [];
      }

      item.children.push(newData);
    }
  } else {
    programItems.value.push(newData);
  }
};

export const programSave = (id: number): void => {
  const itemFound = findItemById(id, programItems.value);

  if (itemFound) {
    if (
      (programEditableData[id]?.name && programEditableData[id].name !== '')
      || programEditableData[id]?.text !== undefined
    ) {
      Object.keys(programEditableData[id]).forEach((filedKey) => {
        itemFound[filedKey] = programEditableData[id][filedKey];
      });

      delete programEditableData[id];
      programShowModalText[id] = false;
    } else {
      console.log(2);
      Modal.warning({
        title: lang('dashboard.warning'),
        content: lang('dashboard.notEmpty'),
      });
    }
  }
};

export const programEdit = (id: number, field: string): void => {
  const cloned = findItemById(id, programItems.value);

  if (cloned) {
    if (!programEditableData[id]) {
      programEditableData[id] = {};
    }

    programEditableData[id][field] = cloned[field];

    if (field === 'text') {
      programShowModalText[id] = true;
    }
  }
};

export const onClickDeleteProgram = (id: TId): void => {
  const findBranchById = (idSearch: TId, items: IProgram[]): IProgram[] | null => {
    for (let i = 0; i < items.length; i++) {
      if (items[i].id === idSearch) {
        return items;
      }

      if (items[i].children) {
        const found = findBranchById(idSearch, items[i].children || []);

        if (found) {
          return found;
        }
      }
    }

    return null;
  };

  const branch = findBranchById(id, programItems.value);

  if (branch) {
    const indexToRemove = branch.findIndex((item) => item.id === id);

    if (indexToRemove !== -1) {
      branch.splice(indexToRemove, 1);
    }
  }

  const cleanItems = (items: IProgram[]): void => {
    for (let i = 0; i < items.length; i++) {
      if (items[i].children?.length === 0) {
        // eslint-disable-next-line no-param-reassign
        items[i].children = undefined;
      }

      if (items[i]?.children?.length !== 0) {
        cleanItems(items[i].children || []);
      }
    }
  };

  cleanItems(programItems.value);
};
