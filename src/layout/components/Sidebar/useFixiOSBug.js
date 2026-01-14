import { onMounted, computed } from 'vue'
import { useStore } from 'vuex'

export function useFixiOSBug(subMenuRef) {
    const store = useStore()
    const device = computed(() => store.state.app.device)

    onMounted(() => {
        if (subMenuRef.value) {
            const handleMouseleave = subMenuRef.value.handleMouseleave
            subMenuRef.value.handleMouseleave = (e) => {
                if (device.value === 'mobile') {
                    return
                }
                handleMouseleave(e)
            }
        }
    })
}
