<template>
  <div>
    <HeaderComponent />
    <div class="grid sm:grid-cols-4 gap-5 p-2 sm:p-10">
      <div v-for="room in rooms">
        <div>
          <RoomComponent :room="room" />
        </div>
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

<style>
body {
  @apply bg-gray-900;
}
</style>