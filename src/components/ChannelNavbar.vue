<template>
  <div class="flex text-white h-screen" v-show="showMenu">
    <ul class="flex flex-col w-16 p-2 bg-vulcan gap-6 justify-between">
      <li
        class="flex flex-col items-center justify-center gap-1 text-gray mt-14 md:mt-0"
      >
        <UserAvatar />
        <p class="text-xs over truncate text-center font-semibold" v-if="user">
          {{ user.name }}
        </p>
      </li>
      <ChannelNavbarListItem
        itemTitle="Czaty"
        icon="chat"
        :handlerFunction="toggleShowChannels"
      />
      <ChannelNavbarListItem
        itemTitle="Wyloguj"
        icon="sign-out"
        :handlerFunction="singOutUser"
      />
    </ul>

    <div
      class="absolute top-0 left-16 flex flex-col bg-mirage-100 w-[calc(100%-4rem)] sm:w-80 h-full md:relative md:left-0 z-10"
      v-show="showChannels"
    >
      <div class="h-16 mb-2 shadow-md bg-mirage-200 p-4">
        <h1 class="text-lg font-bold">Czaty</h1>
      </div>
      <ChannelList />
    </div>
  </div>
</template>

<script>
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { supabase } from '../supabase/init';
import ChannelList from './ChannelList.vue';
import UserAvatar from './UserAvatar.vue';
import ChannelNavbarListItem from './ChannelNavbarListItem.vue';

export default {
  components: { ChannelList, UserAvatar, ChannelNavbarListItem },
  setup() {
    const store = useStore();
    const router = useRouter();
    const user = computed(() => store.state.user);
    const showMenu = computed(() => store.state.showMenu);
    const showChannels = ref(true);
    const singOutUser = async () => {
      try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        store.commit('setUser', null);
        router.push('/login');
      } catch (error) {
        console.log(error);
      }
    };
    const checkScreenWidth = () => {
      if (window.innerWidth < 768) {
        store.commit('toggleShowMenu');
      }
    };
    const toggleShowChannels = () => {
      showChannels.value = !showChannels.value;
    };
    checkScreenWidth();
    return { user, singOutUser, showChannels, showMenu, toggleShowChannels };
  },
};
</script>

<style lang="scss" scoped></style>
