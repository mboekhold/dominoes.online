<template>
    <div class="player-hand overflow-auto pt-2">
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
        },
        playerId: {
            type: Number,
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
<style scoped>
.player-hand {
    /* display: flex; */
    /* padding: 4px; */
    gap: 5px;
}
#player2 {
    flex-direction: column;
    gap: 0px;
}
</style>