<template>
  <div class="lg:ml-20">
    <div class="p-2 lg:px-20 2xl:px-64 mx-auto text-white mt-10">
      <div class="flex flex-col-reverse lg:flex-row">
        <div class="w-full mt-10 mb-10 md:mb-0">
          <img src="@/assets/game_screenshot.png" alt="Game Screenshot" />
        </div>
        <div class="lg:ml-10 w-full lg:p-10 mb-20">
          <div class="font-bold text-5xl md:text-6xl text-center">
            Play Dominoes Online
          </div>
          <div class="mt-10 text-xl lg:text-2xl text-center">
            Be part of the largest growing Dominoes community. Compete in tournaments and climb to the top of the
            leaderboard.
          </div>
          <div class="mt-20 w-full mx-auto md:w-1/2 lg:w-full px-6">
            <button @click="playOnline()"
              class="block text-center hover:bg-blue-500 bg-blue-600 text-gray-200 p-4 rounded-lg h-16 w-full text-xl font-bold">
              Play Online
            </button>
            <button @click="playComputer()"
              class="block text-center bg-night-dark border border-gray-600 hover:bg-night-dark-3  text-gray-200 p-4 rounded-lg h-16 w-full text-xl mt-5 font-bold">
              Play Computer
            </button>
          </div>
        </div>
      </div>
      <div class="mt-10 mb-20">
        <div class="text-3xl font-bold">
          Beat the top players
        </div>
        <div v-if="loadingLeaderBoard" class="mt-10 bg-night-dark-3 rounded-md h-80 w-full relative">
          <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <svg class="animate-spin h-8 w-8 text-white mr-2 " xmlns="http://www.w3.org/2000/svg" fill="none"
              viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4">
              </circle>
              <path class="opacity-75" fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
              </path>
            </svg>
          </div>
        </div>
        <div v-else>
          <div class="mt-5" v-if="leaderBoard.length > 0">
            <div class="relative w-full h-36 flex items-start p-2 lg:p-8 bg-night-dark-3 rounded-md">
              <div
                class="font-bold h-12 w-10 lg:h-16 lg:w-12 rounded-md bg-[#3b2c2e] text-3xl flex items-center justify-center text-orange-500">
                1
              </div>
              <div>
                <img v-if="leaderBoard[0].player" :src="getUserAvatar(leaderBoard[0].player)" alt="Player avatar"
                  class="ml-5 w-20 h-20 rounded-md border-yellow-500 border-2">
                <div v-else class="ml-5 w-12 h-12 lg:w-20 lg:h-20 rounded-md border-yellow-500 border-2">
  
                </div>
              </div>
              <div class="ml-5">
                <div class="text-xl lg:text-3xl uppercase">
                  {{ leaderBoard[0].player ? leaderBoard[0].player.username : '---' }}
                </div>
                <div class="flex items-center">
                  <img v-if="leaderBoard[0].player"
                    :src="leaderBoard[0].player ? leaderBoard[0].player.countries.flag_url : ''" alt="Country flag"
                    class="w-6 rounded-sm">
                  <div class="text-xs ml-1">
                    {{ leaderBoard[0].player ? leaderBoard[0].player.countries.name : '---' }}
                  </div>
                </div>
                <div class="w-fit absolute lg:relative left-5 bottom-4 lg:left-0 lg:bottom-0">
                  <div class="flex items-center text-sm  mt-2">
                    <div class="text-blue-400">{{ leaderBoard[0].player ? getWinPercentage(leaderBoard[0].player) + '%' :
                      '----' }}
                    </div>
                    <div class="text-xs ml-1 text-gray-500"> / </div>
                    <div class="ml-1"> {{ leaderBoard[0].player ? leaderBoard[0].player.games_played + ' games' :
                      '----' }}</div>
                  </div>
                  <div class="w-full h-1 bg-blue-400 rounded-md" style="background-color: rgba(96, 165, 250, 0.2);">
                    <div :style="[`width: ${getWinPercentage(leaderBoard[0].player)}%`]"
                      class="rounded-md bg-blue-400 h-1 z-10">
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="mt-3 grid grid-cols-1 lg:grid-cols-4 gap-3">
            <div v-for="rank in leaderBoard.slice(1)">
              <div class="bg-night-dark-3 rounded-md p-2 relative lg:h-32">
                <div class="flex">
                  <div
                    class="h-8 w-6 lg:h-12 lg:w-10 rounded-md bg-[#2c2e3b] font-bold lg:text-3xl flex items-center justify-center text-white">
                    {{ rank.nr }}
                  </div>
                  <div>
                    <img v-if="rank.player" :src="getUserAvatar(rank.player)" alt="Player avatar"
                      class="ml-5 w-8 h-8 lg:w-12 lg:h-12 rounded-md border-yellow-500 border-2">
                    <div v-else class="ml-5 w-8 h-8 lg:w-12 lg:h-12 rounded-md border-yellow-500 border-2">
                    </div>
                  </div>
                  <div class="ml-5">
                    <div>
                      {{ rank.player ? rank.player.username : '---' }}
                    </div>
                    <div class="flex items-center text-xs">
                      <img v-if="rank.player" :src="rank.player ? rank.player.countries.flag_url : ''" alt="Country flag"
                        class="w-4 rounded-sm">
                      <div class="text-xs ml-1">
                        {{ rank.player ? rank.player.countries.name : '---' }}
                      </div>
                    </div>
                  </div>
                  <div
                    class="relative lg:absolute lg:left-1/2 lg:-translate-x-1/2 bottom-0 rounded-md lg:p-5 ml-auto lg:ml-0 lg:mt-5">
                    <div class="mx-auto w-fit relative">
                      <div class="flex items-center text-sm lg:mt-2">
                        <div class="text-blue-400">{{ rank.player ? getWinPercentage(rank.player) + '%' : '----' }}</div>
                        <div class="text-xs ml-1 text-gray-500"> / </div>
                        <div class="ml-1"> {{ rank.player ? rank.player.games_played + ' games' : '----' }}</div>
                      </div>
                      <div class="w-full h-1 bg-blue-400 rounded-md" style="background-color: rgba(96, 165, 250, 0.2);">
                        <div :style="[`width: ${getWinPercentage(rank.player)}%`]"
                          class="rounded-md bg-blue-400 h-1 z-10">
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { supabase } from '../supabase';
import { getUserAvatar } from '../utils';
export default {
  data() {
    return {
      leaderBoard: [],
      loadingLeaderBoard: false
    }
  },
  methods: {
    getUserAvatar,
    playComputer() {
      this.$router.push({ name: 'computer' });
    },
    playOnline() {
      this.$router.push({ name: 'online' });
    },
    getWinPercentage(player) {
      if (player) {
        return ((player.wins / player.games_played) * 100).toFixed(0)
      } else {
        return 0
      }
    },
    async loadLeaderBoard() {
      this.loadingLeaderBoard = true
      for (let i = 0; i < 5; i++) {
        const rank = {
          nr: i + 1,
          player: false
        }
        this.leaderBoard.push(rank)
      }
      try {
        const { data, error } = await supabase.from('profiles').select('*, countries (name, flag_url)').gt('wins', 0).order('wins', {
          ascending: false
        }).limit(5)
        if (error) {
          throw error
        }
        data.forEach((player, index) => {
          this.leaderBoard[index].player = player
        })
      } catch (error) {
        console.error(error)
      } finally {
        this.loadingLeaderBoard = false
      }
    },
  },
  mounted() {
    this.loadLeaderBoard()
  }
}
</script>