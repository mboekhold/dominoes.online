<!-- GAME MANAGER -->
<template>
    <div class="lg:ml-20">
        <div v-if="loading">
            <div>
                <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 loader"></div>
            </div>
        </div>
        <div v-else class="lg:px-20 pt-5 relative">
            <Board ref="board" :dominoSet="dominoSet" :dealing="dealingDominoes" @on-play-domino="playDomino"
                @on-game-blocked="gameBlocked" />
            <Player :player="players[0]" :turn="currentPlayerTurn === 0" />
            <Player :player="players[1]" :turn="currentPlayerTurn === 1" />
            <Player :player="players[2]" :turn="currentPlayerTurn === 2" />
            <!-- Current player -->
            <Player v-if="players[3]" :player="players[3]" @on-selected-domino="onSelectedDomino"
                :turn="currentPlayerTurn === 3" />
            <Notification :notifications="notifications" />
            <WinnerNotification v-if="winner" :winner="winner" @on-next-game="nextGame" @on-cancel="cancel" />
        </div>
    </div>
</template>
<script>
import Board from '@/components/Board.vue'
import Player from '@/components/Player.vue'
import WinnerNotification from '@/components/WinnerNotification.vue';
import Notification from '@/components/Notification.vue';
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import { supabase } from '../supabase';

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
            gameStarted: false,
            playedDominos: [],
            players: [
                { nr: 2, profile: { username: 'Johnny', flag_url: null, avatar_url: "https://avatar.iran.liara.run/public/19" }, hand: [] },
                { nr: 3, profile: { username: 'Alex', flag_url: null, avatar_url: "https://avatar.iran.liara.run/public/45" }, hand: [] },
                { nr: 4, profile: { username: 'Chelsea', flag_url: null, avatar_url: "https://avatar.iran.liara.run/public/57" }, hand: [] },
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
            didIntro: false,
            loading: true,
            dealingDominoes: false,
        }
    },
    methods: {
        shuffleDominos() {
            for (let i = this.dominoSet.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [this.dominoSet[i], this.dominoSet[j]] = [this.dominoSet[j], this.dominoSet[i]];
            }
        },
        async dealHand() {
            this.dealingDominoes = true
            let indexOptions = this.generateRandomIndexOptions();
            // We have to add this because the animation to show the dealing dominoes tray takes 300ms
            await new Promise(resolve => setTimeout(resolve, 300))
            for (let i = 0; i < 7; i++) {
                for (let j = 0; j < 4; j++) {
                    const randomIndex = indexOptions.pop();
                    console.log(randomIndex)
                    const domino = this.dominoSet[randomIndex];
                    console.log(domino)
                    this.players[j].hand.push(domino);
                    this.animateDominoFromDeckToPlayer(randomIndex, this.players[j]);
                    await new Promise(resolve => setTimeout(resolve, 200))
                }
            }
            this.dealingDominoes = false;
        },
        async animateDominoFromDeckToPlayer(index, player) {
            const domino = this.$refs.board.$refs[`dealDomino${index}`][0];
            const playerHand = document.getElementById(`playerHand${player.nr}`);

            const startPos = domino.getBoundingClientRect();
            const endPos = playerHand.getBoundingClientRect();

            const translateX = endPos.left - startPos.left;
            const translateY = endPos.top - startPos.top;
            domino.style.transform = `translate(${translateX}px, ${translateY}px)`;
            domino.style.transition = 'transform 0.5s ease-in-out';
            setTimeout(() => {
                domino.remove()
            }, 410);
        },
        generateRandomIndexOptions() {
            let indexOptions = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27];
            for (let i = indexOptions.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1)); // Get a random index
                [indexOptions[i], indexOptions[j]] = [indexOptions[j], indexOptions[i]]; // Swap the elements
            }
            return indexOptions;
        },
        dealTestHand() {
            // this.players[0].hand.push(this.dominoSet.find(x => x.top === 1 && x.bottom === 1))
            for (let i = 0; i < 27; i++) {
                this.players[0].hand.push(this.dominoSet.pop());
            }
        },
        onSelectedDomino(selectedDomino) {
            if (this.currentPlayerTurn !== 3) return;
            this.$refs.board.previewDominoPlacement(selectedDomino);
            if (!this.didIntro) {
                if (this.$refs.board.getNextPlacementOptions(selectedDomino) !== undefined) {
                    setTimeout(() => {
                        if (this.driverObj !== null) {
                            this.driverObj.moveNext();
                        }
                    }, 100);
                }
            }
        },
        playDomino(domino) {
            if (this.currentPlayerTurn !== 3) return;
            // Retrieve the domino from the player's hand, it can be that the domino was rotated so we need to find the correct domino
            const dominoInHand = this.players[3].hand.find(x => x.top === domino.top && x.bottom === domino.bottom || x.top === domino.bottom && x.bottom === domino.top);
            this.players[3].hand = this.players[3].hand.filter(d => d !== dominoInHand);
            if (this.players[3].hand.length === 0) {
                this.winner = this.players[3];
                this.gameEnded = true;
            }
            this.currentPlayerTurn = (this.currentPlayerTurn + 1) % 4;
            if (!this.didIntro) {
                this.driverObj.destroy();
                this.didIntro = true;
                localStorage.setItem('didIntro', true);
            }
            this.playsDone++;
            this.resolve();
        },
        opponentPlayerPlay(player) {
            if (this.playerWithDoubleSix === player && this.playsDone === 0) {
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
                this.showNotification(player, `${this.players[player].profile.username} cannot play, pass`);
            }
        },
        findPlayerWithDoubleSix() {
            for (let i = 0; i < this.players.length; i++) {
                if (this.players[i].hand.find(x => x.top === 6 && x.bottom === 6)) {
                    return i;
                }
            }
        },
        async getUserProfile() {
            this.loading = true;
            try {
                this.user = (await supabase.auth.getSession()).data.session.user;
                const { data, error, status } = await supabase
                    .from('profiles')
                    .select(`id, username, avatar_url,
                    countries (
                        id,
                        name,
                        flag_url
                    )`)
                    .eq('id', this.user.id)
                    .single();

                if (error && status !== 406) throw error
                this.user_profile = data;

                if (data.avatar_url) {
                    let { data: file, error: err } = await supabase.storage.from('avatars').download(data.avatar_url)
                    if (err) throw err
                    if (file) {
                        const url = URL.createObjectURL(file)
                        this.user_profile.avatar_url = url
                    }
                }

            } catch (error) {
                console.log(error.message)
            } finally {
                if (this.user) {
                    this.authenticated = true;
                    const player = {
                        nr: 1,
                        profile: {
                            username: this.user_profile.username,
                            flag_url: this.user_profile.countries.flag_url,
                            avatar_url: this.user_profile.avatar_url
                        },
                        hand: []
                    }
                    this.players.push(player);
                } else {
                    const player = {
                        nr: 1,
                        profile: {
                            username: 'Guest',
                            flag_url: null,
                            avatar_url: null
                        },
                        hand: []
                    }
                    this.players.push(player);
                }
                this.loading = false;
            }
        },
        async playRound() {
            if (this.currentPlayerTurn === 3) {
                await new Promise(resolve => {
                    // Reference to resolve function to be used later if the player does decide to play
                    this.resolve = resolve;
                    const playableDomino = this.players[this.currentPlayerTurn].hand.find(domino => {
                        return this.$refs.board.getNextPlacementOptions(domino) !== undefined;
                    })
                    if (!playableDomino) {
                        this.showNotification(this.currentPlayerTurn, `${this.players[this.currentPlayerTurn].profile.username} cannot play, pass`);
                        this.currentPlayerTurn = (this.currentPlayerTurn + 1) % 4;
                        resolve();
                    }
                    if (!this.didIntro) {
                        // Check if its first play else we need to wait for the driver object to load
                        if (this.driverObj === null) {
                            setTimeout(() => {
                                this.driverObj.drive();
                            }, 1000);
                        } else {
                            this.driverObj.drive();
                        }
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
            await this.dealHand();
            this.currentPlayerTurn === 0;
            this.playerWithDoubleSix = this.findPlayerWithDoubleSix();
            // Player with double six starts, then goes clockwise
            this.showNotification(this.playerWithDoubleSix, `${this.players[this.playerWithDoubleSix].profile.username} starts`);
            const playOrder = [this.playerWithDoubleSix, (this.playerWithDoubleSix + 1) % 4, (this.playerWithDoubleSix + 2) % 4, (this.playerWithDoubleSix + 3) % 4];
            this.currentPlayerTurn = playOrder[0];
            while (!this.gameEnded) {
                await this.playRound();
            }
        },
        gameBlocked() {
            // Game ended should be triggered if a player won
            if (!this.gameEnded) {
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
        nextGame() {
            // Reset all relevant data properties to their initial values
            this.gameEnded = false;
            this.winner = null;
            this.$refs.board.clearBoard();
            this.players.forEach(player => {
                player.hand = [];
            })
            // Restart the game
            this.startGame();
        },
        cancel() {
            this.winner = null;
        },
        showNotification(player, message) {
            this.notifications.push({ player: this.players[player], message: message });
        },
        initDriver() {
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
    },
    async mounted() {
        this.basePath = import.meta.env.VITE_BASE_PATH;
        document.body.classList.add('overflow-hidden');

        await this.getUserProfile();
        this.didIntro = localStorage.getItem('didIntro');
        if (!this.didIntro) {
            this.initDriver();
        }
        await this.startGame();
    },
    beforeUnmount() {
        document.body.classList.remove('overflow-hidden');
    },
}
</script>

<style></style>