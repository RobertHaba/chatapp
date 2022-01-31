<template>
  <li
    class="grid grid-cols-10 items-center w-full px-2 py-4 h-20 rounded-lg gap-1 shadow-md"
    :class="[
      activeChannel.id === channel.id
        ? 'bg-gradient-to-tr from-purple to-red'
        : 'bg-mirage-200',
    ]"
    @click="changeActiveChannel"
    v-if="lastestMessage"
  >
    <UserAvatar
      class="col-span-2"
      :user="{ name: lastestMessage.user, id: lastestMessage.uid }"
    />
    <div class="col-span-6 h-full">
      <h2 class="text-sm font-semibold">{{ channel.name }}</h2>
      <p
        class="text-xs text-black-200 truncate"
        :class="[activeChannel.id === channel.id ? 'text-white' : 'text-gray']"
      >
        {{ lastestMessage.text }}
      </p>
    </div>
    <div
      class="col-span-2 h-full flex flex-col items-center"
      v-if="activeChannel.id !== channel.id"
    >
      <p class="text-xs mb-1">Teraz</p>
      <span
        class="font-extrabold text-xs bg-red w-5 h-5 rounded-full flex items-center justify-center"
        v-if="newMessageCount"
      >
        {{ newMessageCount }}
      </span>
    </div>
  </li>
</template>

<script>
import { computed, onMounted, ref } from 'vue';
import { useStore } from 'vuex';
import { supabase } from '../supabase/init';
import UserAvatar from './UserAvatar.vue';
export default {
  components: { UserAvatar },
  props: {
    channel: Object,
  },
  setup(props) {
    const store = useStore();
    const activeChannel = computed(() => store.state.activeChannel);
    const lastestMessage = ref(null);
    const newMessageCount = ref(0);
    const getLastMessageFromDB = async () => {
      try {
        const { data, error } = await supabase
          .from('Messages')
          .select('text,time,user,uid')
          .eq('channelID', props.channel.id)
          .order('time', { ascending: false })
          .limit(1);
        if (error) throw error;
        console.log('Lastest');
        console.log(data);
        console.log(props.channel.id);
        lastestMessage.value = data[0];
      } catch (error) {
        console.log(error);
      }
    };
    const subscribeToNewMessage = async () => {
      try {
        const { error } = await supabase
          .from(`Messages:channelID=eq.${props.channel.id}`)
          .on('INSERT', (payload) => {
            if (
              activeChannel.value &&
              activeChannel.value.id !== props.channel.id
            ) {
              newMessageCount.value += 1;
            }
            lastestMessage.value = payload.new;
            store.commit('addMessageFromDB', {channelID: props.channel.id, message:payload.new});
          })
          .subscribe();
        if (error) throw error;
      } catch (error) {
        console.log(error);
      }
    };
    const changeActiveChannel = () => {
      store.commit('changeActiveChannel', props.channel);
      newMessageCount.value = 0;
    };

    getLastMessageFromDB();
    subscribeToNewMessage();
    return {
      changeActiveChannel,
      activeChannel,
      lastestMessage,
      newMessageCount,
    };
  },
};
</script>

<style lang="scss" scoped></style>
