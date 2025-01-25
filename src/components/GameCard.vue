<template>
    <div>
        <div class="p-4 rounded-md flex items-center" :class="wonGame ? 'won-game' : 'lost-game'">
            <div>
                <div>
                    <div class="text-xs text-gray-300">
                        {{ timeAgo(game.created_at) }}
                    </div>
                    <div v-if="wonGame" class="won-game-text">
                        WIN
                    </div>
                    <div v-else class="loss-game-text">
                        LOSS
                    </div>
                </div>
            </div>
            <div>
            </div>
            <div class="flex items-center gap-2 ml-auto">
                <div class="w-28 overflow-hidden text-ellipsis">
                    <div v-for="player in game.players.slice(0, 2)" :key="player.id" class="flex items-center mt-2">
                        <img :src="getUserAvatar(player)" class="rounded-lg w-6 h-6 mr-1">
                        <div v-if="player.id === game.games.winner" class="text-xs text-gray-300">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                                class="w-4 h-4 text-yellow-500 mr-1">
                                <path fill-rule="evenodd"
                                    d="M5.166 2.621v.858c-1.035.148-2.059.33-3.071.543a.75.75 0 0 0-.584.859 6.753 6.753 0 0 0 6.138 5.6 6.73 6.73 0 0 0 2.743 1.346A6.707 6.707 0 0 1 9.279 15H8.54c-1.036 0-1.875.84-1.875 1.875V19.5h-.75a2.25 2.25 0 0 0-2.25 2.25c0 .414.336.75.75.75h15a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-2.25-2.25h-.75v-2.625c0-1.036-.84-1.875-1.875-1.875h-.739a6.706 6.706 0 0 1-1.112-3.173 6.73 6.73 0 0 0 2.743-1.347 6.753 6.753 0 0 0 6.139-5.6.75.75 0 0 0-.585-.858 47.077 47.077 0 0 0-3.07-.543V2.62a.75.75 0 0 0-.658-.744 49.22 49.22 0 0 0-6.093-.377c-2.063 0-4.096.128-6.093.377a.75.75 0 0 0-.657.744Zm0 2.629c0 1.196.312 2.32.857 3.294A5.266 5.266 0 0 1 3.16 5.337a45.6 45.6 0 0 1 2.006-.343v.256Zm13.5 0v-.256c.674.1 1.343.214 2.006.343a5.265 5.265 0 0 1-2.863 3.207 6.72 6.72 0 0 0 .857-3.294Z"
                                    clip-rule="evenodd" />
                            </svg>
                        </div>
                        <div class="text-xs text-gray-300 truncate">
                            {{ player.username }}
                        </div>
                    </div>
                </div>
                <div class="w-28 overflow-hidden text-ellipsis">
                    <div v-for="player in game.players.slice(2, 4)" :key="player.id" class="flex items-center mt-2 mr-5">
                        <img :src="getUserAvatar(player)" class="rounded-lg w-6 h-6 mr-1">
                        <div v-if="player.id === game.games.winner" class="text-xs text-gray-300">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                                class="w-4 h-4 text-yellow-500 mr-1">
                                <path fill-rule="evenodd"
                                    d="M5.166 2.621v.858c-1.035.148-2.059.33-3.071.543a.75.75 0 0 0-.584.859 6.753 6.753 0 0 0 6.138 5.6 6.73 6.73 0 0 0 2.743 1.346A6.707 6.707 0 0 1 9.279 15H8.54c-1.036 0-1.875.84-1.875 1.875V19.5h-.75a2.25 2.25 0 0 0-2.25 2.25c0 .414.336.75.75.75h15a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-2.25-2.25h-.75v-2.625c0-1.036-.84-1.875-1.875-1.875h-.739a6.706 6.706 0 0 1-1.112-3.173 6.73 6.73 0 0 0 2.743-1.347 6.753 6.753 0 0 0 6.139-5.6.75.75 0 0 0-.585-.858 47.077 47.077 0 0 0-3.07-.543V2.62a.75.75 0 0 0-.658-.744 49.22 49.22 0 0 0-6.093-.377c-2.063 0-4.096.128-6.093.377a.75.75 0 0 0-.657.744Zm0 2.629c0 1.196.312 2.32.857 3.294A5.266 5.266 0 0 1 3.16 5.337a45.6 45.6 0 0 1 2.006-.343v.256Zm13.5 0v-.256c.674.1 1.343.214 2.006.343a5.265 5.265 0 0 1-2.863 3.207 6.72 6.72 0 0 0 .857-3.294Z"
                                    clip-rule="evenodd" />
                            </svg>
                        </div>
                        <div class="text-xs text-gray-300 truncate">
                            {{ player.username }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { didUserWinGame, getUserAvatar } from '../utils';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

export default {
    props: {
        game: {
            type: Object,
            required: true
        },
        user: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            wonGame: null,
            otherPlayers: []
        }
    },
    methods: {
        didUserWinGame,
        getUserAvatar,
        timeAgo(date) {
            return dayjs(date).fromNow();
        },
    },
    async mounted() {
        this.wonGame = this.didUserWinGame(this.game, this.user);
    }
}
</script>
<style scoped>
.won-game {
    background-color: #1e2b5e;
}
.won-game-text {
    color: #3273fa;
}
.lost-game {
    background-color: #3b213b;
}

.loss-game-text {
    color: rgb(255 70 85);
}
</style>