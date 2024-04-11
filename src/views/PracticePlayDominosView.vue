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
            player1Hand: [],
            player2Hand: [],
            player3Hand: [],
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
                this.player1Hand.push(this.dominoSet.pop());
                this.player2Hand.push(this.dominoSet.pop());
                this.player3Hand.push(this.dominoSet.pop());
            }
        },
        dealTestHand() {
            this.playerHand.push(this.dominoSet.find(x => x.top === 5 && x.bottom === 5))
            this.playerHand.push(this.dominoSet.find(x => x.top === 1 && x.bottom === 5))
            this.playerHand.push(this.dominoSet.find(x => x.top === 1 && x.bottom === 2))
            this.playerHand.push(this.dominoSet.find(x => x.top === 0 && x.bottom === 5))
            this.playerHand.push(this.dominoSet.find(x => x.top === 0 && x.bottom === 0))
            // this.playerHand.push(this.dominoSet.find(x => x.top === 1 && x.bottom === 2))
            // this.playerHand.push(this.dominoSet.find(x => x.top === 2 && x.bottom === 4))
            // this.playerHand.push(this.dominoSet.find(x => x.top === 3 && x.bottom ==3))
        },
        onSelectedDomino(domino) {
            // Reset if they selected a playable domino but now they unselected it
            if(this.playableDomino && !domino) {
                this.playableDomino = null;
            }
            if(domino) {
                let placement = this.checkNextPlacement(domino);
                if (placement) {
                    if (placement.canPlay) {
                        //Show on board where it can be placed
                        this.playableDomino = {
                            "domino": domino,
                            "placement": placement.placement,
                            "rotate0": placement.rotate0,
                            "rotate1": placement.rotate1
                        };
                    }
                }
            }
            this.selectedDomino = domino;
        },
        checkNextPlacement(domino) {
            if(this.playedDominos.length === 0) {
                return {
                    canPlay: true,
                    placement: [0],
                    rotate0: false,
                    rotate1: false
                }
            } else if(this.playedDominos.length === 1) {
                let head = this.playedDominos[this.playedDominos.length - 1];
                // Domino can be placed on both sides..
                if((head.top === domino.top || head.top === domino.bottom) && (head.bottom === domino.top || head.bottom === domino.bottom)) {
                    return {
                        canPlay: true,
                        placement: [0, 1],
                        rotate0: head.top === domino.top,
                        rotate1: head.top === domino.bottom
                    }
                }
                else if(head.top === domino.top) {
                    return {
                        canPlay: true,
                        placement: [0],
                        rotate0: true,
                        rotate1: false
                    }
                } else if(head.top === domino.bottom) {
                    return {
                        canPlay: true,
                        placement: [0],
                        rotate0: false,
                        rotate1: false
                    }
                } else if (head.bottom === domino.bottom) {
                    return {
                        canPlay: true,
                        placement: [1],
                        rotate0: false,
                        rotate1: true
                    }
                } else if (head.bottom === domino.top) {
                    return {
                        canPlay: true,
                        placement: [1],
                        rotate0: false,
                        rotate1: false
                    }
                }
            } else {
                let tail = this.playedDominos[0];
                let head = this.playedDominos[this.playedDominos.length - 1];
                if((tail.top === domino.top || tail.top === domino.bottom) && (head.bottom === domino.top || head.bottom === domino.bottom)) {
                    return {
                        canPlay: true,
                        placement: [0, 1],
                        rotate0: tail.top === domino.top,
                        rotate1: head.bottom === domino.bottom
                    }
                }
                else if (tail.top === domino.top) {
                    return {
                        canPlay: true,
                        placement: [0],
                        rotate0: true,
                        rotate1: false
                    }
                } else if (tail.top === domino.bottom) {
                    console.log("3")
                    return {
                        canPlay: true,
                        placement: [0],
                        rotate0: false,
                        rotate1: false,
                    }
                } else if (head.bottom === domino.top) {
                    console.log("4")
                    return {
                        canPlay: true,
                        placement: [1],
                        rotate0: false,
                        rotate1: false
                    }
                } else if (head.bottom === domino.bottom) {
                    console.log("5")
                    console.log(head.top === domino.top)
                    console.log(head.top === domino.bottom) 
                    return {
                        canPlay: true,
                        placement: [1],
                        rotate0: false,
                        rotate1: true
                    }
                }
            }
        },
        playDomino(domino, placement, rotate) {
            if(rotate) {
                console.log("ROTATE")
                let bottom = domino.bottom
                domino.bottom = domino.top;
                domino.top = bottom;
            }
            // if placement is at the tail
            if (placement === 0) {
                this.playedDominos.splice(0, 0, domino);
            } else if (placement === 3) {
                // How do i decide if its to the tail or the head?
                this.playedDominos.splice(0, 0, domino)
            // Placement is at the head
            } else {
                this.playedDominos.splice(this.playedDominos.length, 0, domino)
            }
            this.playerHand = this.playerHand.filter(d => d !== domino);
            this.selectedDomino = null;
            this.playableDomino = null;
        },
    },
    mounted() {
        this.shuffleDominos();
        this.dealHand();
    }
}
</script>