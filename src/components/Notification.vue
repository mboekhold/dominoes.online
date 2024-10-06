<template>
    <div class="absolute top-8 right-8 w-72">
        <!-- Use transition-group for list animations -->
        <TransitionGroup name="list" tag="div" class="space-y-2">
            <div v-for="notification in notifications" :key="notification"
                class="flex items-center w-full max-w-xs p-4 text-gray-200 bg-night-dark-3 border-gray-700 border rounded-lg shadow"
                role="alert">

                <div class="inline-flex items-center justify-center flex-shrink-0">
                    <img class="rounded-md w-8 h-8" :src="getUserAvatar(notification.player.profile)">
                </div>

                <div class="ms-3 text-sm font-normal">{{ notification.message }}</div> <!-- Dynamic message -->

                <button type="button"
                    class="ms-auto -mx-1.5 -my-1.5 bg-night-dark-3 text-gray-400 hover:bg-gray-700 rounded-lg p-1.5 inline-flex items-center justify-center h-8 w-8"
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
import { getUserAvatar } from '../utils';
export default {
    props: {
        notifications: {
            type: Array,
            required: true
        }
    },
    methods: {
        getUserAvatar,
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