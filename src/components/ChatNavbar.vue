<template>
  <section
    class="h-16 flex items-center w-full p-2 shadow-md gap-4 bg-mirage-200"
  >
    <div class="w-10 h-10 bg-white rounded-full"></div>
    <div class="flex flex-col h-full">
      <h3 class="flex items-center text-white font-bold text-sm gap-1">
        {{ channel.name }}
        <span class="flex rounded-full w-2 h-2 bg-green"></span>
      </h3>
      <p class="text-gray text-xs">Aktywny</p>
    </div>
  </section>
</template>

<script>
export default {
  props: {
    channel: Object,
  },
  setup() {
  },
};
</script>
