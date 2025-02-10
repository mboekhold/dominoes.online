<template>
    <div>
        <div v-for="domino in hand">
            <div :class="'player' + playerId + '-domino'">

            </div>
        </div>
    </div>
</template>
<script>
import OpponentDomino from './OpponentDomino.vue';
export default {
    components: { OpponentDomino },
    props: {
        hand: {
            type: Array,
            required: true
        },
        playerId: {
            type: Number,
            required: true
        },
    },
}
</script>
<style>
.player2-domino {
    @apply bg-white rounded-lg border border-black h-8 w-14 py-1 flex justify-between flex-row relative -mt-3.5;
}

.player3-domino {
    @apply bg-white rounded-lg border border-black h-14 w-8 py-1 flex-row justify-between relative -ml-3;
}

.player4-domino {
    @apply bg-white rounded-lg border border-black h-8 w-14 py-1 justify-between flex-row relative -mt-3.5;
}

@media screen and (max-width: 1024px) {
    .player2-domino {
        @apply h-6 w-10 -mt-2;
    }
    .player3-domino {
        @apply h-10 w-6 -ml-2;
    }
    .player4-domino {
        @apply h-6 w-10 -mt-2;
    }
}
</style>