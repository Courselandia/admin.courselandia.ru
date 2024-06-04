<template>
  <div>
    <Item
      label="Значение 1"
      name="nameValue1"
      has-feedback
    >
      <Input
        v-if="typeof form.nameValue1 === 'object'"
        v-model:value="form.nameValue1[0]"
      />
    </Item>
    <Item
      label="Значение 2"
      name="nameValue2"
      has-feedback
    >
      <Input
        v-if="typeof form.nameValue2 === 'string' || typeof form.nameValue2 === 'number'"
        v-model:value="form.nameValue2"
      />
    </Item>
  </div>
</template>

<script lang="ts" setup>
import Form from 'ant-design-vue/lib/form';
import Input from 'ant-design-vue/lib/input';
import {
  PropType,
  ref,
  toRefs,
  watch,
} from 'vue';

const props = defineProps({
  form: {
    type: Object as PropType<Record<string, Array<string | number> | string | number>>,
    required: true,
  },
});

const emit = defineEmits({
  'update:form': (_: Record<string, Array<string | number> | string | number>) => true,
});

const { Item } = Form;

const {
  form,
} = toRefs(props);
const formValue = ref<Record<string, Array<string | number> | string | number>>(form.value);

watch(formValue, () => {
  emit('update:form', formValue.value);
}, {
  deep: true,
});

watch(form, () => {
  formValue.value = form.value;
}, {
  deep: true,
});
</script>
