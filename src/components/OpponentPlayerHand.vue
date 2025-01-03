<template>
    <div>
        <div v-for="domino in hand">
            <div :class="'player' + playerId + '-domino'">

            </div>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        hand: {
            type: Array,
            required: true
        },
        playerId: {
            type: Number,
            required: true
        }
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
    @apply bg-white rounded-lg border border-black h-8 w-14 py-1  justify-between flex-row relative -mt-3.5;
}
</style>