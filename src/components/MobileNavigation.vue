<template>
    <div class="p-4 text-gray-200 sticky h-14 top-0 border-b border-gray-700 z-10 bg-night-dark">
        <div class="flex items-center">
            <div class="flex-1">
                <div @click="toggleSideBar()" class="cursor-pointer w-fit">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                        stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                    </svg>
                </div>
            </div>
            <div class="flex-grow">
                <img @click="goHome()" class="cursor-pointer min-w-12 w-12" src="@/assets/logo.png" alt="logo">
            </div>
        </div>
    </div>
    <div>
        <div ref="sidebar"
            class="fixed top-0 h-full w-64 text-gray-400 bg-night-dark-2 flex flex-col z-10 transition-all"
            :class="{ 'translate-x-0': sideBarOpen, '-translate-x-64': !sideBarOpen }">
            <div class="pb-2 border-b border-gray-700">
                <div class="px-4 pt-6 pb-4 flex">
                    <div>
                        <img class="min-w-12 w-12" src="@/assets/logo.png" alt="logo">
                    </div>
                    <div>
                        <div class="ml-1 font-medium text-gray-100 flex">
                            <div>
                                Dominoes
                            </div>
                            <div class="font-thin text-base">
                                .online
                            </div>
                        </div>
                    </div>
                </div>
                <div class="mt-4 px-6 py-4 flex hover:cursor-pointer hover:text-white hover:bg-gray-700"
                    @click="goHome()">
                    <div>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                            class="h-7 w-7 ">
                            <path
                                d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.061l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06l8.69-8.689Z" />
                            <path
                                d="m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.432Z" />
                        </svg>
                    </div>
                    <div class="ml-3">
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
                    <div class="ml-3">
                        Leaderboard
                    </div>
                </div>
            </div>
            <div>
                <div class="mt-2 px-6 py-4 flex items-center hover:cursor-pointer hover:text-white hover:bg-gray-700"
                    @click="goToDiscord()">
                    <div class="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24">
                            <path fill="currentColor"
                                d="M18.942 5.555a16.3 16.3 0 0 0-4.126-1.296a12 12 0 0 0-.529 1.097a15.2 15.2 0 0 0-4.573 0A12 12 0 0 0 9.18 4.26c-1.448.25-2.834.692-4.129 1.3c-2.611 3.946-3.319 7.794-2.965 11.587a16.5 16.5 0 0 0 5.06 2.593q.613-.841 1.084-1.785a10.7 10.7 0 0 1-1.706-.83q.215-.16.418-.331c3.29 1.539 6.866 1.539 10.118 0q.206.171.418.33a10.6 10.6 0 0 1-1.71.833a13 13 0 0 0 1.084 1.785a16.5 16.5 0 0 0 5.064-2.595c.415-4.398-.71-8.21-2.973-11.59M8.678 14.813c-.988 0-1.798-.922-1.798-2.045s.792-2.047 1.798-2.047c1.005 0 1.815.922 1.798 2.047c.001 1.123-.793 2.045-1.798 2.045m6.644 0c-.988 0-1.798-.922-1.798-2.045s.793-2.047 1.798-2.047c1.006 0 1.816.922 1.798 2.047c0 1.123-.793 2.045-1.798 2.045" />
                        </svg>
                    </div>
                    <div class="ml-3">
                        Discord Server
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
                        <div class="ml-3">
                            <div class="text-gray-300">
                                Loading...
                            </div>
                        </div>
                    </div>
                </div>
                <div v-else class="p-6">
                    <div v-if="authenticated" class="flex w-full cursor-pointer" @click="goProfile()">
                        <div class="flex text-center items-center justify-center">
                            <div class="text-gray-300 flex items-center justify-center  h-12 w-12 rounded-md">
                                <img :src="getUserAvatar(user_profile)"
                                    class=" rounded-md h-11 w-11 border border-gray-600">
                            </div>
                        </div>
                        <div class="ml-3">
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
                            class="bg-blue-600 rounded-md h-10 flex items-center justify-center hover:bg-blue-500 hover:cursor-pointer">
                            <div class="text-gray-100">
                                Login
                            </div>
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
            sideBarOpen: false,
            loading: false,
            authenticated: false,
            user: null,
            user_profile: null
        }
    },
    methods: {
        getUserAvatar,
        toggleSideBar() {
            this.sideBarOpen = !this.sideBarOpen
            event.stopPropagation();
        },
        goHome() {
            this.$router.push({ name: 'home' });
            if (this.sideBarOpen) {
                this.toggleSideBar();
            }
        },
        goLeaderboard() {
            this.$router.push({ name: 'leaderboard' });
            this.toggleSideBar();
        },
        goNews() {
            this.$router.push({ name: 'news' });
            this.toggleSideBar();
        },
        goLogin() {
            this.$router.push({ name: 'login' });
            this.toggleSideBar();
        },
        goProfile() {
            this.$router.push({ name: 'profile' });
            this.toggleSideBar();
        },
        goToDiscord() {
            window.open("https://discord.gg/CC3PFHJSzZ", "_blank");
        },
        handleClickOutside(event) {
            const sidebar = this.$refs.sidebar;
            if (sidebar && !sidebar.contains(event.target)) {
                this.sideBarOpen = false;
            }
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
        window.addEventListener("click", this.handleClickOutside);
        this.getUserProfile();
    },
    beforeDestroy() {
        window.removeEventListener("click", this.handleClickOutside);
    },
}
</script>
<style></style>