<template>
    <div class="player-hand">
        <div v-for="domino in hand" @click="selectDomino(domino)">
            <Domino :selected="selectedDomino === domino" :domino="domino" />
        </div>
    </div>
</template>
<script>
import Domino from './Domino.vue';
export default {
    props: {
        hand: {
            type: Array,
            required: true
        }
    },
    components: { Domino },
    data() {
        return {
            selectedDomino: null
        }
    },
    methods: {
        selectDomino(domino) {
            if (this.selectedDomino === domino) {
                this.selectedDomino = null;
            } else {
                this.selectedDomino = domino;
            }
            this.$emit('on-selected-domino', this.selectedDomino);
        }
    }
}
</script>
<style>
.player-hand {
    display: flex;
    padding: 4px;
    gap: 10px;
    position: absolute;
    bottom: 10px;
    left: 50%;
    transform: translateX(-50%);
}
</style>