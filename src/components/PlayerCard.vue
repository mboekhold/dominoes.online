<template>
    <div>
        <div v-if="loading">

        </div>
        <div v-else>
            <div v-if="user" class="p-5">
                    <div class="flex items-center justify-center">
                        <img :src="getUserAvatar(user_profile)" class="w-16 h-16 rounded-md border border-gray-600">
                    </div>
                    <div class="mt-5">
                        <div class="text-gray-200 font-bold flex items-center justify-center">
                            <div>
                                {{ user_profile.username }}
                            </div>
                            <img v-if="user_profile.countries" :src="user_profile.countries.flag_url" class="ml-2 w-6 rounded-sm">
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
import { getUserAvatar } from '../utils'
export default {
    props: {
        loading: Boolean,
        user: Object,
        user_profile: Object
    },
    methods: {
        getUserAvatar,
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
