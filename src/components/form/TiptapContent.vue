<script setup lang="ts">
const props = defineProps({
    content: {
        type: String,
        required: true,
    },
});
</script>
<template>
    <div class="content max-w-7xl bg-gray-900 px-2 py-2 rounded" v-html="content"/>
</template>
<style>
  h1 {
    font-size: 2em;
  }
  h2 {
    font-size: 1.5em;
  }
  h3 {
    font-size: 1.17em;
  }
  h4 {
    font-size: 1.12em;
  }
  h5 {
    font-size: .83em;
  }


</style>
