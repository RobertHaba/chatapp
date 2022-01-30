<template>
  <div class="flex text-white h-screen">
    <ul class="flex flex-col w-16 p-2 bg-vulcan">
      <UserAvatar />
      <li>a</li>
    </ul>
    <div class="flex flex-col bg-mirage-100 w-80 ">
      <div class="h-16 mb-2 shadow-md bg-mirage-200 p-4">
        <h1 class="text-lg font-bold">Czaty</h1>
      </div>
      <ChannelList />
    </div>
  </div>
</template>

<script>
import ChannelList from './ChannelList.vue';
import UserAvatar from './UserAvatar.vue';
UserAvatar
export default {
  components: { ChannelList, UserAvatar },
};
</script>

<style lang="scss" scoped></style>
