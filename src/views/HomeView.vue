<template>
  <div class="ml-20">
    <div class="p-2 lg:px-20 flex flex-col-reverse lg:flex-row text-white mt-10">
      <div class="w-full mt-10 mb-10 md:mb-0">
        <img src="@/assets/game_screenshotx.png" alt="Game Screenshot" />
      </div>
      <div class="lg:ml-10 w-full p-6 lg:p-10 mb-20">
        <div class="font-bold text-5xl md:text-6xl text-center">
          Play Dominoes Online
        </div>
        <div class="mt-5 text-center">
          Be part of the largest growing Dominoes community. Compete in tournaments and climb to the top of the
          leaderboard.
        </div>
        <div class="mt-10 w-full mx-auto md:w-1/2 lg:w-full px-6">
          <button @click="playOnline()" class="block text-center hover:bg-blue-500 bg-blue-600 text-gray-200 p-4 rounded-lg h-16 w-full text-xl font-bold">
            Play Online
          </button>
          <button @click="playComputer()" class="block text-center bg-custom-dark border border-gray-600 hover:bg-custom-dark-3  text-gray-200 p-4 rounded-lg h-16 w-full text-xl mt-5 font-bold">
            Play Computer
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
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