<template>
    <div class="h-full">
        <div class="flex flex-col h-full">
            <div class="flex-1">
                <div class="flex items-center p-4">
                    <div @click="goBack()"
                        class="border-gray-600 border p-2 rounded-md w-fit cursor-pointer text-gray-200 hover:border-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                            stroke="currentColor" class="w-5 h-5">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
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
                                {{ roomLink }}
                            </div>
                            <div v-if="!copied">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                    stroke-width="1.5" stroke="currentColor" class="w-5 ml-auto text-gray-200">
                                    <path stroke-linecap="round" stroke-linejoin="round"
                                        d="M16.5 8.25V6a2.25 2.25 0 0 0-2.25-2.25H6A2.25 2.25 0 0 0 3.75 6v8.25A2.25 2.25 0 0 0 6 16.5h2.25m8.25-8.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-7.5A2.25 2.25 0 0 1 8.25 18v-1.5m8.25-8.25h-6a2.25 2.25 0 0 0-2.25 2.25v6" />
                                </svg>

                            </div>
                            <div v-else>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                    stroke-width="1.5" stroke="currentColor" class="w-4 ml-auto text-gray-200">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                                </svg>
                            </div>
                        </div>
                        <div>
                            <div class="mt-4 text-sm text-gray-400 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                    stroke-width="1.5" stroke="currentColor" class="w-4">
                                    <path stroke-linecap="round" stroke-linejoin="round"
                                        d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                                </svg>
                                <div class="ml-1">
                                    <div v-if="user_profile.username == players[0]?.user_profile.username">
                                        Need {{ 4 - players.length }} more players to start
                                    </div>
                                    <div v-else>
                                        Waiting for host to start the game
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="mt-4">
                            <div class="font-bold text-sm">
                                Room
                            </div>
                            <div v-for="(player, index) in players" class="mt-2 flex items-center">
                                <img class="w-8 rounded-md" :src="getUserAvatar(player.user_profile)">
                                <div class="ml-2">
                                    {{ player.user_profile.username }}
                                </div>
                                <div class="flex items-center ml-2 text-xs text-gray-400">
                                    <div v-if="index == 0">
                                        (host)
                                    </div>
                                    <div class="ml-1" v-if="user_profile.username == player.user_profile.username">
                                        (me)
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="players[0]?.user_profile.username == user_profile.username" class="px-5 mt-5" @click="startGame()">
                <button :class="{ 'disabled': players.length < 4  || gameLoading }"
                    class="flex items-center justify-center text-center bg-blue-600 hover:bg-blue-500 hover:border-gray-400 text-gray-200 p-4 rounded-lg h-16 w-full text-xl font-bold">
                    <svg v-if="gameLoading" class="animate-spin h-5 w-5 text-white mr-2" xmlns="http://www.w3.org/2000/svg"
                        fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4">
                        </circle>
                        <path class="opacity-75" fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                        </path>
                    </svg>
                    <div>
                        Start Game
                    </div>
                </button>
            </div>
            <div class="p-5" @click="goBack()">
                <button
                    class="block text-center border border-gray-600 hover:bg-gray-800 hover:border-gray-400 text-gray-200 p-4 rounded-lg h-16 w-full text-xl font-bold">
                    Cancel
                </button>
            </div>
        </div>
    </div>
</template>
<script>
import { io } from 'socket.io-client'
import { getUserAvatar } from '../utils'
export default {
    props: {
        user_profile: Object
    },
    data() {
        return {
            loading: false,
            gameLoading: false,
            socket: null,
            showErrorConnecting: false,
            roomLink: null,
            copied: false,
            players: []
        }
    },
    methods: {
        getUserAvatar,
        async goBack() {
            this.$emit("go-back")
        },
        async initPresence() {
            try {
                this.loading = true
                this.socket = io(import.meta.env.VITE_WSS_URL, {
                    query: {
                        game_type: "custom",
                        room_id: this.roomId
                    }
                })
                this.socket.on('connect', async () => {
                    console.log('Connected to server')
                    this.socket.emit('join-room', {
                        roomId: this.roomId,
                        user_profile: this.user_profile
                    })
                })
                this.socket.on('disconnect', async () => {
                    console.log('Disconnected from server')
                    this.showErrorConnecting = true
                })
                this.socket.on('roomPlayersUpdated', async (players) => {
                    this.players = JSON.parse(players)
                })
                this.socket.on('start-game', async (gameId) => {
                    console.log('Start game')
                    this.$router.push({
                        name: 'custom-game',
                        params: {
                            id: gameId
                        }
                    })
                })

            } finally {
                this.loading = false
            }
        },
        generateRoomLink() {
            const array = new Uint8Array(6);
            crypto.getRandomValues(array);
            this.roomId = Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
            this.roomLink = `${import.meta.env.VITE_BASE_PATH}/play/online?roomId=${this.roomId}`
        },
        copyLink() {
            navigator.clipboard.writeText(this.roomLink)
            this.copied = true
            setTimeout(() => {
                this.copied = false
            }, 2000)
        },
        startGame() {
            this.gameLoading = true
            this.socket.emit('start-game', {
                roomId: this.roomId
            })
        }
    },
    mounted() {
        this.roomId = this.$route.query.roomId
        if (!this.roomId) {
            this.generateRoomLink()
        } else {
            this.roomLink = `${import.meta.env.VITE_BASE_PATH}/play/online?roomId=${this.roomId}`
        }
        this.initPresence()
    },
    async beforeUnmount() {
        if (this.socket) {
            this.socket.disconnect()
        }
    }
}
</script>
<style scope>
.disabled {
    pointer-events: none;
    opacity: 0.5;
    cursor: not-allowed;
}
</style>