<!-- GAME MANAGER -->
<template>
    <div class="lg:ml-20 p-2 mt-10 lg:px-48 xl:px-64 py-5">
        <div class="relative text-gray-200">
            <div class="flex flex-col md:flex-row gap-10">
                <div class="w-full md:max-w-96 min-h-[500px] bg-night-dark-2 rounded-lg overflow-hidden relative">
                    <Transition>
                        <PlayerCard :loading="profileLoading" :user="user" :user_profile="user_profile"
                            v-if="showPlayerCard" @find-match="findMatch()" @play-with-friends="playWithFriends()" />
                    </Transition>
                    <Transition>
                        <FindingMatchCard :user_profile="user_profile" v-if="showFindingMatch" @go-back="goBack()" />
                    </Transition>
                    <Transition>
                        <PlayWithFriendsCard :user_profile="user_profile" v-if="showPlayWithFriends"
                            @go-back="goBack()" />
                    </Transition>
                </div>
                <div class="w-full max-w-[800px] h-fit min-h-[500px] relative">
                    <div class="w-full h-full bg-night-dark-2 rounded-lg">
                        <div v-if="gameHistoryLoading"
                            class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                            <svg class="animate-spin h-8 w-8 text-white mr-2 " xmlns="http://www.w3.org/2000/svg"
                                fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                    stroke-width="4">
                                </circle>
                                <path class="opacity-75" fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                                </path>
                            </svg>
                        </div>
                        <div v-else>
                            <div v-if="gameHistory.length === 0"
                                class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                                <div class="text-xl font-medium">
                                    No games played yet
                                </div>
                            </div>
                            <div v-else class="p-4">
                                <div v-for="game in gameHistory" :key="game.id" class="mb-2">
                                    <GameCard :game="game" :user="user_profile" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import Board from '@/components/Board.vue';
import PlayerCard from '@/components/PlayerCard.vue';
import FindingMatchCard from '@/components/FindingMatchCard.vue';
import GameCard from '@/components/GameCard.vue';
import { supabase } from '../supabase';
import { generateUsername, isUserAuthenticated } from '../utils';
import PlayWithFriendsCard from '@/components/PlayWithFriendsCard.vue';
export default {
    components: {
        Board,
        PlayerCard,
        FindingMatchCard,
        PlayWithFriendsCard,
        GameCard
    },
    data() {
        return {
            showPlayerCard: true,
            showFindingMatch: false,
            showPlayWithFriends: false,
            profileLoading: false,
            gameHistoryLoading: false,
            user: null,
            user_profile: null,
            authenticated: false,
            gameHistory: [],
        }
    },
    methods: {
        isUserAuthenticated,
        generateUsername,
        async findMatch() {
            if (await isUserAuthenticated() === false) {
                this.$router.push('/login')
            }
            this.showPlayerCard = false
            setTimeout(() => {
                this.showFindingMatch = true
            }, 200)
        },
        playWithFriends() {
            this.showPlayerCard = false
            setTimeout(() => {
                this.showPlayWithFriends = true
            }, 200)
        },
        goBack() {
            this.showFindingMatch = false
            this.showPlayWithFriends = false
            // Remove roomId query parameter from the URL
            this.$router.replace({ query: {} })
            setTimeout(() => {
                this.showPlayerCard = true
            }, 200)
        },
        async getUserProfile() {
            this.profileLoading = true;
            this.gameHistoryLoading = true;
            try {
                this.user = (await supabase.auth.getSession()).data.session.user;
                const { data, error, status } = await supabase
                    .from('profiles')
                    .select(`id, username, avatar_url, wins, games_played,
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
                this.profileLoading = false;
            }
        },
        async getGameHistory() {
            try {
                const { data, error } = await supabase
                    .from('user_game')
                    .select(`game_id, created_at, 
                    games!inner (
                        winner, completed
                    )`)
                    .eq('user_id', this.user.id)
                    .filter('games.completed', 'eq', true)
                    .order('created_at', { ascending: false })

                if (error) throw error
                this.gameHistory = data;
            } catch (error) {
                console.log(error.message)
            }
        },
        async getPlayersInGame() {
            try {
                for (const game of this.gameHistory) {
                    const { data, error } = await supabase
                        .from('user_game')
                        .select('user_id, profiles (username, avatar_url)')
                        .eq('game_id', game.game_id)
                    if (error) {
                        throw error;
                    }
                    game.players = data;
                }
            } catch (error) {
                console.error('Error getting other players in game', error);
            } finally {
                this.gameHistoryLoading = false;
            }
        },
        setAnonymousUserProfile() {
            this.user = {}
            const username = localStorage.getItem('generated_username')
            if (username) {
                this.user_profile = {
                    id: null,
                    username,
                    avatar_url: null,
                    wins: 0,
                    games_played: 0,
                    countries: null
                }
            } else {
                const generated_username = generateUsername()
                localStorage.setItem('generated_username', generated_username)
                this.user_profile = {
                    id: null,
                    username: generated_username,
                    avatar_url: null,
                    wins: 0,
                    games_played: 0,
                    countries: null
                }

            }
            
        },
    },
    async mounted() {
        await this.getUserProfile();
        await this.getGameHistory();
        await this.getPlayersInGame();
        if (!this.authenticated) {
            this.setAnonymousUserProfile();
        }
        if (this.$route.query.roomId) {
            this.playWithFriends();
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