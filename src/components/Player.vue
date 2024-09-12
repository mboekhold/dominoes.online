<template>
    <div>
        <div v-if="player.id === 1">
            <div class="w-screen sm:w-[530px] sm:pt-5 pr-5 pb-5 flex"
                :class="'playerBox' + player.id">
                <div v-if="turn" class="absolute bottom-1 w-full h-1 bg-orange-400"></div>
                <div class="relative ml-4 w-12 h-12 rounded-md mr-4 bg-gray-100 text-gray-600 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                    </svg>
                </div>
                <PlayerHand :hand="player.hand" @on-selected-domino="selectedDomino" :id="'playerHand' + player.id"
                    :playerId="player.id" class="flex" />
            </div>
        </div>
        <div v-else-if="player.id === 2"
            :class="['playerBoxWrapper' + player.id, openPlayerBoxId === player.id ? 'pointer-events-auto' : 'pointer-events-none']">
            <div :class="'playerBox' + player.id" class="flex flex-col -right-[80px] sm:right-0">
                <div class="sm:hidden open-playerbox right-[75px] top-1/2 transform -translate-y-1/2 cursor-pointer w-8 h-10 flex items-center"
                    @click="togglePlayerBox(player.id)">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                        :class="{ 'rotate-180': openPlayerBoxId === player.id }" stroke="currentColor"
                        class="toggle-icon">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                    </svg>
                </div>
                <div class="w-12 h-12 bg-[#f7f5ff] rounded-md mb-6 mt-2">
                    <img :src="player.profile.image" class="w-12 h-12">
                </div>
                <div v-if="turn" class="left-[2px] absolute rounded-tl-full rounded-bl-full h-full w-1 bg-orange-400">
                </div>
                <OpponentPlayerHand class="flex-col flex" :hand="player.hand" :class="'playerHand' + player.id"
                    :playerId="player.id" />
            </div>
        </div>
        <div v-else-if="player.id === 3"
            :class="['playerBoxWrapper' + player.id, openPlayerBoxId === player.id ? 'pointer-events-auto' : 'pointer-events-none']">
            <div :class="'playerBox' + player.id" class="flex flex-row -top-[80px] sm:top-0">
                <div class="sm:hidden open-playerbox top-[75px] left-1/2 transform -translate-x-1/2 cursor-pointer w-10 h-8 flex justify-center items-center"
                    @click="togglePlayerBox(player.id)">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                        stroke="currentColor" class="toggle-icon w-6"
                        :class="{ 'rotate-180': openPlayerBoxId === player.id }">
                        <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                    </svg>
                </div>
                <div class="w-12 h-12 ml-2 mr-6 rounded-md bg-[#edddd6]">
                    <img :src="player.profile.image" class="h-12 w-12">
                </div>
                <div v-if="turn" class="absolute bottom-[2px] rounded-br-full rounded-bl-full w-full h-1 bg-orange-400">
                </div>
                <OpponentPlayerHand class="flex" :hand="player.hand" :id="'playerHand' + player.id"
                    :playerId="player.id" />
            </div>
        </div>
        <div v-else-if="player.id === 4"
            :class="['playerBoxWrapper' + player.id, openPlayerBoxId === player.id ? 'pointer-events-auto' : 'pointer-events-none']">
            <div :class="'playerBox' + player.id" class="flex flex-col -left-[80px] sm:left-0">
                <div class="sm:hidden open-playerbox left-[75px] top-1/2 transform -translate-y-1/2 cursor-pointer w-8 h-10 flex justify-center items-center"
                    @click="togglePlayerBox(player.id)">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                        class="toggle-icon" stroke="currentColor"
                        :class="{ 'rotate-180': openPlayerBoxId === player.id }">
                        <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                    </svg>
                </div>
                <div class="rounded-md mt-2 mb-6 w-12 h-12 bg-[#f7f5ff]">
                    <img :src="player.profile.image" class="w-12 h-12">
                </div>
                <div v-if="turn" class="absolute right-[1px] rounded-tr-full rounded-br-full h-full w-1 bg-orange-400">
                </div>
                <OpponentPlayerHand class="flex-col flex" :hand="player.hand" :id="'playerHand' + player.id"
                    :playerId="player.id" />
            </div>
        </div>
        <div v-if="player.id === 2" :class="'togglePlayerBox' + player.id"
            class="absolute z-10 cursor-pointer h-10 w-8 right-0 top-1/2 transform -translate-y-1/2"
            @click="openPlayerBox(player.id)">
        </div>
        <div v-else-if="player.id === 3" :class="'togglePlayerBox' + player.id"
            class="absolute z-10 cursor-pointer h-8 w-10 top-0 left-1/2 transform -translate-x-1/2"
            @click="openPlayerBox(player.id)">
        </div>
        <div v-else-if="player.id === 4" :class="'togglePlayerBox' + player.id"
            class="absolute z-10 cursor-pointer h-10 w-8 left-0 top-1/2 transform -translate-y-1/2"
            @click="openPlayerBox(player.id)">
        </div>
    </div>
</template>

<script>
import "/node_modules/flag-icons/css/flag-icons.min.css";
import PlayerHand from './PlayerHand.vue';
import OpponentPlayerHand from './OpponentPlayerHand.vue';
export default {
    components: {
        PlayerHand,
        OpponentPlayerHand
    },
    props: {
        player: {
            type: Object,
            required: true
        },
        turn: {
            type: Boolean,
            required: true
        }
    },
    data() {
        return {
            intervalId: null,
            openPlayerBoxId: null,
            didIntro: false,
            driverObj: null
        }
    },
    methods: {
        selectedDomino(domino) {
            this.$emit('on-selected-domino', domino);
        },
        togglePlayerBox(id) {
            if (this.openPlayerBoxId === id) {
                this.openPlayerBoxId = null;
                this.closePlayerBox(id);
            } else {
                this.openPlayerBoxId = id;
                this.openPlayerBox(id);
            }
        },
        openPlayerBox(id) {
            let playerBox = document.getElementsByClassName('playerBox' + id)[0];
            playerBox.classList.add('player' + id + 'Turn');
            this.openPlayerBoxId = id;
        },
        closePlayerBox(id) {
            let playerBox = document.getElementsByClassName('playerBox' + id)[0];
            playerBox.classList.remove('player' + id + 'Turn');
            this.openPlayerBoxId = null;
        },
    },
    mounted() {
        // Do it once when mounted because watch does not trigger on initial value
        if (this.turn) {
            this.openPlayerBox(this.player.id);
            setTimeout(() => {
                this.closePlayerBox(this.player.id);
            }, 3000);
        }
    },
    watch: {
        turn() {
            if (this.turn) {
                if (this.openPlayerBoxId !== this.playerId) {
                    this.openPlayerBox(this.player.id);
                    setTimeout(() => {
                        this.closePlayerBox(this.player.id);
                    }, 3000);
                }
            }
        }
    }
}
</script>

<style scoped>
.playerBox1 {
    @apply rounded-tl-xl rounded-tr-xl h-24;
    @apply bg-custom-dark-3;
    position: absolute;
    bottom: 20px;
    /* padding-bottom: 50px; */
    left: 50%;
    transform: translateX(-50%);
    align-items: center;
    /* justify-content: center; */
}

#playerHand1 {
    @apply mb-10;
}

.playerBoxWrapper2 {
    @apply h-24;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: 60px;
    width: 110px;
    height: 220px;
}

.playerBox2 {
    @apply rounded-xl h-full;
    width: 80px;
    margin-left: auto;
    position: relative;
    align-items: center;
    @apply bg-custom-dark-3;
    transition: 1s;
}

.player2Turn {
    transition: 1s;
    right: 0px;
}

#playerHand2 {
    @apply flex flex-col items-center;
    bottom: 10px;
}

.playerBoxWrapper3 {
    @apply h-24;
    position: absolute;
    left: 50%;
    top: 0px;
    transform: translateX(-50%);
    height: 110px;
    width: 230px;
}

.playerBox3 {
    @apply rounded-b-xl h-full;
    position: relative;
    height: 80px;
    align-items: center;
    @apply bg-custom-dark-3;
    transition: 1s;
}

.player3Turn {
    transition: 1s;
    top: 0px;
}

#playerHand3 {
    /* @apply flex items-center flex-row; */
    right: 10px;
}

.playerBoxWrapper4 {
    @apply h-24;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    left: 60px;
    width: 110px;
    height: 220px;
}

.playerBox4 {
    @apply rounded-xl h-full;
    width: 80px;
    position: relative;
    align-items: center;
    @apply bg-custom-dark-3;
    transition: 1s;
}

.player4Turn {
    transition: 1s;
    left: 0px;
}

#playerHand4 {
    /* @apply flex items-center flex-col; */
    right: 10px;
}

.notificationPlayer2::after {
    content: '▶';
    font-size: 25px;
    /* Unicode arrow character */
    position: absolute;
    color: white;
    right: -10px;
    text-shadow:
        -1px -1px 0 black,
        1px -1px 0 black,
}

.notification::after {
    content: '▼';
    font-size: 25px;
    /* Unicode arrow character */
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    bottom: -25px;
    color: white;
    text-shadow:
        -1px 1px 0 black,
        1px 1px 0 black;
}

.notificationPlayer3::after {
    content: '▲';
    font-size: 25px;
    /* Unicode arrow character */
    position: absolute;
    top: -25px;
    color: white;
    text-shadow:
        -1px -1px 0 black,
        1px -1px 0 black,
}

.notificationPlayer4::after {
    content: '◀';
    font-size: 25px;
    /* Unicode arrow character */
    position: absolute;
    left: -10px;
    color: white;
    text-shadow:
        -1px -1px 0 black,
        1px -1px 0 black,
}

.progress-bar-container {
    position: relative;
    width: 500px;
}

.progress-bar {
    @apply border-t-2 border-orange-400 h-2;
    /* Adjust height as needed */
    position: absolute;
    /* Position within parent container */
    top: 0;
    /* Align to top */
    left: 0;
    /* Start from left */
    /* Smooth filling animation */
    width: 100%;
    /* Initial width: 0% */
}

.open-playerbox {
    @apply p-1 text-white absolute rounded-lg;
    background-color: #282f3d;
}

.toggle-icon {
    transition: 0.5s;
}
</style>
