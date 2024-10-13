<template>
        <div class="cursor-pointer p-4 text-gray-200 sticky top-0 border-b border-gray-700 z-10 bg-night-dark" @click="toggleSideBar()">
            <svg v-if="!open" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
        </div>
</template>
<script>
export default {
    data() {
        return {
            sideBarOpen: false
        }
    },
    methods: {
        toggleSideBar() {
            this.sideBarOpen = !this.sideBarOpen
        }
    }
}
</script>
<style></style>