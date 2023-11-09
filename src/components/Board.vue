<template>
  <div class="h-screen w-screen flex items-center justify-center">
    <div v-for="domino in playedDominos">
        <Domino :topDots="domino.top" :bottomDots="domino.bottom" :placeHorizontal="!isDouble(domino)" />
    </div>
    <div class="flex">
        <div v-if="selectedDomino" :class="{'domino-placeholder-horizontal': !isDouble(selectedDomino), 'domino-placeholder-vertical': isDouble(selectedDomino)}" @click="playSelectedDomino()">
        </div>
    </div>
  </div>
</template>
<script>
import Domino from './Domino.vue';
export default {
    props: {
        playedDominos: {
            type: Array,
            required: true
        },
        selectedDomino: {
            type: Object,
            required: false
        },
    },
    methods: {
        playSelectedDomino() {
            this.$emit('on-play-selected-domino', this.selectedDomino);
        },
        isDouble(domino) {
            return domino.top === domino.bottom;
        }
    },
    components: { Domino },
}
</script>
<style>
body {
  @apply bg-blue-500;
}
.domino-placeholder-vertical {
    @apply rounded-lg border border-yellow-200 h-24 w-14 px-1 flex justify-between flex-col relative cursor-pointer;
}
.domino-placeholder-horizontal {
    @apply rounded-lg border border-yellow-200 h-14 w-24 px-1 flex justify-between flex-col relative cursor-pointer;
}
</style>
