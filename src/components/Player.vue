<template>
    <div>
        <PlayerHand :hand="hand" @on-selected-domino="selectedDomino" />
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
    },
    data() {
        return {
        }
    },
    methods: {
        selectedDomino(domino) {
            this.$emit('on-selected-domino', domino);
        }
    }
}
</script>
<style>
    
</style>