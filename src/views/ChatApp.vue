<template>
  <section class="flex bg-mirage-100">
    <ChannelNavbar/>
    <Chat/>
  </section>
</template>

<script>
import ChannelNavbar from "../components/ChannelNavbar.vue";
import Chat from "../components/Chat.vue";
export default {
  components:{
    ChannelNavbar,
    Chat
  },
  setup() {
    return {

    };
  },
};
</script>

<style lang="scss" scoped></style>
