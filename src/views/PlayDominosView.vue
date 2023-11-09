<template>
    <div>
        <Board :playedDominos="playedDominos" :playableDomino="playableDomino" @on-play-domino="playDomino" />
        <Player :hand="playerHand" @on-selected-domino="onSelectedDomino" />
    </div>
</template>
<script>
import Board from '@/components/Board.vue'
import Player from '@/components/Player.vue'
export default {
    components: {
        Board,
        Player
    },
    data() {
        return {
            dominoSet: [
                { top: 0, bottom: 0 }, { top: 0, bottom: 1 }, { top: 0, bottom: 2 }, { top: 0, bottom: 3 },
                { top: 0, bottom: 4 }, { top: 0, bottom: 5 }, { top: 0, bottom: 6 }, { top: 1, bottom: 1 },
                { top: 1, bottom: 2 }, { top: 1, bottom: 3 }, { top: 1, bottom: 4 }, { top: 1, bottom: 5 },
                { top: 1, bottom: 6 }, { top: 2, bottom: 2 }, { top: 2, bottom: 3 }, { top: 2, bottom: 4 },
                { top: 2, bottom: 5 }, { top: 2, bottom: 6 }, { top: 3, bottom: 3 }, { top: 3, bottom: 4 },
                { top: 3, bottom: 5 }, { top: 3, bottom: 6 }, { top: 4, bottom: 4 }, { top: 4, bottom: 5 },
                { top: 4, bottom: 6 }, { top: 5, bottom: 5 }, { top: 5, bottom: 6 }, { top: 6, bottom: 6 }
            ],
            playedDominos: [],
            playerHand: [],
            selectedDomino: null,
            playableDomino: null
        }
    },
    methods: {
        shuffleDominos() {
            for (let i = this.dominoSet.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [this.dominoSet[i], this.dominoSet[j]] = [this.dominoSet[j], this.dominoSet[i]];
            }
        },
        dealHand() {
            for (let i = 0; i < 7; i++) {
                this.playerHand.push(this.dominoSet.pop());
            }
        },
        onSelectedDomino(domino) {
            // Reset if they selected a playable domino but now they unselected it
            if(this.playableDomino && !domino) {
                this.playableDomino = null;
            }
            if(domino) {
                let canPlayDomino = this.checkIfCanPlayDomino(domino);
                if (canPlayDomino) {
                    //Show on board where it can be placed
                    this.playableDomino = domino;
                }
            }
            this.selectedDomino = domino;
        },
        checkIfCanPlayDomino(domino) {
            if(this.playedDominos.length == 0) {
                return true;
            } else if (this.playedDominos.length == 1) {
                let lastPlayedDomino = this.playedDominos[this.playedDominos.length - 1];
                if (lastPlayedDomino.top == domino.top || lastPlayedDomino.top == domino.bottom || lastPlayedDomino.bottom == domino.top || lastPlayedDomino.bottom == domino.bottom) {
                    return true;
                } else {
                    return false;
                }
            } else if (this.playedDominos.length > 1) {
                let lastPlayedDomino = this.playedDominos[this.playedDominos.length - 1];
                let secondLastPlayedDomino = this.playedDominos[this.playedDominos.length - 2];
                if (lastPlayedDomino.top == domino.top || lastPlayedDomino.top == domino.bottom || lastPlayedDomino.bottom == domino.top || lastPlayedDomino.bottom == domino.bottom) {
                    return true;
                } else if (secondLastPlayedDomino.top == domino.top || secondLastPlayedDomino.top == domino.bottom || secondLastPlayedDomino.bottom == domino.top || secondLastPlayedDomino.bottom == domino.bottom) {
                    return true;
                } else {
                    return false;
                }
            }
        },
        playDomino(domino) {
            this.playedDominos.push(domino);
            this.playerHand = this.playerHand.filter(d => d !== domino);
            this.selectedDomino = null;
            this.playableDomino = null;
        }
    },
    mounted() {
        this.shuffleDominos();
        this.dealHand();
    }
}
</script>
<style></style>
