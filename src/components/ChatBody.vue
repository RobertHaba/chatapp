<template>
  <div class="relative">
    <div
      class="h-[calc(100vh-8rem)] p-2 pb-14 sm:p-2 md:p-6 overflow-y-auto -translate-x-full slide-to-right"
      id="chatBody"
    >
      <template v-for="message in messages" :key="message.id">
        <ChatMessage
          v-if="!loading"
          :message="message"
          :isMessagesFromFirstGet="isMessagesFromFirstGet"
          :scrollToBottomFunction="scrollToBottom"
        />
      </template>
      <div
        class="w-full h-full flex items-center justify-center"
        v-if="loading"
      >
        <span class="block icon icon-loading animate-spin h-10 w-10"></span>
      </div>
    </div>
    <div
      class="fixed py-2 px-8 w-60 inset-x-0 mx-auto bottom-20 bg-vulcan text-gray rounded-lg text-sm flex gap-4 translate-y-full slide-to-top"
      v-if="
        isNewMessage.status &&
        isNewMessage.channel === channel.id &&
        scrollProperty.isActive
      "
    >
      <button
        @click="scrollToBottom(true), changeIsNewMessageToFalse"
        class="transition-all h-6 w-32 hover:text-white hover:font-bold cursor-pointer"
      >
        Nowa wiadomość
      </button>
      <button
        class="w-6 h-6 group flex justify-center items-center"
        @click="changeIsNewMessageToFalse"
      >
        <i
          class="block icon icon-close h-5 w-5 transition-all group-hover:rotate-180 group-hover:w-6 group-hover:h-6"
        ></i>
      </button>
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
    // Messages
    const messagesFromStore = computed(
      () => store.state.messages[props.channel.id].data
    );
    const messages = ref(null);
    const msgRange = ref({ start: 0, end: 15 }); // For getting from DB
    // Status
    const loading = ref(true);
    const loadingMore = ref(false);
    const isMessagesFromFirstGet = ref(true);
    const isNewMessage = computed(() => store.state.isNewMessage);
    const isMoreMessage = ref(true);
    const scrollProperty = ref({
      heightLast: 0,
      heightNow: 0,
      isActive: false,
    });
    // DOM
    const chatBodyDOM = ref(null);

    const getMessagesFromDB = async (getMore = false) => {
      if (
        (messagesFromStore.value.length < 1 && isMoreMessage.value) ||
        (getMore && isMoreMessage.value)
      ) {
        try {
          const { data, error } = await supabase
            .from('Messages')
            .select('*')
            .eq('channelID', props.channel.id)
            .order('time', { ascending: false })
            .range(msgRange.value.start, msgRange.value.end);
          isMoreMessage.value = data.length > 15 ? true : false;
          if (error) throw error;
          store.commit('addMessagesFromDB', {
            channelID: props.channel.id,
            messages: data,
            toEnd: getMore,
          });
          isMessagesFromFirstGet.value = !getMore;
        } catch (error) {
          console.log(error);
        }
      }
      const loadMore = isMoreMessage.value ? getMore : false;
      handlerLoadMore(loadMore);
      setMessages();
    };
    const setMessages = () => {
      loading.value = false;
      messages.value = messagesFromStore.value;
    };
    const changeIsNewMessageToFalse = () => {
      store.commit('handlerIsNewMessage', false);
    };
    const scrollToBottom = (isNewMsg = false) => {
      if (isNewMsg || !scrollProperty.value.isActive) {
        chatBodyDOM.value.scrollTop = chatBodyDOM.value.scrollHeight;
        scrollProperty.value.isActive = false;
        changeIsNewMessageToFalse();
      }
    };
    const handlerLoadMore = (loadMore) => {
      if (!loadMore) {
        watchForScrollMove();
      } else {
        loadingMore.value = false;
        const checkForDOMLoad = setInterval(() => {
          if (chatBodyDOM.value.children.length === messages.value.length) {
            if (!isMoreMessage.value) {
              chatBodyDOM.value.scrollTop = 0;
            } else {
              chatBodyDOM.value.scrollTop =
                scrollProperty.value.heightNow -
                scrollProperty.value.heightLast;
            }

            scrollProperty.value.heightLast = scrollProperty.value.heightNow;
            clearInterval(checkForDOMLoad);
          }
        }, 5);
      }
    };
    const watchForScrollMove = () => {
      chatBodyDOM.value.addEventListener('scroll', (e) => {
        if (
          e.target.scrollTop <
          e.target.scrollHeight - e.target.offsetHeight - 50
        ) {
          scrollProperty.value.isActive = true;
        } else {
          scrollProperty.value.isActive = false;
          changeIsNewMessageToFalse();
        }
        if (e.target.scrollTop < 100 && !loadingMore.value) {
          loadingMore.value = true;
          scrollProperty.value.heightNow = e.target.scrollHeight;
          loadMoreMessages();
        }
      });
    };
    const loadMoreMessages = () => {
      const allMsgLength = messages.value.length;
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
      chatBodyDOM.value = document.querySelector('#chatBody');
      getMessagesFromDB();
    });
    return {
      messages,
      loading,
      scrollToBottom,
      isMessagesFromFirstGet,
      scrollProperty,
      isNewMessage,
      changeIsNewMessageToFalse,
    };
  },
};
</script>

<style lang="scss" scoped></style>
