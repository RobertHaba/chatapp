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
      <h2 class="text-sm font-semibold">{{ channel.name }}</h2><p
        class="text-xs truncate"
        :class="[activeChannel.id === channel.id ? 'text-white' : 'text-gray']"
      >
        <b>{{lastestMessage.user}}</b>: {{ lastestMessage.text }}
      </p>
    </div>
    <div
      class="col-span-2 h-full flex flex-col items-center"
      v-if="activeChannel.id !== channel.id"
    >
      <p class="text-xs mb-1" v-if="time">{{ time }}</p>
      <span
        class="font-extrabold text-[0.7rem] rounded-tr-none bg-gradient-to-tr from-purple to-red w-6 h-6 rounded-full flex items-center justify-center"
        v-if="newMessageCount"
      >
        {{ newMessageCount }}
      </span>
    </div>
  </li>
</template>

<script>
import { computed, ref } from 'vue';
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
    const intervalPassingTime = ref(null)
    const time = ref(String);
    const getLastMessageFromDB = async () => {
      try {
        const { data, error } = await supabase
          .from('Messages')
          .select('text,time,user,uid')
          .eq('channelID', props.channel.id)
          .order('time', { ascending: false })
          .limit(1);
        if (error) throw error;
        lastestMessage.value = data[0];
        getLastActivity(false);
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
              newMessageCount.value =
                newMessageCount.value < 99 ? newMessageCount.value + 1 : '99+';
            }
            lastestMessage.value = payload.new;
            store.commit('addMessageFromDB', {
              channelID: props.channel.id,
              message: payload.new,
            });
            getLastActivity(true);
          })
          .subscribe();
        if (error) throw error;
      } catch (error) {
        console.log(error);
      }
    };
    const getLastActivity = (isMsgChange) => {
      if (isMsgChange) {
        clearInterval(intervalPassingTime.value);
      }
      intervalPassingTime.value = setIntervalImmediately();
    };
    const setIntervalImmediately = () => {
      checkPassingTime();
      return setInterval(checkPassingTime, 30000);
    };
    const checkPassingTime = () => {
      const messageFullDate = new Date(lastestMessage.value.time);
      const msgfullTime = messageFullDate.toLocaleTimeString();
      const msgFullTimeArray = msgfullTime.split(':');
      const dateNow = new Date();
      const dateDifference = Math.floor(
        (dateNow - messageFullDate) / (1000 * 60)
      );
      let val;
      switch (true) {
        case dateDifference >= 1440:
          val = messageFullDate.toLocaleDateString();
          break;
        case dateDifference >= 180:
          val = `${msgFullTimeArray[0]}:${msgFullTimeArray[1]}`;
          break;
        case dateDifference >= 120:
          val = '2 godz';
          break;
        case dateDifference >= 60:
          val = `1 godz.`;
          break;
        case dateDifference >= 30:
          val = `30 min.`;
          break;
        case dateDifference >= 10:
          val = `10 min.`;
          break;
        case dateDifference >= 5:
          val = `5 min.`;
          break;
        case dateDifference >= 3:
          val = '3 min.';
          break;
        case dateDifference >= 2:
          val = '2 min.';
          break;
        case dateDifference >= 1:
          val = '1 min.';
          break;
        case dateDifference >= 0:
          val = 'Teraz';
          break;
      }
      time.value = val;
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
      time,
    };
  },
};
</script>

<style lang="scss" scoped></style>
