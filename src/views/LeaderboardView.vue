<template>
  <div class="lg:ml-20 p-2 mt-10 lg:px-48 py-5 text-white">
    <div class="text-4xl">
      Leaderboard
    </div>
    <div v-if="loading" class="mt-10 bg-night-dark-3 rounded-md h-96 w-full relative">
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
      <div class="mt-10" v-if="!loading && leaderBoard.length > 0">
        <div class="relative w-full h-28 lg:h-36 flex items-start p-2 lg:p-8 bg-night-dark-3 rounded-md">
          <div></div>
          <div
            class="font-bold h-12 w-10 lg:h-16 lg:w-12 rounded-md bg-[#3b2c2e] text-3xl flex items-center justify-center text-orange-500">
            1
          </div>
          <div>
            <img v-if="leaderBoard[0].player" :src="getUserAvatar(leaderBoard[0].player)" alt="Player avatar"
              class="ml-5 w-12 h-12 lg:w-20 lg:h-20 rounded-md border-yellow-500 border-2">
            <div v-else class="ml-5 w-12 h-12 lg:w-20 lg:h-20 rounded-md border-yellow-500 border-2">
            </div>
          </div>
          <div class="ml-5">
            <div class="text-xl lg:text-3xl uppercase">
              {{ leaderBoard[0].player.username ? leaderBoard[0].player.username : '---' }}
            </div>
            <div class="flex items-center">
              <img :src="leaderBoard[0].player ? leaderBoard[0].player.countries.flag_url : ''" alt="Country flag"
                class="w-6 rounded-sm">
              <div class="text-xs ml-1">
                {{ leaderBoard[0].player ? leaderBoard[0].player.countries.name : '---' }}
              </div>
            </div>
            <div class="w-fit absolute lg:relative left-5 bottom-2 lg:left-0 lg:bottom-0">
              <div class="flex items-center text-sm  mt-2">
                <div class="text-blue-400">{{ leaderBoard[0].player.wins ? getWinPercentage(leaderBoard[0].player) + '%'
                  :
                  '----' }}</div>
                <div class="text-xs ml-1 text-gray-500"> / </div>
                <div class="ml-1 text-gray-300"> {{ leaderBoard[0].player ? leaderBoard[0].player.games_played : '----'
                  }}
                  <span v-if="leaderBoard[0].player">games</span>
                </div>
              </div>
              <div class="w-full h-1 bg-blue-200 rounded-md" style="background-color: rgba(96, 165, 250, 0.2);">
                <div :style="[`width: ${getWinPercentage(leaderBoard[0].player)}%`]"
                  class="rounded-md bg-blue-400 h-1 z-10"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="mt-3 grid grid-cols-1 lg:grid-cols-4 gap-3">
        <div v-for="rank in leaderBoard.slice(1, 5)">
          <div class="bg-night-dark-3 md:h-32 rounded-md p-2 relative">
            <div class="flex gap-2 items-center">
              <div
                class="min-h-8 min-w-8 rounded-md bg-[#2c2e3b] font-bold text-lg flex items-center justify-center text-white">
                {{ rank.nr }}
              </div>
              <div>
                <img v-if="rank.player" :src="getUserAvatar(rank.player)" alt="Player avatar"
                  class="min-h-10 min-w-10 lg:w-10 lg:h-10 rounded-md border-yellow-500 border-2">
                <div v-else class="min-h-10 min-w-10 lg:w-10 lg:h-10 rounded-md border-yellow-500 border-2">
                </div>
              </div>
              <div class="w-full overflow-hidden text-ellipsis">
                <div>
                  {{ rank.player ? rank.player.username : '---' }}
                </div>
                <div class="text-xs flex items-center">
                  <img v-if="rank.player.countries" :src="rank.player.countries ? rank.player.countries.flag_url : ''"
                    alt="Country flag" class="w-6 rounded-sm">
                  <div class="ml-1 truncate text-xs">
                    {{ rank.player.countries ? rank.player.countries.name : '' }}
                  </div>
                </div>
              </div>
              <div>
              </div>
              <div
                class="relative lg:absolute lg:left-1/2 lg:-translate-x-1/2 bottom-0 rounded-md lg:p-5 ml-auto lg:ml-0 lg:mt-5 w-full">
                <div class="mx-auto w-fit relative">
                  <div class="flex items-center text-sm lg:mt-2">
                    <div class="text-blue-400">{{ rank.player ? getWinPercentage(rank.player) + '%' : '----' }}</div>
                    <div class="text-xs ml-1 text-gray-500"> / </div>
                    <div class="ml-1"> {{ rank.player ? rank.player.games_played : '----' }} <span
                        v-if="rank.player">games</span> </div>
                  </div>
                  <div class="w-full h-1 bg-blue-400 rounded-md" style="background-color: rgba(96, 165, 250, 0.2);">
                    <div :style="[`width: ${getWinPercentage(rank.player)}%`]" class="rounded-md bg-blue-400 h-1 z-10">
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="mt-3 bg-night-dark-3 rounded-md">
        <div v-for="rank in leaderBoard.slice(5)">
          <div class="p-4 relative border-b border-gray-600">
            <div class="flex items-center">
              <div
                class="p-2 h-8 w-6 lg:h-12 lg:w-10 rounded-md bg-[#2c2e3b] font-bold lg:text-3xl flex items-center justify-center text-white">
                {{ rank.nr }}
              </div>
              <div class="text-xs flex items-center">
                <img v-if="rank.player" :src="getUserAvatar(rank.player)" alt="Player avatar"
                  class="ml-5 w-8 h-8 lg:w-12 lg:h-12 rounded-md border-yellow-500 border-2">
                <div v-else class="ml-5 w-8 h-8 lg:w-12 lg:h-12 rounded-md border-yellow-500 border-2">
                </div>
              </div>
              <div class="ml-2">
                <div>
                  {{ rank.player ? rank.player.username : '---' }}
                </div>
                <div>
                  <div class="text-xs flex items-center">
                  <img v-if="rank.player.countries" :src="rank.player.countries ? rank.player.countries.flag_url : ''"
                    alt="Country flag" class="w-6 rounded-sm">
                  <div class="ml-1 truncate text-xs">
                    {{ rank.player.countries ? rank.player.countries.name : '' }}
                  </div>
                </div>
              </div>
            </div>
            <div class="relative rounded-md ml-auto">
              <div class="mx-auto w-fit relative">
                <div class="flex items-center text-sm">
                  <div class="text-blue-400">{{ rank.player ? getWinPercentage(rank.player) + '%' : '----' }}</div>
                  <div class="text-xs ml-1 text-gray-500"> / </div>
                  <div class="ml-1"> {{ rank.player ? rank.player.games_played : '----' }} <span
                      v-if="rank.player">games</span> </div>
                </div>
                <div class="w-full h-1 bg-blue-400 rounded-md" style="background-color: rgba(96, 165, 250, 0.2);">
                  <div :style="[`width: ${getWinPercentage(rank.player)}%`]" class="rounded-md bg-blue-400 h-1 z-10">
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
      loading: false
    }
  },
  methods: {
    getUserAvatar,
    async loadLeaderBoard() {
      this.loading = true
      for (let i = 0; i < 100; i++) {
        const rank = {
          nr: i + 1,
          player: false
        }
        this.leaderBoard.push(rank)
      }
      try {
        const { data, error } = await supabase.from('profiles').select('*, countries (name, flag_url)').gt('wins', 0).order('wins', {
          ascending: false
        }).limit(100)
        if (error) {
          throw error
        }
        data.forEach((player, index) => {
          this.leaderBoard[index].player = player
        })
      } catch (error) {
        console.error(error)
      } finally {
        this.loading = false
      }
    },
    getWinPercentage(player) {
      if (player) {
        return ((player.wins / player.games_played) * 100).toFixed(0)
      } else {
        return 0
      }
    }
  },
  mounted() {
    this.loadLeaderBoard()
  }
}
</script>
<style></style>