<template>
    <div @mouseover="expand = true" @mouseleave="expand = false" :class="{ 'w-20': !expand, 'w-64': expand }"
        class="fixed h-full text-gray-400 bg-night-dark-2 flex flex-col transition-all z-10">
        <div>
            <div class="px-4 pt-6 pb-4 hover:cursor-pointer flex" @click="goHome()">
                <div>
                    <img class="min-w-12 w-12" src="@/assets/logo.png" alt="logo">
                </div>
                <div>
                    <div class="ml-1 font-medium text-gray-100 flex" :class="{ 'hidden': !showText }">
                        <div>
                            Dominoes
                        </div>
                        <div class="font-thin text-base">
                            .online
                        </div>
                    </div>
                </div>
            </div>
            <div class="mt-4 px-6 py-4 flex hover:cursor-pointer hover:text-white hover:bg-gray-700" @click="goHome()">
                <div>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="h-7 w-7 ">
                        <path
                            d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.061l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06l8.69-8.689Z" />
                        <path
                            d="m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.432Z" />
                    </svg>
                </div>
                <div class="ml-3" :class="{ 'hidden': !showText }">
                    Home
                </div>
            </div>
            <div class="mt-4 px-6 py-4 flex hover:cursor-pointer hover:text-white hover:bg-gray-700"
                @click="goLeaderboard()">
                <div>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="h-7 w-7">
                        <path fill-rule="evenodd"
                            d="M5.166 2.621v.858c-1.035.148-2.059.33-3.071.543a.75.75 0 0 0-.584.859 6.753 6.753 0 0 0 6.138 5.6 6.73 6.73 0 0 0 2.743 1.346A6.707 6.707 0 0 1 9.279 15H8.54c-1.036 0-1.875.84-1.875 1.875V19.5h-.75a2.25 2.25 0 0 0-2.25 2.25c0 .414.336.75.75.75h15a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-2.25-2.25h-.75v-2.625c0-1.036-.84-1.875-1.875-1.875h-.739a6.706 6.706 0 0 1-1.112-3.173 6.73 6.73 0 0 0 2.743-1.347 6.753 6.753 0 0 0 6.139-5.6.75.75 0 0 0-.585-.858 47.077 47.077 0 0 0-3.07-.543V2.62a.75.75 0 0 0-.658-.744 49.22 49.22 0 0 0-6.093-.377c-2.063 0-4.096.128-6.093.377a.75.75 0 0 0-.657.744Zm0 2.629c0 1.196.312 2.32.857 3.294A5.266 5.266 0 0 1 3.16 5.337a45.6 45.6 0 0 1 2.006-.343v.256Zm13.5 0v-.256c.674.1 1.343.214 2.006.343a5.265 5.265 0 0 1-2.863 3.207 6.72 6.72 0 0 0 .857-3.294Z"
                            clip-rule="evenodd" />
                    </svg>
                </div>
                <div class="ml-3" :class="{ 'hidden': !showText }">
                    Leaderboard
                </div>
            </div>
        </div>
        <div class="mt-auto">
            <div class="w-full h-[1px] bg-gray-700">

            </div>
            <div v-if="loading">
                <div class="p-4 flex w-fit">
                    <div
                        class="animate-pulse bg-gray-500 h-10 min-w-10 flex text-center rounded-md items-center justify-center">
                    </div>
                    <div class="ml-3" :class="{ 'hidden': !this.showText }">
                        <div class="text-gray-300">
                            Loading...
                        </div>
                    </div>
                </div>
            </div>
            <div v-else class="p-4">
                <div v-if="authenticated" class="flex w-full cursor-pointer" @click="goProfile()">
                    <div class="flex text-center items-center justify-center">
                        <div
                            class="text-gray-300 flex items-center justify-center  h-12 w-12 rounded-md">
                            <img :src="getUserAvatar(user_profile)" class=" rounded-md h-11 w-11 border border-gray-600">
                        </div>
                    </div>
                    <div class="ml-3" :class="{ 'hidden': !this.showText }">
                        <div class="text-gray-300 overflow-ellipsis overflow-hidden w-40">
                            {{ user_profile.username }}
                        </div>
                        <div class="text-xs font-thin">
                            View your profile
                        </div>
                    </div>
                </div>
                <div v-else>
                    <div @click="goLogin()"
                        class="bg-blue-600 rounded-md h-10 w-10 flex items-center justify-center hover:bg-blue-500 hover:cursor-pointer"
                        :class="{ 'w-full': expand }">
                        <div :class="{ 'hidden': this.showText }">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                                class="w-5 h-5 text-gray-200">
                                <path fill-rule="evenodd"
                                    d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
                                    clip-rule="evenodd" />
                            </svg>
                        </div>
                        <div class="text-gray-100" :class="{ 'hidden': !this.showText }">
                            Login
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>
<script>
import { supabase } from '../supabase';
import { getUserAvatar } from '../utils';
export default {
    data() {
        return {
            expand: false,
            showText: false,
            authenticated: false,
            loading: true,
            user: null,
            user_profile: null
        }
    },
    methods: {
        getUserAvatar,
        goHome() {
            this.$router.push({ name: 'home' });
        },
        goLeaderboard() {
            this.$router.push({ name: 'leaderboard' });
        },
        goLogin() {
            this.$router.push({ name: 'login' });
        },
        goProfile() {
            this.$router.push({ name: 'profile' });
        },
        async getUserProfile() {
            // check if there is a session..
            const session = (await supabase.auth.getSession()).data.session;
            if (session) {
                this.user = (await supabase.auth.getSession()).data.session.user;
                try {
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
            } else {
                this.authenticated = false;
                this.loading = false;
            }

        },
    },
    mounted() {
        this.getUserProfile();
    },
    watch: {
        expand(newVal, oldVal) {
            if (oldVal === false) {
                setTimeout(() => {
                    this.showText = !this.showText;
                }, 75);
            } else {
                this.showText = !this.showText;;
            }
        }
    }
}
</script>
<style></style>