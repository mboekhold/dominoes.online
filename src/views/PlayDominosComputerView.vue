<!-- GAME MANAGER -->
<template>
    <div>
        <Board ref="board" @on-play-domino="playDomino" @on-game-blocked="gameBlocked" />
        <Player :player="players[0]" @on-selected-domino="onSelectedDomino" :turn="currentPlayerTurn === 0" />
        <Player :player="players[1]" :turn="currentPlayerTurn === 1" />
        <Player :player="players[2]" :turn="currentPlayerTurn === 2" />
        <Player :player="players[3]" :turn="currentPlayerTurn === 3" />
        <Notification :notifications="notifications" />
        <WinnerNotification v-if="winner" :winner="winner" @on-rematch="rematch" @on-cancel="cancel" />
    </div>
</template>
<script>
import Board from '@/components/Board.vue'
import Player from '@/components/Player.vue'
import WinnerNotification from '@/components/WinnerNotification.vue';
import Notification from '@/components/Notification.vue';
import { driver } from "driver.js";
import "driver.js/dist/driver.css";

export default {
    components: {
        Board,
        Player,
        Notification,
        WinnerNotification
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
            caribbeanFlag: [
                `${import.meta.env.VITE_BASE_PATH}/ag.svg`,
                `${import.meta.env.VITE_BASE_PATH}/ai.svg`,
                `${import.meta.env.VITE_BASE_PATH}/aw.svg`,
                `${import.meta.env.VITE_BASE_PATH}/bb.svg`,
                `${import.meta.env.VITE_BASE_PATH}/bl.svg`,
                `${import.meta.env.VITE_BASE_PATH}/bs.svg`,
                `${import.meta.env.VITE_BASE_PATH}/bm.svg`,
                `${import.meta.env.VITE_BASE_PATH}/bq.svg`,
                `${import.meta.env.VITE_BASE_PATH}/cu.svg`,
                `${import.meta.env.VITE_BASE_PATH}/cw.svg`,
                `${import.meta.env.VITE_BASE_PATH}/dm.svg`,
                `${import.meta.env.VITE_BASE_PATH}/do.svg`,
                `${import.meta.env.VITE_BASE_PATH}/gd.svg`,
                `${import.meta.env.VITE_BASE_PATH}/gp.svg`,
                `${import.meta.env.VITE_BASE_PATH}/gt.svg`,
                `${import.meta.env.VITE_BASE_PATH}/hn.svg`,
                `${import.meta.env.VITE_BASE_PATH}/ht.svg`,
                `${import.meta.env.VITE_BASE_PATH}/jm.svg`,
                `${import.meta.env.VITE_BASE_PATH}/kn.svg`,
                `${import.meta.env.VITE_BASE_PATH}/ky.svg`,
                `${import.meta.env.VITE_BASE_PATH}/lc.svg`,
                `${import.meta.env.VITE_BASE_PATH}/mf.svg`,
                `${import.meta.env.VITE_BASE_PATH}/mq.svg`,
                `${import.meta.env.VITE_BASE_PATH}/ms.svg`,
                `${import.meta.env.VITE_BASE_PATH}/ni.svg`,
                `${import.meta.env.VITE_BASE_PATH}/pa.svg`,
                `${import.meta.env.VITE_BASE_PATH}/pr.svg`,
                `${import.meta.env.VITE_BASE_PATH}/sx.svg`,
                `${import.meta.env.VITE_BASE_PATH}/tc.svg`,
                `${import.meta.env.VITE_BASE_PATH}/tt.svg`,
                `${import.meta.env.VITE_BASE_PATH}/vc.svg`,
                `${import.meta.env.VITE_BASE_PATH}/vg.svg`,
                `${import.meta.env.VITE_BASE_PATH}/vi.svg`,
            ],
            gameStarted: false,
            playedDominos: [],
            players: [
                { id: 1, flag: null, hand: [], notification: null },
                { id: 2, flag: null, hand: [], notification: null },
                { id: 3, flag: null, hand: [], notification: null },
                { id: 4, flag: null, hand: [], notification: null }
            ],
            selectedDomino: null,
            playsDone: 0,
            playableDomino: null,
            playerWithDoubleSix: null,
            notifications: [],
            currentPlayerTurn: null,
            timeoutId: null,
            resolve: null,
            winner: null,
            gameEnded: false,
            driverObj: null,
            didIntro: false
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
        giveRandomImages() {
            for (let i = 0; i < this.players.length; i++) {
                this.players[i].flag = this.caribbeanFlag[Math.floor(Math.random() * this.caribbeanFlag.length)];
            }
        },
        dealTestHand() {
            // this.players[0].hand.push(this.dominoSet.find(x => x.top === 1 && x.bottom === 1))
            for (let i = 0; i < 27; i++) {
                this.players[0].hand.push(this.dominoSet.pop());
            }
        },
        onSelectedDomino(selectedDomino) {
            if (this.currentPlayerTurn !== 0) return;
            this.$refs.board.previewDominoPlacement(selectedDomino);
            if(!this.didIntro) {
                if(this.$refs.board.getNextPlacementOptions(selectedDomino) !== undefined) {
                    setTimeout(() => {
                        this.driverObj.moveNext();
                    }, 100);
                }

            }
            
        },
        playDomino(domino) {
            if (this.currentPlayerTurn !== 0) return;
            // Retrieve the domino from the player's hand, it can be that the domino was rotated so we need to find the correct domino
            const dominoInHand = this.players[0].hand.find(x => x.top === domino.top && x.bottom === domino.bottom || x.top === domino.bottom && x.bottom === domino.top);
            this.players[0].hand = this.players[0].hand.filter(d => d !== dominoInHand);
            if (this.players[0].hand.length === 0) {
                this.winner = this.players[0];
                this.gameEnded = true;
            }
            this.currentPlayerTurn = (this.currentPlayerTurn + 1) % 4;
            if(!this.didIntro) {
                this.driverObj.destroy();
                this.didIntro = true;
                localStorage.setItem('didIntro', true);
            }
            this.playsDone++;
            this.resolve();
        },
        opponentPlayerPlay(player) {
            if(this.playerWithDoubleSix === player && this.playsDone === 0) {
                const doubleSix = this.players[player].hand.find(x => x.top === 6 && x.bottom === 6);
                this.players[player].hand = this.players[player].hand.filter(d => d !== doubleSix);
                let playableDomino = this.$refs.board.getNextPlacementOptions(doubleSix);
                playableDomino.location = this.$refs.board.getNextDominoPlacementLocation(doubleSix, doubleSix.placement[0]);
                this.$refs.board.playDomino(doubleSix, doubleSix.placement[1]);
                this.playsDone++;
                return;
            }
            const playableDomino = this.players[player].hand.find(domino => {
                return this.$refs.board.getNextPlacementOptions(domino) !== undefined;
            })
            if (playableDomino) {
                if (playableDomino.placement.length > 1) {
                    const placement = Math.round(Math.random() * (1 - 0) + 0);
                    playableDomino.location = this.$refs.board.getNextDominoPlacementLocation(playableDomino, placement);
                    this.$refs.board.playDomino(playableDomino, placement);
                    const dominoInHand = this.players[player].hand.find(x => x.top === playableDomino.top && x.bottom === playableDomino.bottom || x.top === playableDomino.bottom && x.bottom === playableDomino.top);
                    this.players[player].hand = this.players[player].hand.filter(d => d !== dominoInHand);
                    if (this.players[player].hand.length === 0) {
                        this.winner = this.players[player];
                        this.gameEnded = true;
                    }
                } else {
                    const placement = playableDomino.placement[0];
                    playableDomino.location = this.$refs.board.getNextDominoPlacementLocation(playableDomino, placement);
                    this.$refs.board.playDomino(playableDomino, playableDomino.placement[0]);
                    const dominoInHand = this.players[player].hand.find(x => x.top === playableDomino.top && x.bottom === playableDomino.bottom || x.top === playableDomino.bottom && x.bottom === playableDomino.top);
                    this.players[player].hand = this.players[player].hand.filter(d => d !== dominoInHand);
                    if (this.players[player].hand.length === 0) {
                        this.winner = this.players[player];
                        this.gameEnded = true;
                    }
                }
                this.playsDone++;
            } else {
                this.showNotification(player, `Player ${player + 1} cannot play, pass`);
            }
        },
        findPlayerWithDoubleSix() {
            for (let i = 0; i < this.players.length; i++) {
                if (this.players[i].hand.find(x => x.top === 6 && x.bottom === 6)) {
                    return i;
                }
            }
        },
        playerWithDoubleSixPlays() {

        },
        async playRound() {
            if (this.currentPlayerTurn === 0) {
                await new Promise(resolve => {
                    // Reference to resolve function to be used later if the player does decide to play
                    this.resolve = resolve;
                    const playableDomino = this.players[this.currentPlayerTurn].hand.find(domino => {
                        return this.$refs.board.getNextPlacementOptions(domino) !== undefined;
                    })
                    if (!playableDomino) {
                        this.showNotification(this.currentPlayerTurn, `Player ${this.currentPlayerTurn + 1} cannot play, pass`);
                        this.currentPlayerTurn = (this.currentPlayerTurn + 1) % 4;
                        resolve();
                    }
                    if (!this.didIntro) {
                        this.driverObj.drive();
                    }
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
            this.dealHand();
            this.giveRandomImages();
            this.currentPlayerTurn === 0;
            this.playerWithDoubleSix = this.findPlayerWithDoubleSix();
            // Player with double six starts, then goes clockwise
            this.showNotification(this.playerWithDoubleSix, `Player ${this.playerWithDoubleSix + 1} starts`);
            const playOrder = [this.playerWithDoubleSix, (this.playerWithDoubleSix + 1) % 4, (this.playerWithDoubleSix + 2) % 4, (this.playerWithDoubleSix + 3) % 4];
            this.currentPlayerTurn = playOrder[0];
            while (!this.gameEnded) {
                await this.playRound();
            }
        },
        gameBlocked() {
            // Game ended should be triggered if a player won
            if(!gameEnded) {
                // Count all players hands and see who has the lowest sum
                let playerWithLowestSum = { player: null, sum: 100 }
                this.players.forEach(player => {
                    let sum = 0;
                    player.hand.forEach(domino => {
                        sum += domino.top + domino.bottom;
                    })
                    if (sum < playerWithLowestSum.sum) {
                        playerWithLowestSum = { player: player, sum: sum }
                    }
                })
                this.winner = playerWithLowestSum.player;
                this.gameEnded = true;
            }
        },
        rematch() {
            window.location.reload();
        },
        cancel() {
            this.winner = null;
        },
        showNotification(player, message) {
            this.notifications.push({ player: this.players[player], message: message });
        }
    },
    mounted() {
        this.basePath = import.meta.env.VITE_BASE_PATH;
        document.body.classList.add('overflow-hidden', 'fixed');
        this.startGame();
        this.didIntro = localStorage.getItem('didIntro');
        if (!this.didIntro) {
            this.driverObj = new driver({
                onCloseClick: () => {
                    this.driverObj.destroy();
                    localStorage.setItem('didIntro', true);
                },
                showProgress: true,
                showButtons: ["close"],
                steps: [
                    {
                        element: document.querySelector('.playerBox1'),
                        popover: {
                            title: "It's your turn",
                            description: "This is your hand. Click on a matching domino to play it.",
                        }
                    },
                    {
                        element: '.preview',
                        popover: {
                            title: "Play Domino",
                            description: "Possible placements are shown in yellow. Click on a placement to play the domino.",
                        }
                    }

                ]
            });
        }
    }
}
</script>

<style>
</style>