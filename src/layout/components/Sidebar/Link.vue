<script setup>
import { computed } from 'vue'
import { isExternal } from "@/utils/validate"

const props = defineProps({
  to: {
    type: String,
    required: true
  }
})

const isExternalPath = computed(() => isExternal(props.to))

const type = computed(() => {
  if (isExternalPath.value) {
    return 'a'
  }
  return 'router-link'
})

const linkProps = computed(() => {
  if (isExternalPath.value) {
    return {
      href: props.to,
      target: '_blank',
      rel: 'noopener'
    }
  }
  return {
    to: props.to
  }
})
</script>

<template>
  <component :is="type" v-bind="linkProps">
    <slot />
  </component>
</template>
