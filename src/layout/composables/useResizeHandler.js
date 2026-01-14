import { onBeforeMount, onMounted, onBeforeUnmount, watch, computed } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'

const { body } = document
const WIDTH = 992

export function useResizeHandler() {
    const store = useStore()
    const route = useRoute()

    const sidebar = computed(() => store.state.app.sidebar)
    const device = computed(() => store.state.app.device)

    function isMobile() {
        const rect = body.getBoundingClientRect()
        return rect.width - 1 < WIDTH
    }

    function resizeHandler() {
        if (!document.hidden) {
            const mobile = isMobile()
            store.dispatch('app/toggleDevice', mobile ? 'mobile' : 'desktop')

            if (mobile) {
                store.dispatch('app/closeSideBar', { withoutAnimation: true })
            }
        }
    }

    watch(route, () => {
        if (device.value === 'mobile' && sidebar.value.opened) {
            store.dispatch('app/closeSideBar', { withoutAnimation: false })
        }
    })

    onBeforeMount(() => {
        window.addEventListener('resize', resizeHandler)
    })

    onBeforeUnmount(() => {
        window.removeEventListener('resize', resizeHandler)
    })

    onMounted(() => {
        const mobile = isMobile()
        if (mobile) {
            store.dispatch('app/toggleDevice', 'mobile')
            store.dispatch('app/closeSideBar', { withoutAnimation: true })
        }
    })
}
