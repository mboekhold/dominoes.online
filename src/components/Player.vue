<template>
    <div>
        <div v-if="player.id === 1" :id="'playerBox' + player.id">
            <div v-if="player.notification"
                class="absolute bg-white rounded-md h-10 w-48 -top-24 notification text-center flex items-center justify-center">
                <div>
                    {{ player.notification }}
                </div>
            </div>
            <!-- <div v-if="currentPlayerTurn === player.id - 1" class="absolute left-5 rounded-full h-3 w-3 bg-orange-400">

            </div> -->
            <div class="absolute right-10 text-white">
                {{ player.hand.length }}
            </div>
            <PlayerHand :hand="player.hand" @on-selected-domino="selectedDomino" :id="'playerHand' + player.id"
                :playerId="player.id" />
            <div v-if="player.id - 1 === currentPlayerTurn" class="flex justify-end mt-20 progress-bar-container">
                <div class="progress-bar" :ref="'progressBar' + player.id">

                </div>
            </div>
        </div>
        <div :id="'playerBox' + player.id" v-else-if="player.id === 2">
            <div v-if="player.notification"
                class="absolute bg-white rounded-md h-10 w-48 right-8 notification text-center flex items-center justify-center -rotate-90">
                <div>
                    {{ player.notification }}
                </div>
            </div>
            <div v-if="currentPlayerTurn === player.id - 1" class="absolute top-2 rounded-full h-3 w-3 bg-orange-400">

            </div>
            <div class="absolute bottom-1 text-white">
                {{ player.hand.length }}
            </div>
            <OpponentPlayerHand :hand="player.hand" :id="'playerHand' + player.id" :playerId="player.id" />
        </div>
        <div :id="'playerBox' + player.id" v-else-if="player.id === 3">
            <div v-if="player.notification"
                class="absolute bg-white rounded-md h-10 w-48 top-24 notification-reverse text-center flex items-center justify-center">
                <div>
                    {{ player.notification }}
                </div>
            </div>
            <div v-if="currentPlayerTurn === player.id - 1" class="absolute left-2 rounded-full h-3 w-3 bg-orange-400">

            </div>
            <div class="absolute right-5 text-white">
                {{ player.hand.length }}
            </div>
            <OpponentPlayerHand :hand="player.hand" :id="'playerHand' + player.id" :playerId="player.id" />
        </div>
        <div :id="'playerBox' + player.id" v-else-if="player.id === 4">
            <div v-if="player.notification"
                class="absolute bg-white rounded-md h-10 w-48 left-8 notification text-center flex items-center justify-center rotate-90">
                <div>
                    {{ player.notification }}
                </div>
            </div>
            <div v-if="currentPlayerTurn === player.id - 1" class="absolute top-2 rounded-full h-3 w-3 bg-orange-400">

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
        currentPlayerTurn: {
            type: Number,
            required: false
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
    },
    watch: {
        currentPlayerTurn(newValue) {
            console.log(newValue)
            if (newValue === 0) {
                var width = 100;
                this.intervalId = setInterval(() => {
                    if (width <= 0) {
                        clearInterval(this.intervalId);
                    } else {
                        width -= 0.1;
                        this.$refs.progressBar1.style.width = width + '%';
                    }
                }, 10);
            }
        }
    }
}
</script>
<style scoped>
#playerBox1 {
    @apply rounded-tl-xl rounded-tr-xl h-24;
    background-color: #282f3d;
    position: absolute;
    bottom: 0px;
    padding-bottom: 50px;
    padding: 20px;
    left: 50%;
    transform: translateX(-50%);
    width: 600px;
    display: flex;
    align-items: center;
    justify-content: center;
}

#playerHand1 {
    position: absolute;
    bottom: 20px;

}

#playerBox2 {
    @apply rounded-xl h-24;
    position: absolute;
    padding: 20px;
    right: 20px;
    top: 50%;
    transform: translateY(-50%);
    height: 220px;
    width: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #282f3d;
}

#playerHand2 {
    @apply flex flex-col items-center;
    bottom: 10px;
}

#playerBox3 {
    @apply rounded-xl h-24;
    position: absolute;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    height: 80px;
    width: 220px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #282f3d;
}

#playerHand3 {
    @apply flex items-center flex-row;
    right: 10px;
}

#playerBox4 {
    @apply rounded-xl h-24;
    position: absolute;
    top: 50%;
    left: 20px;
    transform: translateY(-50%);
    height: 220px;
    width: 80px;
    display: flex;
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