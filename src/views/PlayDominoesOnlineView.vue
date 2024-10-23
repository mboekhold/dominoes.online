<!-- GAME MANAGER -->
<template>
    <div class="lg:ml-20 p-2 mt-10 lg:px-48 py-5">
        <div class="relative text-gray-200">
            <div class="flex flex-col md:flex-row gap-10">
                <div class="w-full h-[600px] relative">
                    <div class="w-full h-full bg-night-dark-3 rounded-lg">
                        <div v-if="gameHistory.length === 0" class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                            <div class="text-2xl font-medium">
                                No games played yet
                            </div>
                        </div>
                    </div>
                </div>
                <div class="w-full h-[600px] bg-night-dark-3 rounded-lg overflow-hidden">
                    <Transition>
                        <PlayerCard :loading="loading" :user="user" :user_profile="user_profile" v-if="showPlayerCard"
                            @find-match="findMatch()" />
                    </Transition>
                    <Transition>
                        <FindingMatchCard :user_profile="user_profile" v-if="showFindingMatch" @go-back="goBack()" />
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
import { supabase } from '../supabase';
export default {
    components: {
        Board,
        PlayerCard,
        FindingMatchCard,
    },
    data() {
        return {
            showPlayerCard: true,
            showFindingMatch: false,
            loading: false,
            user: null,
            user_profile: null,
            authenticated: false,
            gameHistory: [],
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
        },
        async getUserProfile() {
            this.loading = true;
            try {
                this.user = (await supabase.auth.getSession()).data.session.user;
                const { data, error, status } = await supabase
                    .from('profiles')
                    .select(`id, username, avatar_url,
                    countries (
                        id,
                        name,
                        flag_url
                    )`)
                    .eq('id', this.user.id)
                    .single();

                if (error && status !== 406) throw error
                this.user_profile = data;

                if (data.avatar_url) {
                    let { data: file, error: err } = await supabase.storage.from('avatars').download(data.avatar_url)
                    if (err) throw err
                    if (file) {
                        const url = URL.createObjectURL(file)
                        this.user_profile.avatar_url = url
                    }
                }

            } catch (error) {
                console.log(error.message)
            } finally {
                if (this.user) {
                    this.authenticated = true;
                }
                this.loading = false;
            }
        },
    },
    mounted() {
        this.getUserProfile();
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