<template>
  <div
    class="flex justify-center md:w-12 md:h-12 rounded-full bg-mirage-100 border-solid border-2 border-red"
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
        name:'Anon',
        id:'0'
      }
    },
  },
  setup(props) {
    const firstLetterFromLogin = computed(() => props.user.name.charAt(0).toUpperCase());
    return {firstLetterFromLogin};
  },
};
</script>

<style lang="scss" scoped></style>
