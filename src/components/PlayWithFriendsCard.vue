<template>
    <div class="h-full">
        <div class="flex flex-col h-full">
            <div class="flex-1">
                <div class="flex items-center p-4">
                    <div @click="goBack()"
                        class="border-gray-600 border p-2 rounded-md w-fit cursor-pointer text-gray-200 hover:border-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                            stroke="currentColor" class="w-5 h-5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                        </svg>
                    </div>
                    <div class="ml-5 font-bold text-xl">
                        Play with friends
                    </div>
                </div>
                <div class="w-full h-[1px] bg-gray-700"></div>
                <div class="">
                    <div class="p-4">
                        <div class="font-bold text-sm">
                            Copy link
                        </div>
                        <div @click="copyLink()"
                            class="mt-2 relative border border-gray-500 w-full p-2 bg-night-dark rounded-md flex items-center cursor-pointer text-gray-300">
                            <div class="truncate w-[calc(100%-2rem)]">
                                {{ lobbyLink }}
                            </div>
                            <div v-if="!copied">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                                    stroke="currentColor" class="w-5 ml-auto text-gray-200">
                                    <path stroke-linecap="round" stroke-linejoin="round"
                                        d="M16.5 8.25V6a2.25 2.25 0 0 0-2.25-2.25H6A2.25 2.25 0 0 0 3.75 6v8.25A2.25 2.25 0 0 0 6 16.5h2.25m8.25-8.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-7.5A2.25 2.25 0 0 1 8.25 18v-1.5m8.25-8.25h-6a2.25 2.25 0 0 0-2.25 2.25v6" />
                                </svg>
        
                            </div>
                            <div v-else>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                                    stroke="currentColor" class="w-4 ml-auto text-gray-200">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                                </svg>
                            </div>
                        </div>
                        <div class="mt-4">
                            <div class="font-bold text-sm">
                                Lobby
                            </div>
                            <div v-for="i in 1" class="mt-2 flex items-center">
                                <img class="w-8 rounded-md"
                                    src="https://ui-avatars.com/api/?name=EX&background=8e44ad&color=fff">
                                <div class="ml-2">
                                    miguel
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="p-5" @click="goBack()">
                <button
                    class="mt-4 block text-center border border-gray-600 hover:bg-gray-800 hover:border-gray-400 text-gray-200 p-4 rounded-lg h-16 w-full text-xl font-bold">
                    Cancel
                </button>
            </div>
        </div>
    </div>
</template>
<script>
import { io } from 'socket.io-client'
export default {
    props: {
        user_profile: Object
    },
    data() {
        return {
            loading: false,
            socket: null,
            showErrorConnecting: false,
            lobbyLink: 'https://dominoes.online/play/online?lobby=1234531910',
            copied: false
        }
    },
    methods: {
        async goBack() {
            this.$emit("go-back")
        },
        async initPresence() {
            try {
                this.loading = true
                this.socket = io(import.meta.env.VITE_WSS_URL, {
                    query: {
                        user_id: this.user_profile.id,
                    }
                })
                this.socket.on('connect', async () => {
                    console.log('Connected to server')
                    this.startTimer()
                })
                this.socket.on('disconnect', async () => {
                    console.log('Disconnected from server')
                    this.showErrorConnecting = true
                })
                this.socket.on('start-game', async (gameId) => {
                    console.log('Start game')
                    this.$router.push({
                        name: 'online-game',
                        params: {
                            id: gameId
                        }
                    })
                })

            } finally {
                this.loading = false
            }
        },
        copyLink() {
            navigator.clipboard.writeText(this.lobbyLink)
            this.copied = true
            setTimeout(() => {
                this.copied = false
            }, 2000)
        }
    },
    mounted() {
        // this.initPresence()
    },
    async beforeUnmount() {
        if (this.socket) {
            this.socket.disconnect()
        }
    }
}
</script>
<style lang="">

</style>