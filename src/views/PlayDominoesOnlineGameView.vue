<template>
  <div class="ml-20">
    <div v-if="loading">
      <div>
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 loader"></div>
      </div>
    </div>
    <div v-else class="px-20 pt-5 relative text-gray-200">
      <Board ref="board" :dealing="dealingDominoes" @on-play-domino="playDomino" />
      <Player :player="players[0]" :turn="currentPlayerTurn === players[0]"
        @on-selected-domino="onSelectedDomino" />
      <Player :player="players[1]" :turn="currentPlayerTurn === players[1]" />
      <Player :player="players[2]" :turn="currentPlayerTurn === players[2]" />
      <Player :player="players[3]" :turn="currentPlayerTurn === players[3]" />

      <PNotification :notifications="pnotifications" />
      <GNotification :notifications="gnotifications" />
      <GameBlockedNotification v-if="winner" :winner="winner" :players="players" />
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
import GameBlockedNotification from '../components/GameBlockedNotification.vue';
export default {
  components: {
    Board, Player, PNotification, GNotification, GameBlockedNotification
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
      hand: [],
      pnotifications: [],
      gnotifications: [],
      winner: null,
    }
  },
  methods: {
    async loadGameData() {
      const gameId = this.$route.params.id
      if (gameId == null) {
        return
      }
      try {
        let { data: games, error } = await supabase
          .from('games')
          .select('*')
          .eq('id', gameId)

        if (error) {
          throw error
        }
        if (games.length == 0) {
          throw new Error('Game not found')
        }
        this.game = games[0]
        let { data, err } = await supabase
          .from('user_game')
          .select('user_id')
          .eq('game_id', gameId)
        if (err) {
          throw err
        }
        for (let i = 0; i < data.length; i++) {
          let { data: user, error: profileErr } = await supabase
            .from('profiles')
            .select('*, countries (name, flag_url)')
            .eq('id', data[i].user_id)
          if (profileErr) {
            throw profileErr
          }
          this.loadUser(user[0])
        }
        await this.assignPlayerIds()
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
          user_id: (await supabase.auth.getSession()).data.session.user.id,
        }
      })
      this.socket.on('disconnect', async () => {
        console.log('Disconnected from server')
      })
      this.socket.on('playerDisconnected', async (playerId) => {
        const player = this.players.find(p => p.id === playerId)
        const message = `${player.username} has disconnected from the game.`
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
        this.hand = hand
      })
      this.socket.on('startingPlayer', async (playerId) => {
        const player = this.players.find(p => p.id === playerId)
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
        this.players.find(p => p.id === player).hand.pop()
        this.$refs.board.placeDomino(domino, position)
      })
      this.socket.on('nextPlayerTurn', async (playerId) => {
        const player = this.players.find(p => p.id === playerId)
        this.currentPlayerTurn = player
      })
      this.socket.on('playerIntervalPassed', async (playerId) => {
        const player = this.players.find(p => p.id === playerId)
        const message = `${player.username} took too long and has passed their turn.`
        const notification = {
          player: player,
          message
        }
        this.pnotifications.push(notification)
      })
      this.socket.on('playerCannotPlay', async (playerId) => {
        const player = this.players.find(p => p.id === playerId)
        const message = `${player.username} cannot play and has passed their turn.`
        const notification = {
          player: player,
          message
        }
        this.pnotifications.push(notification)
      })
      this.socket.on('gameBlocked', async (data) => {
        const winner = this.players.find(p => p.id === data.winner)
        for(let i = 0; i < data.players.length; i++) {
          const player = this.players.find(p => p.id === data.players[i].id)
          player.hand = data.players[i].hand
        }
        this.winner = winner
      })
    },
    async assignPlayerIds() {
      // First put the current user at the bottom of the list
      const user = (await supabase.auth.getSession()).data.session.user;
      const player = this.players.find(p => p.id === user.id)
      if (player) {
        const playerIndex = this.players.indexOf(player)
        // Perform a rotation of the players array
        this.players = [...this.players.slice(playerIndex), ...this.players.slice(0, playerIndex)];
        console.log(this.players)
        for (let i = 0; i < this.players.length; i++) {
          this.players[i].nr = i + 1
        }
      }
    },
    loadUser(user) {
      const player = {
        id: user.id,
        username: user.username,
        flag_url: user.countries?.flag_url,
        country_name: user.countries?.name,
        avatar_url: user.avatar_url,
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
          const user = (await supabase.auth.getSession()).data.session.user;
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
      // if (!this.didIntro) {
      //   if (this.$refs.board.getNextPlacementOptions(selectedDomino) !== undefined) {
      //     setTimeout(() => {
      //       if (this.driverObj !== null) {
      //         this.driverObj.moveNext();
      //       }
      //     }, 100);
      //   }
      // }
    },
    playDomino(domino, selectedPosition) {
      if (this.currentPlayerTurn !== this.players[0]) return;
      // Retrieve the domino from the player's hand, it can be that the domino was rotated so we need to find the correct domino
      const dominoInHand = this.players[0].hand.find(x => x.top === domino.top && x.bottom === domino.bottom || x.top === domino.bottom && x.bottom === domino.top);
      this.players[0].hand = this.players[0].hand.filter(d => d !== dominoInHand);
      // Send the domino to the server
      console.log(selectedPosition)
      const data = {
        domino: dominoInHand,
        position: selectedPosition
      }
      this.socket.emit('playDomino', data);
      // if (!this.didIntro) {
      //   this.driverObj.destroy();
      //   this.didIntro = true;
      //   localStorage.setItem('didIntro', true);
      // }
    },
  },
  async mounted() {
    document.body.classList.add('overflow-hidden');
    await this.loadGameData()
  },
  async beforeUnmount() {
    document.body.classList.remove('overflow-hidden');
    if (this.socket) {
      this.socket.disconnect()
    }
  },
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