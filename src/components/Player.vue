<template>
    <div>
        <div v-if="player.notification"
            class="absolute bg-white rounded-md h-10 w-48 -top-24 notification text-center flex items-center justify-center">
            <div>
                {{ player.notification }}
            </div>
        </div>
        <div v-if="player.id === 1" class="w-screen sm:w-[600px] p-2 items-center sm:p-5 flex justify-center"
            :class="'playerBox' + player.id">
            <div v-if="turn" class="absolute bottom-1 rounded-full w-full h-1 bg-orange-400"></div>
            <PlayerHand :hand="player.hand" @on-selected-domino="selectedDomino" :id="'playerHand' + player.id"
                :playerId="player.id" />

        </div>
        <div :class="'playerBox' + player.id" v-else-if="player.id === 2" class="hidden sm:flex">
            <div v-if="player.notification"
                class="absolute bg-white rounded-md h-10 w-48 right-8 notification text-center flex items-center justify-center -rotate-90">
                <div>
                    {{ player.notification }}
                </div>
            </div>
            <div v-if="turn" class="absolute top-2 rounded-full h-3 w-3 bg-orange-400">

            </div>
            <div class="absolute bottom-1 text-white">
                {{ player.hand.length }}
            </div>
            <OpponentPlayerHand :hand="player.hand" :class="'playerHand' + player.id" :playerId="player.id" />
        </div>
        <div :class="'playerBox' + player.id" v-else-if="player.id === 3" class="hidden sm:flex">
            <div v-if="player.notification"
                class="absolute bg-white rounded-md h-10 w-48 top-24 notification-reverse text-center flex items-center justify-center">
                <div>
                    {{ player.notification }}
                </div>
            </div>
            <div v-if="turn" class="absolute left-2 rounded-full h-3 w-3 bg-orange-400">

            </div>
            <div class="absolute right-5 text-white">
                {{ player.hand.length }}
            </div>
            <OpponentPlayerHand :hand="player.hand" :id="'playerHand' + player.id" :playerId="player.id" />
        </div>
        <div :class="'playerBox' + player.id" v-else-if="player.id === 4" class="hidden sm:flex">
            <div v-if="player.notification"
                class="absolute bg-white rounded-md h-10 w-48 left-8 notification text-center flex items-center justify-center rotate-90">
                <div>
                    {{ player.notification }}
                </div>
            </div>
            <div v-if="turn" class="absolute top-2 rounded-full h-3 w-3 bg-orange-400">

            </div>
            <div class="absolute bottom-1 text-white">
                {{ player.hand.length }}
            </div>
            <OpponentPlayerHand :hand="player.hand" :id="'playerHand' + player.id" :playerId="player.id" />
        </div>

    </div>
</template>
<script>
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
            intervalId: null
        }
    },
    methods: {
        selectedDomino(domino) {
            this.$emit('on-selected-domino', domino);
        },
    }
}
</script>
<style scoped>
.playerBox1 {
    @apply rounded-tl-xl rounded-tr-xl h-24;
    background-color: #282f3d;
    position: absolute;
    bottom: 0px;
    padding-bottom: 50px;
    left: 50%;
    transform: translateX(-50%);
    align-items: center;
    justify-content: center;
}

#playerHand1 {
    /* position: absolute;
    bottom: 20px; */

}

.playerBox2 {
    @apply rounded-bl-xl rounded-tl-xl h-24;
    position: absolute;
    right: 0px;
    top: 50%;
    transform: translateY(-50%);
    height: 220px;
    width: 80px;
    align-items: center;
    justify-content: center;
    background-color: #282f3d;
}

#playerHand2 {
    @apply flex flex-col items-center;
    bottom: 10px;
}

.playerBox3 {
    @apply rounded-bl-xl rounded-br-xl h-24;
    position: absolute;
    top: 0px;
    left: 50%;
    transform: translateX(-50%);
    height: 80px;
    width: 220px;
    align-items: center;
    justify-content: center;
    background-color: #282f3d;
}

#playerHand3 {
    @apply flex items-center flex-row;
    right: 10px;
}

.playerBox4 {
    @apply rounded-tr-xl rounded-br-xl h-24;
    position: absolute;
    top: 50%;
    left: 0px;
    transform: translateY(-50%);
    height: 220px;
    width: 80px;
    align-items: center;
    justify-content: center;
    background-color: #282f3d;
}

#playerHand4 {
    @apply flex items-center flex-col;
    right: 10px;
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
}

.notification-reverse::after {
    content: '▲';
    font-size: 25px;
    /* Unicode arrow character */
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top: -25px;
    color: white;
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
</style>