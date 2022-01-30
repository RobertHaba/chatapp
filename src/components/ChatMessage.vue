<template>
  <div
    class="flex flex-col w-full mb-4"
    :class="[isUserMessage ? 'items-end' : 'items-start']"
  >
    <div
      class="relative flex  w-fit gap-2"
      :class="[isUserMessage ? 'flex-row' : 'flex-row-reverse']"
    >
      <div
        class="flex flex-col"
        :class="[isUserMessage ? 'flex-row-reverse justify-end' : '']"
      >
        <p
          class="text-sm w-fit max-w-xs text-white p-4 bg-red rounded-lg h-min whitespace-pre-line"
          :class="[
            isUserMessage
              ? 'rounded-tr-none bg-gradient-to-tr from-purple to-red'
              : 'rounded-tl-none bg-gradient-to-br from-orange to-red',
          ]"
        >
          {{ message.text }}
        </p>
        <div
          class="relative w-full max-w-xs flex place-content-between mt-1 gap-2"
          :class="[isUserMessage ? 'flex-row-reverse' : '']"
        >
          <h4 class="text-xs text-gray" v-if="!isUserMessage">
            {{ message.user }}
          </h4>
          <time class="text-xs text-gray" :datetime="message.time">{{
            time
          }}</time>
        </div>
      </div>
      <UserAvatar
        class="w-8 h-8"
        :user="{ name: message.user, id: message.uid }"
      />
    </div>
  </div>
</template>

<script>
import { computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import UserAvatar from './UserAvatar.vue';

export default {
  components: { UserAvatar },
  props: {
    message: Object,
    scrollToBottomFunction: Function,
  },
  setup(props) {
    const store = useStore();
    const user = store.state.user;
    const isUserMessage = computed(() => user.id === props.message.uid);
    const time = computed(() => {
      const dateArray = props.message.time.split('T');
      const time = dateArray[1].split('.');
      return time[0];
    });
    onMounted(() => {
      props.scrollToBottomFunction();
    });
    return { isUserMessage, user, time };
  },
};
</script>

<style lang="scss" scoped></style>
