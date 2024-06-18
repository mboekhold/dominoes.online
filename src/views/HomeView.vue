<template>
  <div>
    <HeaderComponent />
    <div class="p-2 sm:p-10 lg:flex items-center text-white mt-20">
      <div class="w-full lg:w-1/2 mb-20">
        <div class="rounded-xl border border-gray-600 px-4 py-1  w-fit">
          Releasing multiplayer after receiving 150 votes. <a href="" class="hover:text-blue-400 text-blue-500">Vote now <span aria-hidden="true">&rarr;</span></a>
        </div>
        <div class="font-bold text-5xl lg:text-6xl mt-10">
          Play Dominoes Online
        </div>
        <div class="mt-5">
          Be part of the largest growing Dominoes community. Compete in tournaments and climb to the top of the leaderboard.
        </div>
        <div class="flex items-center mt-10">
          <div>
            <router-link to="/practice" class="hover:bg-blue-600 bg-blue-700 text-white px-4 py-2 rounded-lg">Play for free</router-link>
          </div>
          <button class="px-4 py-2 flex items-center">
            <div class="mr-2">
              Learn more
            </div>
            <span aria-hidden="true">&rarr;</span>
          </button>
        </div>
      </div>
      <div class="w-full lg:w-1/2">
        <img src="@/assets/game_screenshot.png" alt="Game Screenshot" />
      </div>
    </div>
  </div>
</template>

<script>
import HeaderComponent from '../components/HeaderComponent.vue'
import RoomComponent from '../components/RoomComponent.vue'
export default {
  components: {
    HeaderComponent,
    RoomComponent
  },
  data() {
    return {
      rooms: []
    }
  },
  methods: {
    async getRooms() {
      for (let i = 1; i < 5; i++) {
        let room = {
          "id": i,
          "name": "Room " + i,
          "players": []
        }
        this.rooms.push(room)
      }
    }
  },
  mounted() {
    this.getRooms()
  }
}
</script>