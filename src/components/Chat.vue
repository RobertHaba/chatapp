<template>
  <div
    class="w-full bg-orange-600 bg-mirage-100 max-h-screen"
    v-if="activeChannel && user"
  >
    <ChatNavbar :channel="activeChannel" />
    <ChatBody
      :channel="activeChannel"
      v-if="activeChannel"
      :key="activeChannel.id"
    />
    <ChatNewMessage :channel="activeChannel" />
  </div>
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';
import ChatBody from './ChatBody.vue';
import ChatNavbar from './ChatNavbar.vue';
import ChatNewMessage from './ChatNewMessage.vue';

export default {
  components: { ChatNavbar, ChatBody, ChatNewMessage },
  setup() {
    const store = useStore();
    const isMobileDevice = computed(()=>store.state.isMobileDevice)
    const activeChannel = computed(() => store.state.activeChannel);
    const user = computed(()=>store.state.user)
    store.dispatch('chechIfIsMobileDevice')
    const handleGesture = (touchPositions)=>{
      if(touchPositions.endX + 100 < touchPositions.startX ){
        store.commit('toggleShowMenu',false)
      }
      else if(touchPositions.endX > touchPositions.startX + 100){
        store.commit('toggleShowMenu',true)
      }
    }
    const addGestureSupport = ()=>{
      let touchPositions = {startX:null,endX:null}
      document.addEventListener('touchstart',e=>{
        touchPositions.startX = e.changedTouches[0].screenX
      })
      document.addEventListener('touchend',e=>{
        touchPositions.endX = e.changedTouches[0].screenX
        handleGesture(touchPositions)
      })
    }
    if(isMobileDevice.value){
      addGestureSupport()
    }
    return { activeChannel,user };
  },
};
</script>

<style lang="scss" scoped></style>
