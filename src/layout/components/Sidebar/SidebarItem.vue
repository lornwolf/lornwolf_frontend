<template>
  <div v-if="!item.hidden">
    <el-menu-item
      v-if="
        hasOneShowingChild(item.children, item) &&
        (!onlyOneChild.children || onlyOneChild.noShowingChildren) &&
        !item.alwaysShow &&
        onlyOneChild.meta
      "
      :index="resolvePath(onlyOneChild.path)"
      :class="{ 'submenu-title-noDropdown': !isNest }"
      @click="handleLink(onlyOneChild.path)"
    >
      <item
        :icon="onlyOneChild.meta?.icon || item.meta?.icon || ''"
        :title="onlyOneChild.meta?.title || ''"
      />
    </el-menu-item>

    <el-sub-menu
      v-else-if="item.children && item.children.length > 0"
      ref="subMenu"
      :index="resolvePath(item.path)"
    >
      <template #title>
        <item
          :icon="item.meta?.icon || ''"
          :title="item.meta?.title || ''"
        />
      </template>
      <sidebar-item
        v-for="child in item.children"
        :key="child.path"
        :is-nest="true"
        :item="child"
        :base-path="resolvePath(child.path)"
        class="nest-menu"
      />
    </el-sub-menu>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { isExternal } from "@/utils/validate"
import Item from "./Item"
import { useFixiOSBug } from "./useFixiOSBug"

const props = defineProps({
  item: {
    type: Object,
    required: true
  },
  isNest: {
    type: Boolean,
    default: false
  },
  basePath: {
    type: String,
    default: ""
  }
})

const router = useRouter()
const subMenu = ref(null)
useFixiOSBug(subMenu) // Apply iOS bug fix

import { onMounted } from 'vue'
onMounted(() => {
   // console.log('SidebarItem mounted:', props.item.path)
})

const onlyOneChild = ref(null)

const hasOneShowingChild = (children = [], parent) => {
  const showingChildren = children.filter((item) => {
    if (item.hidden) {
      return false
    } else {
      // Temp set(will be used if only has one showing child)
      onlyOneChild.value = item
      return true
    }
  })

  // When there is only one child router, the child router is displayed by default
  if (showingChildren.length === 1) {
    return true
  }

  // Show parent if there are no child router to display
  if (showingChildren.length === 0) {
    onlyOneChild.value = { ...parent, path: "", noShowingChildren: true }
    return true
  }

  return false
}

const resolvePath = (routePath) => {
  if (isExternal(routePath)) {
    return routePath
  }
  if (isExternal(props.basePath)) {
    return props.basePath
  }
  
  if (routePath === "") {
    return props.basePath
  }

  // Simple path join implementation to replace 'path' module
  const base = props.basePath.endsWith('/') ? props.basePath : props.basePath + '/'
  const segment = routePath.startsWith('/') ? routePath.slice(1) : routePath
  return (base + segment).replace('//', '/') // Ensure no double slashes
}

const handleLink = (routePath) => {
  const resolvedPath = resolvePath(routePath)
  if (isExternal(resolvedPath)) {
    window.open(resolvedPath, '_blank')
  } else {
    router.push(resolvedPath)
  }
}
</script>
