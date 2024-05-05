<!-- GAME MANAGER -->
<template>
    <div>
        <Board ref="board" @on-play-domino="playDomino" />
        <div v-if="!gameStarted">
            <button class="start-game-button bg-white px-6 py-2 rounded-md font-bold" @click="startGame()">
                Start game
            </button>
        </div>
        <div v-else>
            <Player :player="players[0]" @on-selected-domino="onSelectedDomino" :turn="currentPlayerTurn === 0" />
            <Player :player="players[1]" :turn="currentPlayerTurn === 1" />
            <Player :player="players[2]" :turn="currentPlayerTurn === 2" />
            <Player :player="players[3]" :turn="currentPlayerTurn === 3" />
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
            timeoutId: null,
            resolve: null
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
            // this.players[0].hand.push(this.dominoSet.find(x => x.top === 1 && x.bottom === 1))
            // this.players[0].hand.push(this.dominoSet.find(x => x.top === 1 && x.bottom === 2))
            // this.players[0].hand.push(this.dominoSet.find(x => x.top === 1 && x.bottom === 3))
            // this.players[0].hand.push(this.dominoSet.find(x => x.top === 1 && x.bottom === 2))
            // this.players[0].hand.push(this.dominoSet.find(x => x.top === 2 && x.bottom === 6))
            // this.players[0].hand.push(this.dominoSet.find(x => x.top === 6 && x.bottom === 6))
            // this.players[0].hand.push(this.dominoSet.find(x => x.top === 1 && x.bottom === 1))
            // this.players[0].hand.push(this.dominoSet.find(x => x.top === 1 && x.bottom === 3))
            // this.players[0].hand.push(this.dominoSet.find(x => x.top === 3 && x.bottom === 4))
            // this.players[0].hand.push(this.dominoSet.find(x => x.top === 4 && x.bottom === 6))
            // this.players[0].hand.push(this.dominoSet.find(x => x.top === 5 && x.bottom === 6))
            // this.players[0].hand.push(this.dominoSet.find(x => x.top === 2 && x.bottom === 3))
            // this.players[0].hand.push(this.dominoSet.find(x => x.top === 3 && x.bottom === 3))
            for (let i = 0; i < 20; i++) {
                this.players[0].hand.push(this.dominoSet.pop());
            }
        },
        onSelectedDomino(selectedDomino) {
            this.$refs.board.previewDominoPlacement(selectedDomino);
        },
        playDomino(domino) {
            // Retrieve the domino from the player's hand, it can be that the domino was rotated so we need to find the correct domino
            const dominoInHand = this.players[0].hand.find(x => x.top === domino.top && x.bottom === domino.bottom || x.top === domino.bottom && x.bottom === domino.top);
            this.players[0].hand = this.players[0].hand.filter(d => d !== dominoInHand);
        },
        opponentPlayerPlay(player) {
            // The player is playing the first domino, its the player with the double six
            if (this.playedDominos.length === 0) {
                if (this.playerWithDoubleSix === player) {
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
                    this.addToBoard(firstPlayableDomino, 0);
                } else if (playablePlacement.placement.includes(1)) {
                    if (playablePlacement.rotate1) {
                        let bottom = firstPlayableDomino.bottom
                        firstPlayableDomino.bottom = firstPlayableDomino.top;
                        firstPlayableDomino.top = bottom;
                    }
                    this.playedDominos.splice(this.playedDominos.length, 0, firstPlayableDomino)
                    this.addToBoard(firstPlayableDomino, 1);
                } else {
                    this.playedDominos.splice(this.playedDominos.length, 0, firstPlayableDomino)
                    this.addToBoard(firstPlayableDomino, 1);
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
                    // Reference to resolve function to be used later if the player does decide to play
                    this.resolve = resolve;
                    this.timeoutId = setTimeout(() => {
                        this.currentPlayerTurn = (this.currentPlayerTurn + 1) % 4;
                        this.showNotification(0, 'Pass');
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
        addToBoard(domino, placement) {
            this.$refs.board.addToBoard(domino, placement);
        },
        async startGame() {
            this.gameStarted = true;
            this.shuffleDominos();
            this.dealTestHand();
            this.currentPlayerTurn === 0;
            // this.playerWithDoubleSix = this.findPlayerWithDoubleSix();
            // Player with double six starts, then goes clockwise
            // const notificationMessage = `Player ${this.playerWithDoubleSix + 1} starts`;
            // this.showNotification(this.playerWithDoubleSix, notificationMessage);
            // const playOrder = [this.playerWithDoubleSix, (this.playerWithDoubleSix + 1) % 4, (this.playerWithDoubleSix + 2) % 4, (this.playerWithDoubleSix + 3) % 4];
            // this.currentPlayerTurn = playOrder[0];
            // while (true) {
            //     await this.playRound();
            // }
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