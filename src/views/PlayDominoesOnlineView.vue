<!-- GAME MANAGER -->
<template>
    <div class="ml-20">
        <div class="px-20 pt-5 relative text-gray-200">
            <div class="flex flex-col md:flex-row gap-10">
                <Leaderboard class="w-full" />
                <div class="w-full h-[600px] bg-night-dark-3 rounded-lg overflow-hidden">
                    <Transition>
                        <PlayerCard :loading="loading" :user="user" :user_profile="user_profile" v-if="showPlayerCard" @find-match="findMatch()" />
                    </Transition>
                    <Transition>
                        <FindingMatchCard v-if="showFindingMatch" @go-back="goBack()" />
                    </Transition>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import Board from '@/components/Board.vue';
import PlayerCard from '@/components/PlayerCard.vue';
import FindingMatchCard from '@/components/FindingMatchCard.vue';
import Leaderboard from '@/components/Leaderboard.vue';
export default {
    props:{
        loading: Boolean,
        user: Object,
        user_profile: Object,
        authenticated: Boolean
    },
    components: {
        Board,
        PlayerCard,
        FindingMatchCard,
        Leaderboard
    },
    data() {
        return {
            showPlayerCard: true,
            showFindingMatch: false
        }
    },
    methods: {
        findMatch() {
            this.showPlayerCard = false
            setTimeout(() => {
                this.showFindingMatch = true
            }, 200)
        },
        goBack() {
            this.showFindingMatch = false

            setTimeout(() => {
                this.showPlayerCard = true
            }, 200)
        }
    },
    watch: {
        loading(newVal, oldVal) {
            if (newVal === false) {
                if (!this.authenticated) {
                    this.$router.push({ name: 'login' });
                }
            }
        }
    }
}
</script>

<style scoped>
.v-enter-active,
.v-leave-active {
    transition: transform 0.1s ease-out;
}

.v-enter-from {
    transform: translateX(50%);
}

.v-leave-to {
    transform: translateX(-20%);
}
</style>