<template>
    <div>
        <Board :playedDominos="playedDominos" :playableDomino="playableDomino" @on-play-domino="playDomino" />
        <Player :hand="playerHand" :playerId="1" @on-selected-domino="onSelectedDomino" />
        <Player :hand="player1Hand" :playerId="2" />
        <Player :hand="player2Hand" :playerId="3" />
        <Player :hand="player3Hand" :playerId="4" />
        <div v-if="!gameStarted">
            <button class="start-game-button bg-white px-6 py-2 rounded-md font-bold" @click="startGame()">
                Start game
            </button>
        </div>
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
            gameStarted: false,
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
            if (this.playableDomino && !domino) {
                this.playableDomino = null;
            }
            if (domino) {
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
            if (this.playedDominos.length === 0) {
                return {
                    canPlay: true,
                    placement: [0],
                    rotate0: false,
                    rotate1: false
                }
            } else if (this.playedDominos.length === 1) {
                let head = this.playedDominos[this.playedDominos.length - 1];
                // Domino can be placed on both sides..
                if ((head.top === domino.top || head.top === domino.bottom) && (head.bottom === domino.top || head.bottom === domino.bottom)) {
                    return {
                        canPlay: true,
                        placement: [0, 1],
                        rotate0: head.top === domino.top,
                        rotate1: head.top === domino.bottom
                    }
                }
                else if (head.top === domino.top) {
                    return {
                        canPlay: true,
                        placement: [0],
                        rotate0: true,
                        rotate1: false
                    }
                } else if (head.top === domino.bottom) {
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
                if ((tail.top === domino.top || tail.top === domino.bottom) && (head.bottom === domino.top || head.bottom === domino.bottom)) {
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
            if (rotate) {
                console.log("ROTATE")
                let bottom = domino.bottom
                domino.bottom = domino.top;
                domino.top = bottom;
            }
            // if placement is at the tail
            if (placement === 0) {
                this.playedDominos.splice(0, 0, domino);
            } else {
                this.playedDominos.splice(this.playedDominos.length, 0, domino)
            }
            this.playerHand = this.playerHand.filter(d => d !== domino);
            this.selectedDomino = null;
            this.playableDomino = null;
            setTimeout(() => {
                this.player1Play();
            }, 2000);
            setTimeout(() => {
                this.player2Play();
            }, 4000);
            setTimeout(() => {
                this.player3Play();
            }, 6000);
        },
        player1Play() {
            let firstPlayableDomino = this.player1Hand.find(domino => this.checkNextPlacement(domino));
            let playablePlacement = this.checkNextPlacement(firstPlayableDomino);
            // if placement is at the tail
            console.log(playablePlacement)
            console.log(firstPlayableDomino)
            if (playablePlacement.placement.includes(0)) {
                console.log("A")
                if (playablePlacement.rotate0) {
                    let bottom = firstPlayableDomino.bottom
                    firstPlayableDomino.bottom = firstPlayableDomino.top;
                    firstPlayableDomino.top = bottom;
                }
                this.playedDominos.splice(0, 0, firstPlayableDomino);
            } else if (playablePlacement.placement.includes(1)) {
                console.log("B")
                if (playablePlacement.rotate1) {
                    let bottom = firstPlayableDomino.bottom
                    firstPlayableDomino.bottom = firstPlayableDomino.top;
                    firstPlayableDomino.top = bottom;
                }
                // How do i decide if its to the tail or the head?
                this.playedDominos.splice(this.playedDominos.length, 0, firstPlayableDomino)
                // Placement is at the head
            } else {
                console.log("C")
                this.playedDominos.splice(this.playedDominos.length, 0, firstPlayableDomino)
            }
            this.player1Hand = this.player1Hand.filter(d => d !== firstPlayableDomino);
        },
        player2Play() {
            let firstPlayableDomino = this.player2Hand.find(domino => this.checkNextPlacement(domino));
            let playablePlacement = this.checkNextPlacement(firstPlayableDomino);
            // if placement is at the tail
            console.log(playablePlacement)
            console.log(firstPlayableDomino)
            if (playablePlacement.placement.includes(0)) {
                console.log("A")
                if (playablePlacement.rotate0) {
                    let bottom = firstPlayableDomino.bottom
                    firstPlayableDomino.bottom = firstPlayableDomino.top;
                    firstPlayableDomino.top = bottom;
                }
                this.playedDominos.splice(0, 0, firstPlayableDomino);
            } else if (playablePlacement.placement.includes(1)) {
                console.log("B")
                if (playablePlacement.rotate1) {
                    let bottom = firstPlayableDomino.bottom
                    firstPlayableDomino.bottom = firstPlayableDomino.top;
                    firstPlayableDomino.top = bottom;
                }
                this.playedDominos.splice(this.playedDominos.length, 0, firstPlayableDomino)
            } else {
                console.log("C")
                this.playedDominos.splice(this.playedDominos.length, 0, firstPlayableDomino)
            }
            this.player2Hand = this.player2Hand.filter(d => d !== firstPlayableDomino);
        },
        player3Play() {
            let firstPlayableDomino = this.player3Hand.find(domino => this.checkNextPlacement(domino));
            let playablePlacement = this.checkNextPlacement(firstPlayableDomino);
            // if placement is at the tail
            console.log(playablePlacement)
            console.log(firstPlayableDomino)
            if (playablePlacement.placement.includes(0)) {
                console.log("A")
                if (playablePlacement.rotate0) {
                    let bottom = firstPlayableDomino.bottom
                    firstPlayableDomino.bottom = firstPlayableDomino.top;
                    firstPlayableDomino.top = bottom;
                }
                this.playedDominos.splice(0, 0, firstPlayableDomino);
            } else if (playablePlacement.placement.includes(1)) {
                console.log("B")
                if (playablePlacement.rotate1) {
                    let bottom = firstPlayableDomino.bottom
                    firstPlayableDomino.bottom = firstPlayableDomino.top;
                    firstPlayableDomino.top = bottom;
                }
                this.playedDominos.splice(this.playedDominos.length, 0, firstPlayableDomino)
            } else {
                console.log("C")
                this.playedDominos.splice(this.playedDominos.length, 0, firstPlayableDomino)
            }

            this.player3Hand = this.player3Hand.filter(d => d !== firstPlayableDomino);
        },
        startGame() {
            this.shuffleDominos();
            this.dealHand();
            this.gameStarted = true;
        }
    },
}
</script>

<style>
.start-game-button {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
</style>