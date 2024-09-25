<template>
    <div>
        <div v-if="isLoading">

        </div>
        <div v-else>
            <div v-if="isAuthenticated" class="p-5">
                    <div class="flex items-center justify-center">
                        <img :src="user.picture" class="w-12 h-12 rounded-md">
                    </div>
                    <div class="mt-5 text-center">
                        <div class="text-gray-200 font-bold">
                            {{ user.name }}
                        </div>
                    </div>
                    <div class="text-gray-400 mt-5 flex justify-center">
                        <div>
                            0 games played
                        </div>
                        <div class="ml-5">
                            0 games won
                        </div>
                    </div>
                    <div class="mt-7">
                        <button @click="findMatch()"
                            class="block text-center border border-gray-600 hover:bg-gray-800 hover:border-gray-400 text-gray-200 p-4 rounded-lg h-16 w-full text-xl font-bold">
                            Find a match
                        </button>
                        <button
                            class="mt-5 block text-center border border-gray-600 hover:bg-gray-800 hover:border-gray-400 text-gray-200 p-4 rounded-lg h-16 w-full text-xl font-bold">
                            Play with friends
                        </button>
                    </div>
                </div>
                    
            </div>
        </div>
</template>

<script>
export default {
    data() {
        return {
            user: this.$auth0.user,
            isAuthenticated: this.$auth0.isAuthenticated,
            isLoading: this.$auth0.isLoading,
        }
    },
    methods: {
        findMatch() {
            this.$emit('find-match')
        },
        backToMainMenu() {
            this.showMainMenu = true;
            this.showFindingMatch = false;
        }
    }
}
</script>
