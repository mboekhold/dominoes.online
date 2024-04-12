<template>
    <div>
        <div v-if="playerId === 1" :id="'playerBox' + playerId" class="relative">
            <div class="absolute right-10 text-white">
                {{ hand.length }}
            </div>
            <PlayerHand :hand="hand" @on-selected-domino="selectedDomino" :id="'playerHand' + playerId" :playerId="playerId" />
        </div>
        <div :id="'playerBox' + playerId" v-else-if="playerId === 2" class="relative">
            <div class="absolute bottom-1 text-white">
                {{ hand.length }}
            </div>
            <OpponentPlayerHand :hand="hand" :id="'playerHand' + playerId" :playerId="playerId" />
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
        hand: {
            type: Array,
            required: true
        },
        playerId: {
            type: Number,
            required: true
        }
    },
    data() {
        return {
        }
    },
    methods: {
        selectedDomino(domino) {
            this.$emit('on-selected-domino', domino);
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
    padding-bottom: 50px;
    padding: 20px;
    right: 20px;
    top: 50%;
    transform: translateY(-50%);
    height: 220px;
    width: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color:  #282f3d;
}
#playerHand2 {
    position: absolute;
    right: 10px;
}
</style>