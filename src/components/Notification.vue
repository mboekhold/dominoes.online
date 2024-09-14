<template>
    <div class="absolute top-8 right-8 w-72">
        <!-- Use transition-group for list animations -->
        <TransitionGroup name="list" tag="div" class="space-y-2">
            <div v-for="notification in notifications" :key="notification"
                class="flex items-center w-full max-w-xs p-4 text-gray-200 bg-custom-dark-3 border-gray-700 border rounded-lg shadow"
                role="alert">

                <div class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8">
                    <div v-if="notification.player.profile.image">
                        <img class="rounded-sm" :src="notification.player.profile.image">
                    </div>
                    <div v-else>
                        <div
                            class="relative ml-4 w-10 h-10 rounded-md mr-4 bg-gray-100 text-gray-600 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                                stroke="currentColor" class="w-6 h-6">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                    d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div class="ms-3 text-sm font-normal">{{ notification.message }}</div> <!-- Dynamic message -->

                <button type="button"
                    class="ms-auto -mx-1.5 -my-1.5 bg-custom-dark-3 text-gray-400 hover:bg-gray-700 rounded-lg p-1.5 inline-flex items-center justify-center h-8 w-8"
                    aria-label="Close" @click="removeNotification(notification.id)">
                    <span class="sr-only">Close</span>
                    <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                        viewBox="0 0 14 14">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                    </svg>
                </button>
            </div>
        </TransitionGroup>
    </div>
</template>

<script>
export default {
    props: {
        notifications: {
            type: Array,
            required: true
        }
    },
    methods: {
        removeNotification(id) {
            const index = this.notifications.findIndex(notification => notification.id === id);
            this.notifications.splice(index, 1);
        }
    },
    watch: {
        notifications: {
            handler: function (notifications) {
                if (notifications.length > 0) {
                    setTimeout(() => {
                        this.notifications.shift();
                    }, 3000);
                }
            },
            deep: true
        }
    }
}
</script>

<style scoped>
/* Add transition classes */
.list-enter-active,
.list-leave-active {
    transition: transform 0.5s ease-out;
}

.list-enter-from,
.list-leave-to {
    transform: translateX(100%);
}
</style>