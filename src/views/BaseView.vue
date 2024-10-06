<template>
    <div>
        <SideNavigation />
        <div class="flex flex-col">
            <router-view />
        </div>
    </div>
</template>
<script>
import SideNavigation from '@/components/SideNavigation.vue'
export default {
    components: {
        SideNavigation,
    },
    data() {
        return {
            isMobile: false,
            sidebarOpen: false,
            setSidebarOpen: false,
        }
    },
    methods: {
        handleResize() {
            if (window.innerWidth < 768) {
                this.isMobile = true
            }
        },
    },
    created() {
        window.addEventListener("resize", this.handleResize);
    },
    destroyed() {
        window.removeEventListener("resize", this.handleResize);
    },
}
</script>
<style></style>