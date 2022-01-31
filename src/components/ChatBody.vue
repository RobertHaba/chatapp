<template>
  <div class="h-[calc(100vh-8rem)] p-2 md:p-6 overflow-y-auto" id="chatBody">
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
    const store = useStore();
    const messagesFromStore = computed(
      () => store.state.messages[props.channel.id].data
    );
    const messages = ref(null);
    const getMessagesFromDB = async () => {
      if (messagesFromStore.value.length < 1) {
        console.log('Pobieram dane  z bazy - brak wiadomości w store');
        try {
          const { data, error } = await supabase
            .from('Messages')
            .select('*')
            .eq('channelID', props.channel.id)
            .order('time', { ascending: false })
            .limit(15);
          if (error) throw error;
          store.commit('addMessagesFromDB', {
            channelID: props.channel.id,
            messages: data,
          });
        } catch (error) {
          console.log(error);
        }
      } else {
        console.log('Pobieram dna z Store');
      }
      setMessages();
    };
    const setMessages = () => {
      messages.value = messagesFromStore.value
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
    return { messages, scrollToBottom };
  },
};
</script>

<style lang="scss" scoped></style>
