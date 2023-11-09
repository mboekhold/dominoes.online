<template>
    <div>
        <PlayerHand :hand="hand" />
    </div>
</template>
<script>
import PlayerHand from './PlayerHand.vue';
export default {
    components: {
        PlayerHand
    },
    props: {
        hand: {
            type: Array,
            required: true
        },
    }
}
</script>
<style>
    
</style>