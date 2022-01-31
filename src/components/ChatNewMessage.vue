<template>
  <div class="h-16 bg-mirage-200 px-4 py-2 flex items-center gap-4 shadow-md">
    <textarea
      class="w-full resize-none h-full bg-mirage-200 text-white rounded-lg p-2 text-sm"
      maxlength="255"
      placeholder="Napisz wiadomość..."
      v-model="newMessage"
      @keypress.enter="handlerSendMessage"
      @keyup="checkFirstLetter"
    ></textarea>
    {{ isMobileDevice }}
    <button class="w-6 h-6" @click="handlerSendMessage">
      <i class="flex w-6 h-6 icon icon-send"></i>
    </button>
  </div>
</template>

<script>
import { supabase } from '../supabase/init';
import { computed, ref } from 'vue';
import { useStore } from 'vuex';

export default {
  props: {
    channel: Object,
  },
  setup(props) {
    const newMessage = ref('');
    const store = useStore();
    const user = store.state.user;
    const isMobileDevice = computed(() => store.state.isMobileDevice);
    const handlerSendMessage = (e) => {
      console.log(e);
      if (!e.shiftKey && isNotEmptyMessage() && !isMobileDevice.value) {
        sendNewMessage();
      }
      else if(isMobileDevice.value && e.type !== 'keypress'){
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
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    };

    return { handlerSendMessage, newMessage, checkFirstLetter, isMobileDevice };
  },
};
</script>

<style lang="scss" scoped></style>
