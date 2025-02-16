<template>
    <div class="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <!--
        Background backdrop, show/hide based on modal state.
    
        Entering: "ease-out duration-300"
          From: "opacity-0"
          To: "opacity-100"
        Leaving: "ease-in duration-200"
          From: "opacity-100"
          To: "opacity-0"
      -->
        <div class="fixed inset-0 bg-gray-500 bg-opacity-50 transition-opacity" aria-hidden="true"></div>

        <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div class="flex min-h-full items-center justify-center text-center sm:items-center sm:p-0">
                <!--
            Modal panel, show/hide based on modal state.
    
            Entering: "ease-out duration-300"
              From: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              To: "opacity-100 translate-y-0 sm:scale-100"
            Leaving: "ease-in duration-200"
              From: "opacity-100 translate-y-0 sm:scale-100"
              To: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          -->
                <div
                    class="relative transform overflow-hidden rounded-lg window text-left shadow-xl transition-all sm:my-8 w-full sm:max-w-96">
                    <div class="px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                        <div class="sm:flex sm:items-start">
                            <div
                                class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-white sm:mx-0 sm:h-10 sm:w-10">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                    stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-black">
                                    <path stroke-linecap="round" stroke-linejoin="round"
                                        d="M18.364 18.364A9 9 0 0 0 5.636 5.636m12.728 12.728A9 9 0 0 1 5.636 5.636m12.728 12.728L5.636 5.636" />
                                </svg>
                            </div>
                            <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                <div class="flex items-center">
                                    <h3 class="text-base font-semibold leading-6 text-white" id="modal-title">
                                        <!-- {{ winner.username }} -->
                                    </h3>
                                </div>
                                <div class="mt-2">
                                    <p class="text-lg text-white">
                                        Game blocked
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="px-4 py-3 sm:px-6">
                        <div v-for="player in players" class="mb-8">
                            <div class="flex items-center">
                                <img :src="getUserAvatar(player)" alt="avatar" class="w-8 h-8 rounded-md">
                                <div v-if="player.id === winner.id" class="ml-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                                        class="w-6 h-6 text-yellow-500">
                                        <path fill-rule="evenodd"
                                            d="M5.166 2.621v.858c-1.035.148-2.059.33-3.071.543a.75.75 0 0 0-.584.859 6.753 6.753 0 0 0 6.138 5.6 6.73 6.73 0 0 0 2.743 1.346A6.707 6.707 0 0 1 9.279 15H8.54c-1.036 0-1.875.84-1.875 1.875V19.5h-.75a2.25 2.25 0 0 0-2.25 2.25c0 .414.336.75.75.75h15a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-2.25-2.25h-.75v-2.625c0-1.036-.84-1.875-1.875-1.875h-.739a6.706 6.706 0 0 1-1.112-3.173 6.73 6.73 0 0 0 2.743-1.347 6.753 6.753 0 0 0 6.139-5.6.75.75 0 0 0-.585-.858 47.077 47.077 0 0 0-3.07-.543V2.62a.75.75 0 0 0-.658-.744 49.22 49.22 0 0 0-6.093-.377c-2.063 0-4.096.128-6.093.377a.75.75 0 0 0-.657.744Zm0 2.629c0 1.196.312 2.32.857 3.294A5.266 5.266 0 0 1 3.16 5.337a45.6 45.6 0 0 1 2.006-.343v.256Zm13.5 0v-.256c.674.1 1.343.214 2.006.343a5.265 5.265 0 0 1-2.863 3.207 6.72 6.72 0 0 0 .857-3.294Z"
                                            clip-rule="evenodd" />
                                    </svg>
                                </div>
                                <div class="ml-2">
                                    {{ player.username }} {{ player.id === winner.id ? '- Winner' : '' }}
                                </div>
                            </div>
                            <div class="flex items-center mt-2">
                                <div v-for="domino in player.hand" class="mr-1">
                                    <!-- Add domino here -->
                                     <Domino :domino="domino" :size="'sm'" />
                                </div>
                            </div>
                        </div>
                        <div>

                        </div>
                    </div>
                    <div class="window px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                        <button type="button"
                            class="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto"
                            @click="nextGame()">Play again</button>
                        <button type="button"
                            class="mt-3 inline-flex w-full justify-center rounded-md bg-transparent px-3 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-gray-600 sm:mt-0 sm:w-auto"
                            @click="cancel()">Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { getUserAvatar } from "../utils";
import Domino from "./SmallDomino.vue";
export default {
    components: {
        Domino
    },
    props: {
        winner: {
            type: Object,
            required: true
        },
        players: {
            type: Array,
            required: true
        }
    },
    methods: {
        getUserAvatar,
        nextGame() {
            this.$router.push({ name: 'online' });
        },
        cancel() {
            this.$emit('on-cancel');
        }
    },
}
</script>
<style>
.window {
    background-color: #282f3d;
}
</style>
