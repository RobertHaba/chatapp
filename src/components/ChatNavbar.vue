<template>
  <section
    class="h-16 flex items-center w-full p-2 pl-16 md:pl-2 shadow-md gap-4 bg-mirage-200"
  >
    <button
      class="absolute w-12 h-12 left-2 top-2 md:hidden z-30 flex items-center justify-center bg-mirage-200"
      @click="toggleShowMenu()"
    >
      <span class="block icon w-6 h-6 icon-menu-burger"></span>
    </button>
    <span class="block icon w-10 h-10 bg-white rounded-full" :class="`icon-img-${channel.icons}`">

    </span>
    <div class="flex flex-col h-full">
      <h3 class="flex items-center text-white font-bold text-sm gap-1">
        {{ channel.name }}
      </h3>
      <p class="text-gray text-xs">{{channel.description}}</p>
    </div>
  </section>
</template>

<script>
import { useStore } from 'vuex';

export default {
  props: {
    channel: Object,
  },
  setup() {
    const store = useStore();
    const toggleShowMenu = () => {
      store.commit('toggleShowMenu');
    };
    return { toggleShowMenu };
  },
};
</script>
