<template>
  <div class="ml-20">
    <div v-if="loading">
      <div>
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 loader"></div>
      </div>
    </div>
    <div v-else class="px-20 pt-5 relative text-gray-200">
      <Board ref="board" :dominoSet="dominoSet" :dealing="dealingDominoes" />
      <Player v-if="players[0]" :player="players[0]"
        :turn="currentPlayerTurn === 0" />
      <Player :player="players[1]" :turn="currentPlayerTurn === 1" />
      <Player :player="players[2]" :turn="currentPlayerTurn === 2" />
      <Player :player="players[3]" :turn="currentPlayerTurn === 3" />
      <!-- Current player -->
      
    </div>
  </div>
</template>
<script>
import { supabase } from '../supabase';
import Board from '../components/Board.vue'
import Player from '../components/Player.vue'
export default {
  components: {
    Board, Player
  },
  data() {
    return {
      loading: true,
      game: null,
      players: [],
      dominoSet: [],
      dealingDominoes: false,
      currentPlayerTurn: 0,
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
            .select('*')
            .eq('id', data[i].user_id)
          if (profileErr) {
            throw profileErr
          }
          this.loadUser(user[0])
        }
        await this.assignPlayerIds()
      } catch (error) {
        console.error(error)
      } finally {
        this.loading = false
      }
    },
    async assignPlayerIds() {
      // First put the current user at the bottom of the list
      const user = (await supabase.auth.getSession()).data.session.user;
      const player = this.players.find(p => p.id === user.id)
      if (player) {
        this.players.splice(this.players.indexOf(player), 1)
        this.players.unshift(player)
      }
      for (let i = 0; i < this.players.length; i++) {
        this.players[i].nr = i + 1
      }
      console.log(this.players)
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
    loadUser(user) {
      user.hand = []
      this.players.push(user)
    }
  },
  async mounted() {
    document.body.classList.add('overflow-hidden');
    await this.loadGameData()
  },
  beforeUnmount() {
    document.body.classList.remove('overflow-hidden');
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