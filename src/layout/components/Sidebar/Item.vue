<template>
  <span>
    <svg-icon v-if="icon" :icon-class="icon" />
    <span v-if="title" class="sidebar-title">{{ title }}</span>
  </span>
</template>

<script setup>
defineProps({
  icon: {
    type: String,
    default: ""
  },
  title: {
    type: String,
    default: ""
  }
})
</script>
