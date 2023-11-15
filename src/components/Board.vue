<template>
  <div class="h-screen w-screen flex items-center justify-center">
    <div v-if="playableDomino">
        <div v-if="playableDomino.placement === 0">
            <div :class="{'domino-placeholder-horizontal': !isDouble(playableDomino.domino), 'domino-placeholder-vertical': isDouble(playableDomino.domino)}" @click="playDomino()">
                </div>
        </div>
    </div>
    <div v-for="domino in playedDominos">
        <Domino :domino="domino" :placeHorizontal="!isDouble(domino)" />
    </div>
    <div class="flex">
        <div v-if="playableDomino">
            <div v-if="playableDomino.placement !== 0">
                <div :class="{'domino-placeholder-horizontal': !isDouble(playableDomino.domino), 'domino-placeholder-vertical': isDouble(playableDomino.domino)}" @click="playDomino()">
                </div>
            </div>
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
        playableDomino: {
            type: Object,
            required: false
        },
    },
    methods: {
        playDomino() {
            this.$emit('on-play-domino', this.playableDomino.domino, this.playableDomino.placement);
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
