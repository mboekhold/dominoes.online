<template>
  <div class="lg:ml-20 p-2 mt-10 lg:px-48 py-5 text-white">
    <div class="text-4xl">
      Leaderboard
    </div>
    <div class="mt-10" v-if="leaderBoard.length > 0">
      <div class="relative w-full h-36 flex items-start p-2 lg:p-8 bg-night-dark-3 rounded-md">
        <div
          class="font-bold h-12 w-10 lg:h-16 lg:w-12 rounded-md bg-[#3b2c2e] text-3xl flex items-center justify-center text-orange-500">
          1
        </div>
        <div>
          <img v-if="leaderBoard[0].player" src="https://ui-avatars.com/api/?name=AA&background=8e44ad&color=fff"
            class="ml-5 w-20 h-20 rounded-md border-yellow-500 border-2">
          <div v-else class="ml-5 w-12 h-12 lg:w-20 lg:h-20 rounded-md border-yellow-500 border-2">
          </div>
        </div>
        <div class="ml-5">
          <div class="text-xl lg:text-3xl uppercase">
            {{ leaderBoard[0].player ? leaderBoard[0] : '---' }}
          </div>
          <div class="w-fit absolute lg:relative left-5 bottom-4 lg:left-0 lg:bottom-0">
            <div class="flex items-center text-sm  mt-2">
              <div class="text-blue-400">{{ leaderBoard[0].player ? leaderBoard[0] : '----' }}</div>
              <div class="text-xs ml-1 text-gray-500"> / </div>
              <div class="ml-1"> {{ leaderBoard[0].player ? leaderBoard[0] : '----' }}</div>
            </div>
            <div class="w-full h-1 bg-blue-400 rounded-md" style="background-color: rgba(96, 165, 250, 0.2);">
              <div :class="[`w-${getWinPercentage(leaderBoard[0])}`]" class="rounded-md bg-blue-400 h-1 z-10"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="mt-3 grid grid-cols-1 lg:grid-cols-4 gap-3">
      <div v-for="rank in leaderBoard.slice(1, 5)">
        <div class="bg-night-dark-3 rounded-md p-2 relative lg:h-32">
          <div class="flex">
            <div
              class="h-8 w-6 lg:h-12 lg:w-10 rounded-md bg-[#2c2e3b] font-bold lg:text-3xl flex items-center justify-center text-white">
              {{ rank.nr }}
            </div>
            <div>
              <img v-if="rank.player">
              <div v-else class="ml-5 w-8 h-8 lg:w-12 lg:h-12 rounded-md border-yellow-500 border-2">

              </div>
            </div>
            <div class="ml-5">
              {{ rank.player ? rank : '---' }}
            </div>
            <div
              class="relative lg:absolute lg:left-1/2 lg:-translate-x-1/2 bottom-0 rounded-md lg:p-5 ml-auto lg:ml-0 lg:mt-5">
              <div class="mx-auto w-fit relative">
                <div class="flex items-center text-sm lg:mt-2">
                  <div class="text-blue-400">{{ leaderBoard[0].player ? leaderBoard[0] : '----' }}</div>
                  <div class="text-xs ml-1 text-gray-500"> / </div>
                  <div class="ml-1"> {{ leaderBoard[0].player ? leaderBoard[0] : '----' }}</div>
                </div>
                <div class="w-full h-1 bg-blue-400 rounded-md" style="background-color: rgba(96, 165, 250, 0.2);">
                  <div :class="[`w-${getWinPercentage(leaderBoard[0])}`]" class="rounded-md bg-blue-400 h-1 z-10">
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
          <div class="flex">
            <div
              class="p-2 h-8 w-6 lg:h-12 lg:w-10 rounded-md bg-[#2c2e3b] font-bold lg:text-3xl flex items-center justify-center text-white">
              {{ rank.nr }}
            </div>
            <div>
              <img v-if="rank.player">
              <div v-else class="ml-5 w-8 h-8 lg:w-12 lg:h-12 rounded-md border-yellow-500 border-2">

              </div>
            </div>
            <div class="ml-5">
              {{ rank.player ? rank : '---' }}
            </div>
            <div
              class="relative rounded-md ml-auto">
              <div class="mx-auto w-fit relative">
                <div class="flex items-center text-sm">
                  <div class="text-blue-400">{{ leaderBoard[0].player ? leaderBoard[0] : '----' }}</div>
                  <div class="text-xs ml-1 text-gray-500"> / </div>
                  <div class="ml-1"> {{ leaderBoard[0].player ? leaderBoard[0] : '----' }}</div>
                </div>
                <div class="w-full h-1 bg-blue-400 rounded-md" style="background-color: rgba(96, 165, 250, 0.2);">
                  <div :class="[`w-${getWinPercentage(leaderBoard[0])}`]" class="rounded-md bg-blue-400 h-1 z-10">
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
export default {
  data() {
    return {
      leaderBoard: []
    }
  },
  methods: {
    loadLeaderBoard() {
      for (let i = 0; i < 100; i++) {
        const rank = {
          nr: i + 1,
          player: false
        }
        this.leaderBoard.push(rank)
      }
    },
    getWinPercentage(player) {
      if (player) {
        // return data
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