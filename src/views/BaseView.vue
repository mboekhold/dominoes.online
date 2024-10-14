<template>
    <div>
        <MobileNavigation v-if="isMobile" ref="mobileNavigation" />
        <SideNavigation v-else :expand="setSidebarOpen"  @mouseover="setSidebarOpen = true" @mouseleave="setSidebarOpen = false" />
        <div class="flex flex-col">
            <router-view />
        </div>
    </div>
</template>
<script>
import SideNavigation from '@/components/SideNavigation.vue'
import MobileNavigation from '../components/MobileNavigation.vue';
export default {
    components: {
        SideNavigation,
        MobileNavigation
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
            if (window.innerWidth < 1024) {
                this.isMobile = true
            } else {
                this.isMobile = false
            }
        },
        onToggleSideBar() {
            this.setSidebarOpen = !this.setSidebarOpen
        }
    },
    mounted() {
        this.isMobile = window.innerWidth < 1024
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