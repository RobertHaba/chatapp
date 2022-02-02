<template>
  <div
    class="h-[calc(100vh-8rem)] p-2 pb-14 sm:p-2 md:p-6 overflow-y-auto -translate-x-full slide-to-right"
    id="chatBody"
  >
    <template v-for="message in messages" :key="message.id">
      <ChatMessage
        v-if="!loading"
        :message="message"
        :scrollToBottomFunction="scrollToBottom"
      />
    </template>
    <div class="w-full h-full flex items-center justify-center" v-if="loading">
      <span class="block icon icon-loading animate-spin h-10 w-10"></span>
    </div>
  </div>
</template>

<script>
import { ref, watch, computed, onMounted } from 'vue';
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
    const msgRange = ref({ start: 0, end: 15 });
    const loading = ref(true);
    const loadingMore = ref(false);
    const chatBody = ref(null);
    const scrollProperty = ref({ now: 0, last: 0 });
    const getMessagesFromDB = async (getMore) => {
      if (messagesFromStore.value.length < 1 || getMore) {
        console.log('Pobieram dane  z bazy - brak wiadomości w store');
        try {
          const { data, error } = await supabase
            .from('Messages')
            .select('*')
            .eq('channelID', props.channel.id)
            .order('time', { ascending: false })
            .range(msgRange.value.start, msgRange.value.end);
          if (error) throw error;
          store.commit('addMessagesFromDB', {
            channelID: props.channel.id,
            messages: data,
            toEnd: getMore,
          });
        } catch (error) {
          console.log(error);
        }
      }
      handlerLoadMore(getMore);
      setMessages();
    };
    const setMessages = () => {
      loading.value = false;
      messages.value = messagesFromStore.value;
    };
    const scrollToBottom = () => {
      chatBody.value.scrollTop = chatBody.value.scrollHeight;
    };
    const handlerLoadMore = (loadMore) => {
      if (!loadMore) {
        watchForScrollToTop();
      } else {
        console.log(scrollProperty.value);
        loadingMore.value = false;
        const checkForDOMLoad = setInterval(() => {
          if (chatBody.value.children.length === messages.value.length) {
            chatBody.value.scrollTop =
              scrollProperty.value.now - scrollProperty.value.last;
            scrollProperty.value.last = scrollProperty.value.now;
            clearInterval(checkForDOMLoad);
          }
        }, 50);
        console.log(chatBody.value.scrollTop);
        console.log(chatBody.value.scrollHeight);
      }
    };
    const watchForScrollToTop = () => {
      chatBody.value.addEventListener('scroll', (e) => {
        if (e.target.scrollTop < 200) {
          if (!loadingMore.value) {
            console.log(e.target.scrollTop);
            console.log(e.target.offsetHeight);
            loadingMore.value = true;
            scrollProperty.value.now =
              e.target.scrollHeight + e.target.scrollTop;
            loadMoreMessages();
          }
        }
      });
    };
    const loadMoreMessages = () => {
      const allMsgLength = messages.value.length;
      console.log(allMsgLength);
      msgRange.value.start = allMsgLength;
      msgRange.value.end = allMsgLength + 15;
      getMessagesFromDB(true);
    };

    watch(
      () => props.channel,
      () => {
        messages.value = 0;
        getMessagesFromDB();
      }
    );
    onMounted(() => {
      chatBody.value = document.querySelector('#chatBody');
      getMessagesFromDB();
    });
    return { messages, scrollToBottom, loading };
  },
};
</script>

<style lang="scss" scoped></style>
