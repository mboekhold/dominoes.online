<!-- GAME MANAGER -->
<template>
    <div>
        <Board :playedDominos="playedDominos" :playableDomino="playableDomino" @on-play-domino="playDomino" />
        <Player :player="players[0]" @on-selected-domino="onSelectedDomino" :currentPlayerTurn="currentPlayerTurn" />
        <Player :player="players[1]" :currentPlayerTurn="currentPlayerTurn" />
        <Player :player="players[2]" :currentPlayerTurn="currentPlayerTurn" />
        <Player :player="players[3]" :currentPlayerTurn="currentPlayerTurn" />
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
            players: [
                { id: 1, hand: [], notification: null },
                { id: 2, hand: [], notification: null },
                { id: 3, hand: [], notification: null },
                { id: 4, hand: [], notification: null }
            ],
            selectedDomino: null,
            playableDomino: null,
            playerWithDoubleSix: null,
            notification: null,
            currentPlayerTurn: null,
            timeoutId: null
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
                for (let j = 0; j < 4; j++) {
                    this.players[j].hand.push(this.dominoSet.pop());
                }
            }
        },
        dealTestHand() {
            this.playerHand.push(this.dominoSet.find(x => x.top === 5 && x.bottom === 5))
            this.playerHand.push(this.dominoSet.find(x => x.top === 1 && x.bottom === 5))
            this.playerHand.push(this.dominoSet.find(x => x.top === 1 && x.bottom === 2))
            this.playerHand.push(this.dominoSet.find(x => x.top === 0 && x.bottom === 5))
            this.playerHand.push(this.dominoSet.find(x => x.top === 0 && x.bottom === 0))
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
                    return {
                        canPlay: true,
                        placement: [0],
                        rotate0: false,
                        rotate1: false,
                    }
                } else if (head.bottom === domino.top) {
                    return {
                        canPlay: true,
                        placement: [1],
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
                }
            }
        },
        playDomino(domino, placement, rotate) {
            if (this.currentPlayerTurn === 0) {
                if (rotate) {
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
                this.players[0].hand = this.players[0].hand.filter(d => d !== domino);
                this.selectedDomino = null;
                this.playableDomino = null;
                // clearTimeout(this.timeoutId);
            }
        },
        opponentPlayerPlay(player) {
            // The player is playing the first domino, its the player with the double six
            if(this.playedDominos.length === 0) {
                if(this.playerWithDoubleSix === player) {
                    let domino = this.players[player].hand.find(x => x.top === 6 && x.bottom === 6);
                    this.playedDominos.splice(0, 0, domino);
                    this.players[player].hand = this.players[player].hand.filter(d => d !== domino);
                }
            } else {
                let firstPlayableDomino = this.players[player].hand.find(domino => this.checkNextPlacement(domino));
                // If no playable domino, pass
                if (!firstPlayableDomino) {
                    this.showNotification(player, 'Pass');
                    return;
                }
                let playablePlacement = this.checkNextPlacement(firstPlayableDomino);
                // if placement is at the tail
                if (playablePlacement.placement.includes(0)) {
                    if (playablePlacement.rotate0) {
                        let bottom = firstPlayableDomino.bottom
                        firstPlayableDomino.bottom = firstPlayableDomino.top;
                        firstPlayableDomino.top = bottom;
                    }
                    this.playedDominos.splice(0, 0, firstPlayableDomino);
                } else if (playablePlacement.placement.includes(1)) {
                    if (playablePlacement.rotate1) {
                        let bottom = firstPlayableDomino.bottom
                        firstPlayableDomino.bottom = firstPlayableDomino.top;
                        firstPlayableDomino.top = bottom;
                    }
                    this.playedDominos.splice(this.playedDominos.length, 0, firstPlayableDomino)
                } else {
                    this.playedDominos.splice(this.playedDominos.length, 0, firstPlayableDomino)
                }
                this.players[player].hand = this.players[player].hand.filter(d => d !== firstPlayableDomino);
            }
        },
        findPlayerWithDoubleSix() {
            for (let i = 0; i < this.players.length; i++) {
                if (this.players[i].hand.find(x => x.top === 6 && x.bottom === 6)) {
                    return i;
                }
            }
        },
        showNotification(player, message) {
            this.players[player].notification = message;
            setTimeout(() => {
                this.players[player].notification = null;
            }, 5000);
        },
        async playRound() {
            if (this.currentPlayerTurn === 0) {
                await new Promise(resolve => {
                    this.timeoutId = setTimeout(() => {
                        this.currentPlayerTurn = (this.currentPlayerTurn + 1) % 4;
                        resolve();
                    }, 11000);
                })
            } else {
                await new Promise(resolve => {
                    setTimeout(() => {
                        this.opponentPlayerPlay(this.currentPlayerTurn);
                        this.currentPlayerTurn = (this.currentPlayerTurn + 1) % 4;
                        resolve();
                    }, 3000);
                })
            }
        },
        async startGame() {
            this.shuffleDominos();
            this.dealHand();
            this.gameStarted = true;
            this.playerWithDoubleSix = this.findPlayerWithDoubleSix();
            // Player with double six starts, then goes clockwise
            const notificationMessage = `Player ${this.playerWithDoubleSix + 1} starts`;
            this.showNotification(this.playerWithDoubleSix, notificationMessage);
            const playOrder = [this.playerWithDoubleSix, (this.playerWithDoubleSix + 1) % 4, (this.playerWithDoubleSix + 2) % 4, (this.playerWithDoubleSix + 3) % 4];
            this.currentPlayerTurn = playOrder[0];
            while (true) {
                await this.playRound();
            }
        },
    }
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