<template>
  <ul class="flex flex-col bg-mirage-100 max-w-80 p-4 gap-4">
    <ChannelListItem
      v-for="channel in channels"
      :key="channel.id"
      :channel="channel"
    />
  </ul>
</template>

<script>
import ChannelListItem from './ChannelListItem.vue';
import { supabase } from '../supabase/init';
import { ref } from '@vue/reactivity';
import { onMounted, watchEffect, computed } from 'vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';

export default {
  components: { ChannelListItem },
  setup() {
    const channels = ref(null);
    const store = useStore();
    const route = useRoute();
    const getChannelsFromDB = async () => {
      try {
        const { data, error } = await supabase.from('Channels').select('*');
        if (error) throw error;
        channels.value = data;
        const channelFromNotification = channels.value.find(
          (channel) => channel.id === route.params.id
        );
        
        setDefaultActiveChannel(
          channelFromNotification ? channelFromNotification : data[0]
        );
        store.commit('createMessageObject', data);
      } catch (error) {
        console.log(error);
      }
    };
    const setDefaultActiveChannel = (channel) => {
      store.commit('changeActiveChannel', channel);
    };
    onMounted(() => {
      getChannelsFromDB();
    });
    return { channels };
  },
};
</script>
