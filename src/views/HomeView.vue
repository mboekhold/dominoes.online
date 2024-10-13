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
        <div class="mt-5">
          <div class="w-full flex items-center p-2 lg:p-10 bg-night-dark-3 rounded-md">
            <div class="h-16 w-12 rounded-md bg-[#3b2c2e] text-3xl flex items-center justify-center text-orange-500">
              1
            </div>
            <div>
              <img src="https://ui-avatars.com/api/?name=AA&background=8e44ad&color=fff"
                class="ml-5 w-20 h-20 rounded-md border-yellow-500 border-2">
            </div>
            <div class="ml-5">
              <div class="text-xl lg:text-3xl uppercase">
                Assad Asimeier
              </div>
              <div class="w-fit relative">
                <div class="flex items-center text-sm mt-2">
                  <div class="text-blue-400">61%</div>
                  <div class="text-xs ml-1 text-gray-500"> / </div>
                  <div class="ml-1"> 121 games</div>
                </div>
                <div class="w-full h-1 bg-blue-400 rounded-md" style="background-color: rgba(96, 165, 250, 0.2);">
                  <div class="w-1/2 rounded-md bg-blue-400 h-1 z-10"></div>
                </div>

              </div>
            </div>
          </div>
        </div>
        <div class="mt-5 grid grid-cols-2 lg:grid-cols-4 gap-5">
          <div class="h-44 bg-night-dark-3 rounded-md">

          </div>
          <div class="h-44 bg-night-dark-3 rounded-md">

          </div>
          <div class="h-44 bg-night-dark-3 rounded-md">

          </div>
          <div class="h-44 bg-night-dark-3 rounded-md">

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
    }
  }
}
</script>