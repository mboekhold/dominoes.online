<template>
    <div>
        <div class="flex items-center p-4">
            <div @click="goBack()"
                class="border-gray-600 border p-2 rounded-md w-fit cursor-pointer text-gray-200 hover:border-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                    stroke="currentColor" class="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                </svg>
            </div>
            <div class="ml-5 font-bold text-xl">
                Finding a match
            </div>
        </div>
        <div class="w-full h-[1px] bg-gray-700"></div>
        <div class="text-center mt-10 text-xl flex items-center justify-center">
            <div v-if="showErrorConnecting" class="w-fit text-xs flex items-center text-yellow-400">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                    stroke="currentColor" class="w-8 h-8">
                    <path stroke-linecap="round" stroke-linejoin="round"
                        d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                </svg>
                <div class="ml-2">
                    Cannot find match right now, please try again later
                </div>
            </div>
            <div v-else>
                {{ time_elapsed }}
            </div>
        </div>
        <div class="mt-5 max-w-[375px] mx-auto">
            <img src="@/assets/world_map.png" alt="Finding match" class="mx-auto">
        </div>
        <div class="p-5" @click="goBack()">
            <button
                class="mt-4 block text-center border border-gray-600 hover:bg-gray-800 hover:border-gray-400 text-gray-200 p-4 rounded-lg h-16 w-full text-xl font-bold">
                Cancel
            </button>
        </div>
    </div>
</template>
<script>
import { supabase } from '../supabase';
export default {
    props: {
        user_profile: Object
    },
    data() {
        return {
            loading: false,
            time_elapsed: '00:00',
            showErrorConnecting: false,
            room: null,
        }
    },
    methods: {
        async goBack() {
            this.$emit("go-back")
        },
        startTimer() {
            let time = 0
            setInterval(() => {
                time += 1
                // Make in format $:mm:ss
                let minutes = Math.floor((time % 3600) / 60)
                let seconds = time % 60
                this.time_elapsed = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
            }, 1000)
        },
        async getNextRoomId() {
            const { data, error } = await supabase
                .from('rooms')
                .select('*')
                .lt('player_count', 4)
                
            if (error) {
                this.showErrorConnecting = true
            }
            else if (data.length > 0) {
                return data[0].id
            }
            return null
        },
        async initPresence() {
            this.loading = true
            const nextRoomId = await this.getNextRoomId()
            const channel = nextRoomId ? `room_${nextRoomId}` : 'room_01'
            this.room = supabase.channel(channel)
            this.room
                .on('presence', { event: 'sync' }, () => {
                    const newState = this.room.presenceState()
                    this.checkandCreateGame(newState)
                })
                .on('presence', { event: 'join' }, ({ key, newPresences }) => {
                    console.log('join', key, newPresences)
                })
                .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
                    console.log('leave')
                    console.log('leave', key, leftPresences)
                })
                .subscribe()
            
            const joinedRoom = {
                user_id: this.user_profile.id,
            }
            const presentTrackStatus = await this.room.track(joinedRoom)
            if (presentTrackStatus.error) {
                this.showErrorConnecting = true
            } else {
                this.startTimer()
            }
            this.loading = false
        },
        async untrackPresence() {
            const presenceUntrackStatus = await this.room.untrack()
            console.log(presenceUntrackStatus)
        },
        async checkandCreateGame(presenceState) {
            const userCount = Object.keys(presenceState).length
            if (userCount === 4) {
                await this.createGame(presenceState)
            }
        },
        async createGame(presenceState) {
            let { data, error } = await supabase
            .from('games')

        },
        beforeUnloadHandler(event) {
            event.preventDefault()
            event.returnValue = ''
        }
    },
    mounted() {
        this.initPresence()
    },
    async beforeUnmount() {
        await this.untrackPresence()
    }
}
</script>
<style lang="">

</style>