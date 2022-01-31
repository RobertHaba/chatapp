<template>
  <div class="flex text-white h-screen">
    <ul class="flex flex-col w-16 p-2 bg-vulcan gap-6 justify-between">
      <li class="flex flex-col items-center justify-center gap-1 text-gray">
        <UserAvatar />
        <p class="text-xs over truncate text-center font-semibold">
          {{ user.name }}
        </p>
      </li>
      <li class="relative h-14 cursor-pointer">
        <button class="flex flex-col items-center justify-center gap-1 group" @click="singOutUser">
          <span class="block icon icon-sign-out w-5 h-5 z-10"></span>
          <p
            class="text-xs text-gray group-hover:text-white group-hover:font-semibold transition-all z-10"
          >
            Wyloguj
          </p>
          <span
            class="absolute transition-all -left-2 bg-red w-1 h-10 rounded z-0 group-hover:w-16 group-hover:h-14"
          ></span>
        </button>
      </li>
    </ul>

    <div class="flex flex-col bg-mirage-100 w-80">
      <div class="h-16 mb-2 shadow-md bg-mirage-200 p-4">
        <h1 class="text-lg font-bold">Czaty</h1>
      </div>
      <ChannelList/>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { supabase } from '../supabase/init';
import ChannelList from './ChannelList.vue';
import UserAvatar from './UserAvatar.vue';

export default {
  components: { ChannelList, UserAvatar },
  setup() {
    const store = useStore();
    const router = useRouter()
    const user = store.state.user;
    const singOutUser = async ()=>{
      try {
        const {error} = await supabase.auth.signOut()
        if(error) throw error
        store.commit('setUser',null)
        router.push('/login')
      } catch (error) {
        console.log(error);
      }
    }
    return { user, singOutUser };
  },
};
</script>

<style lang="scss" scoped></style>
