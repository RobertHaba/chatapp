<template>
  <div
    class="fixed h-16 bg-mirage-200 px-4 py-2 flex items-center gap-4 shadow-md w-full bottom-0 right-0 z-10 md:relative"
    :class="[isShowMenuOpen && isMobileDevice ? 'w-[calc(100%-4rem)]' : '']"
  >
    <button class="relative w-6 h-6" @click="showEmojiList = !showEmojiList">
      <i class="block icon icon-happy w-6 h-6 opacity-70"></i>
    </button>
    <ChatNewMessageEmojiList
      v-if="showEmojiList"
      :addEmojiToTextHandler="addEmojiToText"
      :closeEmojiModal="closeEmojiModal"
    />
    <textarea
      class="w-full resize-none h-full bg-mirage-200 text-white rounded-lg p-2 text-sm"
      maxlength="255"
      placeholder="Napisz wiadomość..."
      v-model="newMessage"
      id="newMessageArea"
      @keypress.enter="handlerSendMessage"
      @keyup="checkFirstLetter"
    ></textarea>
    <button class="w-6 h-6" @click="handlerSendMessage">
      <i class="flex w-6 h-6 icon icon-send"></i>
    </button>
  </div>
</template>

<script>
import { supabase } from '../supabase/init';
import { computed, ref } from 'vue';
import { useStore } from 'vuex';
import ChatNewMessageEmojiList from './ChatNewMessageEmojiList.vue';

export default {
  components: { ChatNewMessageEmojiList },
  props: {
    channel: Object,
  },
  setup(props) {
    const store = useStore();
    const user = store.state.user;
    const newMessage = ref('');
    const showEmojiList = ref(false);
    const isShowMenuOpen = computed(() => store.state.showMenu);
    const isMobileDevice = computed(() => store.state.isMobileDevice);
    const handlerSendMessage = (e) => {
      if (!e.shiftKey && isNotEmptyMessage() && !isMobileDevice.value) {
        sendNewMessage();
      } else if (isMobileDevice.value && e.type !== 'keypress') {
        sendNewMessage();
      }
    };
    const isNotEmptyMessage = () => {
      console.log(newMessage.value.length);
      return newMessage.value.length > 0 ? true : false;
    };
    const checkFirstLetter = () => {
      if (!newMessage.value.replace(/\s/g, '').length) {
        newMessage.value = '';
      }
    };
    const sendNewMessage = async () => {
      console.log(props.channel.id);
      try {
        const { data, error } = await supabase.from('Messages').insert({
          text: newMessage.value,
          channelID: props.channel.id,
          uid: user.id,
          user: user.name,
        });
        if (error) throw error;
        newMessage.value = '';
      } catch (error) {
        console.log(error);
      }
    };
    const addEmojiToText = (emoji) => {
      let textareaMessage = document.getElementById('newMessageArea');
      const caretStart = textareaMessage.selectionStart;
      newMessage.value =
        newMessage.value.substring(0, caretStart) +
        ' ' +
        emoji +
        ' ' +
        newMessage.value.substring(caretStart);
      closeEmojiModal();
      setTimeout(() => {
        textareaMessage.focus();
        textareaMessage.selectionStart = caretStart + 3;
        textareaMessage.selectionEnd = caretStart + 3;
      }, 10);
      // Render caret position in textarea for Vue. setTimeout is important for caret work
    };
    const closeEmojiModal = () => {
      showEmojiList.value = false;
    };
    return {
      handlerSendMessage,
      newMessage,
      checkFirstLetter,
      isShowMenuOpen,
      isMobileDevice,
      addEmojiToText,
      showEmojiList,
      closeEmojiModal,
    };
  },
};
</script>

<style lang="scss" scoped></style>
