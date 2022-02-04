<template>
  <div class="flex text-white h-screen z-20" v-show="showMenu">
    <ul
      class="flex flex-col w-16 h-full p-2 bg-vulcan gap-6 z-20 -translate-x-full slide-to-right"
    >
      <li
        class="flex flex-col items-center justify-center gap-1 text-gray mt-20 md:mt-0"
      >
        <UserAvatar
          class="w-10 h-10"
          :user="{ name: user.name, id: user.id }"
        />
        <p class="text-xs over truncate text-center font-semibold" v-if="user">
          {{ user.name }}
        </p>
      </li>
      <ChannelNavbarListItem
        itemTitle="Czaty"
        icon="chat"
        class="lg:hidden"
        :handlerFunction="toggleShowChannels"
      />
      <ChannelNavbarListItem
        itemTitle="Instaluj"
        icon="download-app"
        class=""
        :handlerFunction="showInstallPrompt"
        v-if="deferredPrompt"
      />
      <ChannelNavbarListItem
        itemTitle="Powiado."
        :icon="notificationIcon"
        :itemSubtitle="notificationSubtitle"
        :handlerFunction="toggleAllowNotification"
      />
      <ChannelNavbarListItem
        itemTitle="Audio"
        :icon="soundIcon"
        :handlerFunction="handlerToggleAllowSound"
      />
      <ChannelNavbarListItem
        class="!fixed bottom-0"
        itemTitle="Wyloguj"
        icon="sign-out"
        :handlerFunction="singOutUser"
      />
    </ul>

    <div
      class="fixed top-0 left-16 flex flex-col bg-mirage-100 w-[calc(100%-4rem)] sm:w-80 h-full md:relative md:left-0 z-10 -translate-x-full slide-to-right"
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
import { computed, onMounted, ref } from 'vue';
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
    const allowNotifications = computed(() => store.state.allowNotifications);
    const allowSound = computed(() => store.state.allowSound);
    const notificationSubtitle = computed(() =>
      allowNotifications.value ? 'aktywne' : 'nieaktywne'
    );
    const notificationIcon = computed(() =>
      allowNotifications.value ? 'ring-on' : 'ring-off'
    );
    const soundIcon = computed(() =>
      allowSound.value ? 'volume-high' : 'volume-slash'
    );
    const showChannels = ref(true);
    const deferredPrompt = ref(null);
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
    const showInstallPrompt = async () => {
      if (deferredPrompt.value !== null) {
        deferredPrompt.value.prompt();
        const { outcome } = await deferredPrompt.value.userChoice;
        if (outcome === 'accepted') {
          deferredPrompt.value = null;
        }
      }
    };

    const toggleAllowNotification = () => {
      if (Notification.permission !== 'granted') {
        Notification.requestPermission().then((res) => {
          if (res === 'granted') {
            store.commit('toggleAllowNotification', true);
            toggleAllowInLocalStorage('allowNotification',true)
          }
        });
      }
      else{
            store.commit('toggleAllowNotification', !allowNotifications.value);
            toggleAllowInLocalStorage('allowNotification',allowNotifications.value)
      }
    };
    const initBeforeInstallPrompt = () => {
      window.addEventListener('beforeinstallprompt', (e) => {
        deferredPrompt.value = e;
      });
    };
    const toggleShowChannels = () => {
      showChannels.value = !showChannels.value;
    };
    const handlerToggleAllowSound = () => {
      store.commit('toggleAllowSound');
      toggleAllowInLocalStorage('allowAudio',allowSound.value);
    };
    const toggleAllowInLocalStorage = (keyName,value) => {
      localStorage.setItem(keyName, value);
    };
    onMounted(() => {
      checkScreenWidth();
      initBeforeInstallPrompt();
    });
    return {
      user,
      singOutUser,
      showChannels,
      showMenu,
      toggleShowChannels,
      showInstallPrompt,
      deferredPrompt,
      toggleAllowNotification,
      handlerToggleAllowSound,
      notificationSubtitle,
      notificationIcon,
      soundIcon,
    };
  },
};
</script>
