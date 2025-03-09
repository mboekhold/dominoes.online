<!-- GAME MANAGER -->
<template>
    <div class="lg:ml-20 h-full">
        <div v-if="loading">
            <div>
                <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 loader"></div>
            </div>
        </div>
        <div v-else class="p-5 pt-5 lg:px-20 lg:pt-5 relative text-gray-200">
            <Board ref="board" :dominoSet="dominoSet" :dealing="dealingDominoes" @on-play-domino="playDomino"
                @on-game-blocked="gameBlocked" />
            <!-- Current player -->
            <Player :player="players[0]" @on-selected-domino="onSelectedDomino" :turn="currentPlayerTurn === players[0]"
                @on-player-turn-timeout="turnTimeOut" />
            <Player :player="players[1]" :turn="currentPlayerTurn === players[1]" />
            <Player :player="players[2]" :turn="currentPlayerTurn === players[2]" />
            <Player :player="players[3]" :turn="currentPlayerTurn === players[3]" />


            <PNotification :notifications="notifications" />
            <WinnerNotification v-if="winner" :winner="winner" @on-next-game="nextGame" @on-cancel="cancel" />
        </div>
    </div>
</template>
<script>
import Board from '@/components/Board.vue'
import Player from '@/components/Player.vue'
import WinnerNotification from '@/components/WinnerNotification.vue';
import PNotification from '@/components/PlayerNotification.vue';
import { supabase } from '../supabase';

export default {
    components: {
        Board,
        Player,
        PNotification,
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
            playedDominos: [],
            players: [
                { id: 1, nr: 2, username: 'Johnny', flag_url: null, avatar_url: null, hand: [] },
                { id: 2, nr: 3, username: 'Alex', flag_url: null, avatar_url: null, hand: [] },
                { id: 3, nr: 4, username: 'Chelsea', flag_url: null, avatar_url: null, hand: [] },
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
                    const domino = this.dominoSet[randomIndex];
                    this.players[j].hand.push({ ...domino });
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
            for (let i = 0; i < 28; i++) {
                this.players[0].hand.push(this.dominoSet.pop());
            }
        },
        onSelectedDomino(selectedDomino) {
            if (this.currentPlayerTurn !== this.players[0]) return;
            this.$refs.board.previewDominoPlacement(selectedDomino);
        },
        playDomino(domino) {
            if (this.currentPlayerTurn !== this.players[0]) return;
            // Retrieve the domino from the player's hand, it can be that the domino was rotated so we need to find the correct domino
            const dominoInHand = this.players[0].hand.find(x => x.top === domino.top && x.bottom === domino.bottom || x.top === domino.bottom && x.bottom === domino.top);
            this.players[0].hand = this.players[0].hand.filter(d => d !== dominoInHand);
            if (this.players[0].hand.length === 0) {
                this.winner = this.players[0];
                this.gameEnded = true;
            }
            this.currentPlayerIndex = this.players.findIndex(x => x === this.currentPlayerTurn);
            this.currentPlayerTurn = (this.currentPlayerIndex + 1) % 4;
            this.currentPlayerTurn = this.players[this.currentPlayerTurn];
            this.playsDone++;
            this.resolve();
        },
        opponentPlayerPlay(player) {
            if (this.playerWithDoubleSix === player && this.playsDone === 0) {
                const doubleSix = player.hand.find(x => x.top === 6 && x.bottom === 6);
                player.hand = player.hand.filter(d => d !== doubleSix);
                let playableDomino = this.$refs.board.getNextPlacementOptions(doubleSix);
                playableDomino.location = this.$refs.board.getNextDominoPlacementLocation(doubleSix, doubleSix.placement[0]);
                this.$refs.board.playDomino(doubleSix, doubleSix.placement[1]);
                this.playsDone++;
                return;
            }
            console.log(player)
            const playableDomino = player.hand.find(domino => {
                return this.$refs.board.getNextPlacementOptions(domino) !== undefined;
            })
            if (playableDomino) {
                if (playableDomino.placement.length > 1) {
                    const placement = Math.round(Math.random() * (1 - 0) + 0);
                    playableDomino.location = this.$refs.board.getNextDominoPlacementLocation(playableDomino, placement);
                    this.$refs.board.playDomino(playableDomino, placement);
                    const dominoInHand = player.hand.find(x => x.top === playableDomino.top && x.bottom === playableDomino.bottom || x.top === playableDomino.bottom && x.bottom === playableDomino.top);
                    player.hand = player.hand.filter(d => d !== dominoInHand);
                    if (player.hand.length === 0) {
                        this.winner = player;
                        this.gameEnded = true;
                    }
                } else {
                    const placement = playableDomino.placement[0];
                    playableDomino.location = this.$refs.board.getNextDominoPlacementLocation(playableDomino, placement);
                    this.$refs.board.playDomino(playableDomino, playableDomino.placement[0]);
                    const dominoInHand = player.hand.find(x => x.top === playableDomino.top && x.bottom === playableDomino.bottom || x.top === playableDomino.bottom && x.bottom === playableDomino.top);
                    player.hand = player.hand.filter(d => d !== dominoInHand);
                    if (player.hand.length === 0) {
                        this.winner = player;
                        this.gameEnded = true;
                    }
                }
                this.playsDone++;
            } else {
                this.showNotification(player, `${player.username} cannot play, pass`);
            }
        },
        findPlayerWithDoubleSix() {
            for (let i = 0; i < this.players.length; i++) {
                if (this.players[i].hand.find(x => x.top === 6 && x.bottom === 6)) {
                    return this.players[i];
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
                        id: this.user.id,
                        nr: 1,
                        username: this.user_profile.username,
                        flag_url: this.user_profile.countries?.flag_url,
                        avatar_url: this.user_profile.avatar_url,
                        hand: []
                    }
                    this.players.unshift(player);
                } else {
                    const player = {
                        id: 0,
                        nr: 1,
                        username: 'Guest',
                        flag_url: null,
                        avatar_url: null,
                        hand: []
                    }
                    this.players.push(player);
                }
                this.loading = false;
            }
        },
        async playRound() {
            if (this.currentPlayerTurn === this.players[0]) {
                await new Promise(resolve => {
                    // Reference to resolve function to be used later if the player does decide to play
                    this.resolve = resolve;
                    console.log("ME")
                    const playableDomino = this.currentPlayerTurn.hand.find(domino => {
                        return this.$refs.board.getNextPlacementOptions(domino) !== undefined;
                    })
                    if (!playableDomino) {
                        this.showNotification(this.currentPlayerTurn, `${this.currentPlayerTurn.username} cannot play, pass`);
                        this.nextPlayerTurn();
                        resolve();
                    }
                })
            } else {
                await new Promise(resolve => {
                    setTimeout(() => {
                        this.opponentPlayerPlay(this.currentPlayerTurn);
                        this.nextPlayerTurn();
                        resolve();
                    }, 3000);
                })
            }
        },
        addToBoard(domino, placement) {
            this.$refs.board.addToBoard(domino, placement);
        },
        async startGame() {
            this.shuffleDominos();
            await this.dealHand();
            this.playerWithDoubleSix = this.findPlayerWithDoubleSix();
            // Player with double six starts, then goes clockwise
            this.showNotification(this.playerWithDoubleSix, `Double 6 pose, ${this.playerWithDoubleSix.username} starts`);
            const playOrder = this.getPlayOrder(this.players, this.playerWithDoubleSix);
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
        nextPlayerTurn() {
            const currentPlayerIndex = this.players.findIndex(x => x === this.currentPlayerTurn);
            const nextPlayerIndex = (currentPlayerIndex + 1) % 4;
            this.currentPlayerTurn = this.players[nextPlayerIndex];
        },
        getPlayOrder(players, playerWithDoubleSix) {
            const playerWithDoubleSixIndex = players.findIndex(x => x === playerWithDoubleSix);
            const playOrder = [
                players[playerWithDoubleSixIndex],                    // Starting player
                players[(playerWithDoubleSixIndex + 1) % players.length],  // Next player
                players[(playerWithDoubleSixIndex + 2) % players.length],  // Next next player
                players[(playerWithDoubleSixIndex + 3) % players.length]   // Last player
            ];
            return playOrder;
        },
        nextGame() {
            // Reset all relevant data properties to their initial values
            window.location.reload();
        },
        cancel() {
            this.winner = null;
        },
        showNotification(player, message) {
            this.notifications.push({ player: player, message: message });
        },
        turnTimeOut(player) {
            this.showNotification(player, `${player.username} took too long, pass`);
            this.nextPlayerTurn();
        },
        handleBeforeUnload(event) {
            const message = 'Are you sure you want to leave?';
            event.returnValue = message;
            return message;
        }
    },
    async mounted() {
        window.addEventListener('beforeunload', this.handleBeforeUnload);
        this.basePath = import.meta.env.VITE_BASE_PATH;
        document.body.classList.add('overflow-hidden');
        await this.getUserProfile();
        await this.startGame();
    },
    beforeUnmount() {
        document.body.classList.remove('overflow-hidden');
        window.removeEventListener('beforeunload', this.handleBeforeUnload);
    },
    beforeRouteLeave(to, from, next) {
        if (!this.winner) {
            const answer = window.confirm('Are you sure you want to leave?')
            if (answer) {
                next()
            } else {
                next(false)
            }
        } else {
            next()
        }
    }
}
</script>

<style></style>