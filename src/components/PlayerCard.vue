<template>
    <div class="h-full">
        <div v-if="loading">

        </div>
        <div v-else class="h-full">
            <div v-if="user" class="p-5 h-full flex flex-col">
                    <div class="flex items-center justify-center">
                        <img :src="getUserAvatar(user_profile)" class="w-16 h-16 rounded-md border border-gray-600">
                    </div>
                    <div class="mt-5">
                        <div class="text-gray-200 font-bold flex items-center justify-center">
                            <div>
                                {{ user_profile.username }}
                            </div>
                        </div>
                    </div>
                    <div class="mt-2 w-fit mx-auto flex items-center justify-center ">
                        <img v-if="user_profile.countries" :src="user_profile.countries.flag_url" class="ml-2 w-6 rounded-sm">
                        <div class="ml-2">
                            {{ user_profile.countries ? user_profile.countries.name : '' }}
                        </div>
                    </div>
                    <div v-if="authenticated" class="text-gray-400 mt-10 w-fit mx-auto">
                        <div>
                            {{ getWinRate() }}% win rate
                        </div>
                        <div>
                            {{ user_profile.wins }}W {{ user_profile.games_played - user_profile.wins  }}L
                        </div>
                    </div>
                    <div class="mt-5 sm:mt-auto">
                        <button @click="findMatch()"
                            class="block text-center border border-gray-600 hover:bg-gray-800 hover:border-gray-400 text-gray-200 p-4 rounded-lg h-16 w-full text-xl font-bold">
                            Play Ranked
                        </button>
                        <button @click="playWithFriends()"
                            class="mt-5 block text-center border border-gray-600 hover:bg-gray-800 hover:border-gray-400 text-gray-200 p-4 rounded-lg h-16 w-full text-xl font-bold">
                            Play with friends
                        </button>
                    </div>
                </div>
                    
            </div>
        </div>
</template>

<script>
import { getUserAvatar, isUserAuthenticated } from '../utils'
export default {
    props: {
        loading: Boolean,
        user: Object,
        user_profile: Object
    },
    data() {
        return {
            authenticated: false
        }
    },
    methods: {
        getUserAvatar,
        isUserAuthenticated,
        findMatch() {
            this.$emit('find-match')
        },
        backToMainMenu() {
            this.showMainMenu = true;
            this.showFindingMatch = false;
        },
        getWinRate() {
            if (this.user_profile.games_played === 0) {
                return 0
            }
            return ((this.user_profile.wins / this.user_profile.games_played) * 100).toFixed(1)
        },
        playWithFriends() {
            this.$emit('play-with-friends')
        }
    },
    async mounted() {
        this.authenticated = await isUserAuthenticated()
    }
}
</script>
