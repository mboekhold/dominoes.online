<template>
    <div>
        <div v-if="player.id === 1">
            <div class="w-screen sm:w-[600px] p-2 items-center sm:p-5 flex justify-center"
                :class="'playerBox' + player.id">
                <div v-if="player.notification"
                    class="absolute border border-black bg-white rounded-md h-10 w-48 -top-20 notification text-center flex items-center justify-center">
                    <div>
                        {{ player.notification }}
                    </div>
                </div>
                <div v-if="turn" class="absolute bottom-1 w-full h-1 bg-orange-400"></div>
                <PlayerHand :hand="player.hand" @on-selected-domino="selectedDomino" :id="'playerHand' + player.id"
                    :playerId="player.id" class="flex" />
            </div>
        </div>
        <div :class="'playerBox' + player.id" v-else-if="player.id === 2" class="flex flex-col">
            <img src="@/assets/ag.svg" class="rounded-md w-12 mt-2 mb-2 sm:mb-6">
            <div v-if="player.notification"
                class="absolute border border-black bg-white rounded-md h-10 w-48 -right-4 sm:right-8 notification text-center flex items-center justify-center -rotate-90">
                <div>
                    {{ player.notification }}
                </div>
            </div>
            <div v-if="turn" class="left-[2px] absolute rounded-tl-full rounded-bl-full h-full w-1 bg-orange-400">

            </div>

            <div>
            </div>
            <div class="bottom-1 block sm:hidden text-white">
                {{ player.hand.length }}
            </div>
            <OpponentPlayerHand class="hidden flex-col sm:flex" :hand="player.hand" :class="'playerHand' + player.id"
                :playerId="player.id" />
        </div>
        <div :class="'playerBox' + player.id" v-else-if="player.id === 3" class="flex">
            <img src="@/assets/aw.svg" class="rounded-md ml-2 mr-2 sm:mr-6 w-12">
            <div v-if="player.notification"
                class="absolute bg-white rounded-md h-10 w-48 top-16 sm:top-24 notification-reverse text-center flex items-center justify-center">
                <div>
                    {{ player.notification }}
                </div>
            </div>
            <div v-if="turn" class="absolute bottom-[2px] rounded-br-full rounded-bl-full w-full h-1 bg-orange-400">

            </div>
            <div class="block sm:hidden right-5 text-white">
                {{ player.hand.length }}
            </div>
            <OpponentPlayerHand class="hidden sm:flex" :hand="player.hand" :id="'playerHand' + player.id"
                :playerId="player.id" />
        </div>
        <div :class="'playerBox' + player.id" v-else-if="player.id === 4" class="flex flex-col">
            <img src="@/assets/sx.svg" class="rounded-md mt-2 mb-2 sm:mb-6 w-12">
            <div v-if="player.notification"
                class="absolute border border-black bg-white rounded-md h-10 w-48 -left-4 sm:left-8 notification text-center flex items-center justify-center rotate-90">
                <div>
                    {{ player.notification }}
                </div>
            </div>
            <div v-if="turn" class="absolute right-[1px] rounded-tr-full rounded-br-full h-full w-1 bg-orange-400">

            </div>
            <div class="block sm:hidden bottom-1 text-white">
                {{ player.hand.length }}
            </div>
            <OpponentPlayerHand class="hidden flex-col sm:flex" :hand="player.hand" :id="'playerHand' + player.id"
                :playerId="player.id" />
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
    background-color: #282f3d;
}

#playerHand3 {
    /* @apply flex items-center flex-row; */
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
    background-color: #282f3d;
}

#playerHand4 {
    /* @apply flex items-center flex-col; */
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
    text-shadow:
        -1px 1px 0 black,
        1px 1px 0 black;
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

@media screen and (max-width: 640px) {

    .playerBox2 {
        @apply h-20 w-16;
    }

    .playerBox3 {
        @apply h-16 w-20;
    }

    .playerBox4 {
        @apply h-20 w-16;
    }
}
</style>