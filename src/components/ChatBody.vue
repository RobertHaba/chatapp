<template>
  <div class="h-[calc(100vh-8rem)] p-6 overflow-y-auto" id="chatBody">
    <template v-for="message in messages" :key="message.id">
      <ChatMessage
        v-if="messages"
        :message="message"
        :scrollToBottomFunction="scrollToBottom"
      />
    </template>
  </div>
</template>

<script>
import { ref, onMounted, watchEffect, watch, computed } from 'vue';
import { supabase } from '../supabase/init';
import ChatMessage from './ChatMessage.vue';
import { useStore } from 'vuex';

export default {
  components: { ChatMessage },
  props: {
    channel: Object,
  },
  setup(props) {
    const messages = ref(null);
    const store = useStore();
    const lastestMessages = computed(() => store.state.lastestMessages);
    const getMessagesFromDB = async () => {
      console.log(messages.value);
      try {
        const { data, error } = await supabase
          .from('Messages')
          .select('*')
          .eq('channelID', props.channel.id)
          .order('time', { ascending: false })
          .limit(15);
        if (error) throw error;
        messages.value = data.reverse();
        subscribeMessagesChanges();
      } catch (error) {
        console.log(error);
      }
    };
    
    const subscribeMessagesChanges = () => {
      console.log(lastestMessages.value[props.channel.id]);
      if (
        lastestMessages.value[props.channel.id] &&
        lastestMessages.value[props.channel.id].channelID === props.channel.id
      ) {
        messages.value.push(lastestMessages.value[props.channel.id]);
        store.commit('addNewLastestMessage', null);
      }
    };
    const scrollToBottom = () => {
      const chatBody = document.querySelector('#chatBody');
      chatBody.scrollTop = chatBody.scrollHeight;
    };

    getMessagesFromDB();
    watch(
      () => props.channel,
      () => {
        messages.value = 0;
        getMessagesFromDB();
      }
    );
    watch(
      () => lastestMessages.value[props.channel.id],
      () => {
        console.log('work');
        subscribeMessagesChanges();
      }
    );
    return { messages, scrollToBottom };
  },
};
</script>

<style lang="scss" scoped></style>
