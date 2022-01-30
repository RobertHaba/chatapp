<template>
  <div
    class="flex justify-center w-12 h-12 rounded-full bg-mirage-100 border-solid border-2 border-red"
  >
    <span class="self-center text-red opacity-70 font-bold">{{firstLetterFromLogin}}</span>
  </div>
</template>
<script>
import { computed } from 'vue';

export default {
  props: {
    user: {
      type:Object,
      default:{
        name:'Annonymous',
        id:'0'
      }
    },
  },
  setup(props) {
    const firstLetterFromLogin = computed(() => props.user.name.charAt(0));
    return {firstLetterFromLogin};
  },
};
</script>

<style lang="scss" scoped></style>
