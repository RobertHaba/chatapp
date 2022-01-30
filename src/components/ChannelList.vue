<template>
  <ul class="flex flex-col bg-mirage-100 w-80 p-4 gap-4">
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
import { onMounted } from 'vue';
import { useStore } from 'vuex';

export default {
  components: { ChannelListItem },
  setup() {
    const channels = ref(null);
    const store = useStore();

    const getChannelsFromDB = async () => {
      try {
        const { data, error } = await supabase.from('Channels').select('*');
        if (error) throw error;
        console.log(data);
        channels.value = data;
        setDefaultActiveChannel(data[0]);
      } catch (error) {
        console.log(error);
      }
    };
    const setDefaultActiveChannel = (channel) => {
      console.log('Działa');
      store.commit('changeActiveChannel', channel);
    };
    onMounted(() => {
      getChannelsFromDB();
    });
    return { channels };
  },
};
</script>
