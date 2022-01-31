<template>
  <li class="relative h-14 cursor-pointer flex items-center">
    <button
      class="flex flex-col items-center justify-center gap-1 w-full group"
      @click="handlerFunction"
    >
      <span class="block icon w-5 h-5 z-10" :class="`icon-${icon}`"></span>
      <p
        class="text-xs text-gray group-hover:text-white group-hover:font-semibold transition-all z-10"
      >
        {{itemTitle}}
      </p>
      <span
        class="absolute transition-all -left-2 bg-red w-1 h-10 rounded z-0 group-hover:w-16 group-hover:h-14"
      ></span>
    </button>
  </li>
</template>

<script>
export default {
  props:{
    itemTitle:String,
    icon:String,
    handlerFunction:Function
  },
  setup() {
    return {};
  },
};
</script>

<style lang="scss" scoped></style>
