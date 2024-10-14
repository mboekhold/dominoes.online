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
        <div class="mt-5" v-if="leaderBoard.length > 0">
          <div class="relative w-full h-36 flex items-start p-2 lg:p-8 bg-night-dark-3 rounded-md">
            <div class="font-bold h-12 w-10 lg:h-16 lg:w-12 rounded-md bg-[#3b2c2e] text-3xl flex items-center justify-center text-orange-500">
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
          <div v-for="rank in leaderBoard.slice(1)">
            <div class="bg-night-dark-3 rounded-md p-2 relative lg:h-32">
              <div class="flex">
                <div class="h-8 w-6 lg:h-12 lg:w-10 rounded-md bg-[#2c2e3b] font-bold lg:text-3xl flex items-center justify-center text-white">
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
                <div class="relative lg:absolute lg:left-1/2 lg:-translate-x-1/2 bottom-0 rounded-md lg:p-5 ml-auto lg:ml-0 lg:mt-5">
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
    playComputer() {
      this.$router.push({ name: 'computer' });
    },
    playOnline() {
      this.$router.push({ name: 'online' });
    },
    loadLeaderBoard() {
      for (let i = 0; i < 5; i++) {
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