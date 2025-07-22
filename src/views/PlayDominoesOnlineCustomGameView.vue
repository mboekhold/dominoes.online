<template>
  <div class="lg:ml-20 h-dvh">
    <div v-if="loading">
      <div>
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 loader"></div>
      </div>
    </div>
    <div v-else class="p-5 pt-5 lg:px-20 lg:pt-5 relative text-gray-200 h-dvh">
      <Board ref="board" :dealing="dealingDominoes" @on-play-domino="playDomino" />
      <Player v-if="players[0]" :player="players[0]" :turn="currentPlayerTurn === players[0]"
        @on-selected-domino="onSelectedDomino" />
      <Player :player="players[1]" :turn="currentPlayerTurn === players[1]" />
      <Player :player="players[2]" :turn="currentPlayerTurn === players[2]" />
      <Player :player="players[3]" :turn="currentPlayerTurn === players[3]" />

      <PNotification :notifications="pnotifications" />
      <GNotification :notifications="gnotifications" />
      <WinnerNotification v-if="showWinnerModal" :winner="winner" @on-cancel="showWinnerModal = false" />
      <GameBlockedNotification v-if="showGameBlockedModal" :winner="winner" :players="players"
        @on-cancel="showGameBlockedModal = false" />
    </div>
  </div>
</template>
<script>
import { io } from 'socket.io-client'
import { supabase } from '../supabase';
import Board from '../components/Board.vue'
import Player from '../components/Player.vue'
import PNotification from '../components/PlayerNotification.vue'
import GNotification from '../components/GameNotification.vue'
import WinnerNotification from '../components/WinnerNotification.vue'
import GameBlockedNotification from '../components/GameBlockedNotification.vue';
import { isUserAuthenticated } from '../utils';
export default {
  components: {
    Board, Player, PNotification, GNotification, GameBlockedNotification, WinnerNotification
  },
  data() {
    return {
      loading: true,
      game: null,
      players: [],
      socket: null,
      dominoLength: 17,
      dealingDominoes: false,
      currentPlayerTurn: null,
      user: null,
      user_profile: null,
      authenticated: false,
      hand: [],
      pnotifications: [],
      gnotifications: [],
      winner: null,
      gameBlocked: false,
      showGameBlockedModal: false,
      showWinnerModal: false,
    }
  },
  methods: {
    async getUserProfile() {
      this.profileLoading = true;
      this.gameHistoryLoading = true;
      try {
        this.user = (await supabase.auth.getSession()).data.session.user;
        const { data, error, status } = await supabase
          .from('profiles')
          .select(`id, username, avatar_url, wins, games_played,
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
        }
        this.profileLoading = false;
      }
    },
    async loadCurrentUser() {
      const is_authenticated = await isUserAuthenticated();
      if (!is_authenticated) {
        const user = JSON.parse(localStorage.getItem('generated_user'));
        if (user) {
          this.user = user;
          this.user_profile = user.user_profile;
          // this.players.push({
          //   id: user.id,
          //   username: user.user_profile.username,
          //   flag_url: null,
          //   country_name: null,
          //   avatar_url: null,
          //   hand: [],
          // });
        }
      }
      else {
        await this.getUserProfile();
      }
    },
    async loadGameData() {
      const gameId = this.$route.params.id
      if (gameId == null) {
        return
      }
      try {
        await this.initPresence()
      } catch (error) {
        console.error(error)
      } finally {
        this.loading = false
      }
    },
    async initPresence() {
      const gameId = this.$route.params.id
      if (gameId == null) {
        return
      }
      this.socket = io(import.meta.env.VITE_WSS_URL, {
        query: {
          game_id: gameId,
          game_type: 'custom',
        }
      })
      this.socket.on('connect', async () => {
        this.socket.emit('join-game', {
          game_id: gameId,
          user_profile: this.user_profile
        })
      })
      this.socket.on('connectedPlayers', async (players) => {
        for (let i = 0; i < players.length; i++) {
          this.loadUser(players[i])
        }
        await this.assignPlayerIds()
      })
      this.socket.on('disconnect', async () => {
        console.log('Disconnected from server')
      })
      this.socket.on('playerDisconnected', async (username) => {
        const player = this.players.find(p => p.username === username)
        const message = `${username} has disconnected from the game.`
        const notification = {
          player: player,
          message
        }
        this.pnotifications.push(notification)
      })
      this.socket.on('dealingHands', async () => {
        await this.animateDealHands()
      })
      this.socket.on('hand', async (hand) => {
        console.log('Received hand:', hand)
        this.hand = hand
      })
      this.socket.on('startingPlayer', async (playerName) => {
        const player = this.players.find(p => p.username === playerName)
        this.currentPlayerTurn = player
        const message = `Double 6 pose, ${player.username} starts`
        const notification = {
          player: player,
          message
        }
        this.pnotifications.push(notification)
      })
      this.socket.on('dominoPlayed', async (data) => {
        const player = data.player
        const domino = data.domino
        const position = data.position
        this.players.find(p => p.username === player.user_profile.username).hand.pop()
        this.$refs.board.placeDomino(domino, position)
      })
      this.socket.on('nextPlayerTurn', async (playerName) => {
        const player = this.players.find(p => p.username === playerName)
        this.currentPlayerTurn = player
      })
      this.socket.on('playerIntervalPassed', async (playerName) => {
        const player = this.players.find(p => p.username === playerName)
        const message = `${player.username} took too long and has passed their turn.`
        const notification = {
          player: player,
          message
        }
        this.pnotifications.push(notification)
      })
      this.socket.on('playerCannotPlay', async (playerName) => {
        const player = this.players.find(p => p.username === playerName)
        const message = `${player.username} cannot play and has passed their turn.`
        const notification = {
          player: player,
          message
        }
        this.pnotifications.push(notification)
      })
      this.socket.on('gameBlocked', async (data) => {
        const winner = this.players.find(p => p.username === data.winner)
        for (let i = 0; i < data.players.length; i++) {
          const player = this.players.find(p => p.username === data.players[i].user_profile.username)
          player.hand = data.players[i].hand
        }
        this.winner = winner
        this.gameBlocked = true
        this.showGameBlockedModal = true
      })
      this.socket.on('playerWon', async (player) => {
        const winner = this.players.find(p => p.username === player)
        this.winner = winner;
        this.showWinnerModal = true;
      })
    },
    async assignPlayerIds() {
      // First put the current user at the bottom of the list
      const player = this.players.find(p => p.id === this.user_profile.id)
      console.log('Current player:', player)
      if (player) {
        const playerIndex = this.players.indexOf(player)
        console.log('Current player index:', playerIndex)
        // Perform a rotation of the players array
        this.players = [...this.players.slice(playerIndex), ...this.players.slice(0, playerIndex)];
        console.log('Players after rotation:', this.players)
        for (let i = 0; i < this.players.length; i++) {

          console.log('Assigning player nr:', i + 1, this.players[i])
          this.players[i].nr = i + 1
        }
      }
    },

    loadUser(user) {
      const player = {
        id: user.user_profile.id,
        username: user.user_profile.username,
        flag_url: null,
        country_name: null,
        avatar_url: null,
        hand: [],
      }
      this.players.push(player)
    },
    shuffleDominoes() {
      for (let i = this.dominoSet.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [this.dominoSet[i], this.dominoSet[j]] = [this.dominoSet[j], this.dominoSet[i]];
      }
    },
    generateRandomIndexOptions() {
      let indexOptions = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27];
      for (let i = indexOptions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1)); // Get a random index
        [indexOptions[i], indexOptions[j]] = [indexOptions[j], indexOptions[i]]; // Swap the elements
      }
      return indexOptions;
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
    async animateDealHands() {
      this.dealingDominoes = true
      let indexOptions = this.generateRandomIndexOptions();
      // We have to add this because the animation to show the dealing dominoes tray takes 300ms
      await new Promise(resolve => setTimeout(resolve, 300))
      for (let i = 0; i < 7; i++) {
        for (let j = 0; j < 4; j++) {
          const user = this.user_profile;
          if (this.players[j].id === user.id) {
            const randomIndex = indexOptions.pop();
            this.animateDominoFromDeckToPlayer(randomIndex, this.players[j]);
            const domino = this.hand.pop();
            this.players[j].hand.push(domino);
          } else {
            const randomIndex = indexOptions.pop();
            this.players[j].hand.push(randomIndex);
            this.animateDominoFromDeckToPlayer(randomIndex, this.players[j]);
          }
          await new Promise(resolve => setTimeout(resolve, 200))
        }
      }
      this.dealingDominoes = false;
    },
    onSelectedDomino(selectedDomino) {
      if (this.currentPlayerTurn !== this.players[0]) return;
      this.$refs.board.previewDominoPlacement(selectedDomino);
    },
    playDomino(domino, selectedPosition) {
      if (this.currentPlayerTurn !== this.players[0]) return;
      // Retrieve the domino from the player's hand, it can be that the domino was rotated so we need to find the correct domino
      const dominoInHand = this.players[0].hand.find(x => x.top === domino.top && x.bottom === domino.bottom || x.top === domino.bottom && x.bottom === domino.top);
      this.players[0].hand = this.players[0].hand.filter(d => d !== dominoInHand);
      // Send the domino to the server
      const data = {
        domino: dominoInHand,
        position: selectedPosition
      }
      this.socket.emit('playDomino', data);
    },
    handleBeforeUnload(event) {
      const message = 'Are you sure you want to leave?';
      event.returnValue = message;
      return message;
    }
  },
  async mounted() {
    document.body.classList.add('overflow-hidden');
    document.getElementById('app').classList.add('overflow-hidden');
    await this.loadCurrentUser();
    await this.loadGameData()
    window.addEventListener('beforeunload', this.handleBeforeUnload);
  },
  async beforeUnmount() {
    document.body.classList.remove('overflow-hidden');
    document.getElementById('app').classList.remove('overflow-hidden');
    if (this.socket) {
      this.socket.disconnect()
    }
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
<style>
.loader {
  width: 85px;
  height: 50px;
  --g1: conic-gradient(from 90deg at left 3px top 3px, #ffffff 90deg, #fff 0);
  --g2: conic-gradient(from -90deg at bottom 3px right 3px, #0000 90deg, #fff 0);
  background: var(--g1), var(--g1), var(--g1), var(--g2), var(--g2), var(--g2);
  background-position: left, center, right;
  background-repeat: no-repeat;
  animation: l9 1s infinite;
}

@keyframes l9 {
  0% {
    background-size: 25px 50%, 25px 50%, 25px 50%
  }

  25% {
    background-size: 25px 100%, 25px 50%, 25px 50%
  }

  50% {
    background-size: 25px 50%, 25px 100%, 25px 50%
  }

  75% {
    background-size: 25px 50%, 25px 50%, 25px 100%
  }

  100% {
    background-size: 25px 50%, 25px 50%, 25px 50%
  }
}
</style>