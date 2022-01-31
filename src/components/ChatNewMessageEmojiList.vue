<template>
  <div
    class="absolute w-full max-w-xs h-20 left-0 bottom-full mb-4 p-2 flex items-center justify-around drop-shadow-lg bg-mirage-200 z-10 rounded-lg"
  >
    <button
      @click="addEmojiToTextHandler(emoji)"
      v-for="emoji in emojiList"
      :key="emoji"
      class="-translate-x-full transition-all rotate-0 group hover:-rotate-12 slide-to-right"
    >
      <span class="text-xl transition-all rotate-0 group-hover:text-2xl ">{{emoji}}</span>
    </button>
  </div>
</template>

<script>
import { ref } from 'vue';
export default {
  props: {
    addEmojiToTextHandler: Function,
  },
  setup() {
    const emojiList = ref(['😊', '😂', '👍', '❤️', '🥰', '😍']);
    return { emojiList };
  },
};
</script>

<style lang="scss" scoped></style>
