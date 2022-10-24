import { DirectiveBinding } from 'vue';

export default {
  beforeMount: (el: any, binding: DirectiveBinding<any>) => {
    const element = el;
    element.clickOutsideEvent = (event: Event) => {
      if (!(element === event.target || element.contains(event.target))) {
        binding.value(event, element);
      }
    };

    document.body.addEventListener('click', element.clickOutsideEvent);
  },
  unmounted: (el: any) => {
    document.body.removeEventListener('click', el.clickOutsideEvent);
  },
};
