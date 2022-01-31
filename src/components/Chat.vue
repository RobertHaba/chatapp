<template>
  <div
    class="w-full bg-orange-600 bg-mirage-100 max-h-screen"
    v-if="activeChannel"
  >
    <ChatNavbar :channel="activeChannel" />
    <ChatBody
      :channel="activeChannel"
      v-if="activeChannel"
      :key="activeChannel.id"
    />
    <ChatNewMessage :channel="activeChannel" />
  </div>
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';
import ChatBody from './ChatBody.vue';
import ChatNavbar from './ChatNavbar.vue';
import ChatNewMessage from './ChatNewMessage.vue';

export default {
  components: { ChatNavbar, ChatBody, ChatNewMessage },
  setup() {
    const store = useStore();
    const activeChannel = computed(() => store.state.activeChannel);
    store.dispatch('chechIfIsMobileDevice')
    return { activeChannel };
  },
};
</script>

<style lang="scss" scoped></style>
