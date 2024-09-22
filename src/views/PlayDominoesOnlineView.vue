<!-- GAME MANAGER -->
<template>
    <div class="ml-20">
        <div class="px-20 pt-5 relative text-gray-200">
            <div class="flex flex-col md:flex-row gap-10">
                <div class="w-full border rounded-lg border-gray-700">
                    <div class="flex p-5">
                        <div>
                            <div>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                                    class="size-6">
                                    <path
                                        d="M18.375 2.25c-1.035 0-1.875.84-1.875 1.875v15.75c0 1.035.84 1.875 1.875 1.875h.75c1.035 0 1.875-.84 1.875-1.875V4.125c0-1.036-.84-1.875-1.875-1.875h-.75ZM9.75 8.625c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-.75a1.875 1.875 0 0 1-1.875-1.875V8.625ZM3 13.125c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v6.75c0 1.035-.84 1.875-1.875 1.875h-.75A1.875 1.875 0 0 1 3 19.875v-6.75Z" />
                                </svg>
                            </div>
                        </div>
                        <div class="ml-2 font-bold text-xl">
                            Leaderboard
                        </div>
                    </div>
                    <div class="w-full h-[1px] bg-gray-700"></div>
                    <div class="p-5 rounded-full h-[500px]">
                        <table class="w-full rounded-full">
                            <thead class="border-gray-600 bg-custom-dark-3 text-gray-500">
                                <tr class="text-sm">
                                    <th scope="col" class="rounded-l-full text-left px-6">Rank</th>
                                    <th scope="col" class="text-left px-6 whitespace-nowrap">Name</th>
                                    <th class="text-left px-6">Played</th>
                                    <th class="rounded-r-full text-left px-6">Won</th>
                                </tr>
                            </thead>
                            <tbody class="space-y-4">
                                <!-- <tr>
                                    <td class="px-6 py-4 text-right text-gray-400">#1</td>
                                    <td class="px-6 py-4">
                                        <div class="flex items-center pr-20">
                                            <img :src="user.picture" class="h-8 w-8">
                                            <div class="ml-2">
                                                John Doe
                                            </div>
                                        </div>
                                    </td>
                                    <td class="px-6 py-4">10</td>
                                    <td class="px-6 py-4">5</td>
                                </tr> -->
                            </tbody>
                        </table>
                    </div>
                </div>
                <div class="w-full h-[600px] bg-custom-dark-3 rounded-lg overflow-hidden">
                    <Transition>
                        <PlayerCard v-if="showPlayerCard" @find-match="findMatch()" />
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
export default {
    components: {
        Board,
        PlayerCard,
        FindingMatchCard
    },
    data() {
        return {
            isLoading: this.$auth0.isLoading,
            isAuthenticated: this.$auth0.isAuthenticated,
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
        isLoading(newVal, oldVal) {
            if (newVal === false) {
                if (!this.isAuthenticated) {
                    this.$router.push({ name: 'home' });
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