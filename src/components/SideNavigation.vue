<template>
    <div @mouseover="expand = true" @mouseleave="expand = false" :class="{'w-20': !expand, 'w-64': expand}" class="fixed h-full text-gray-400 bg-custom-dark-2 flex flex-col transition-all z-10">
        <div>
            <div class="px-4 pt-6 pb-4 hover:cursor-pointer flex" @click="goHome()">
                <div>
                    <img class="min-w-12 w-12" src="@/assets/logo.png" alt="logo">
                </div>
                <div>
                    <div class="ml-1 font-medium text-gray-100 flex" :class="{'hidden': !showText }">
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
                        <path d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.061l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06l8.69-8.689Z" />
                        <path d="m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.432Z" />
                    </svg>               
                </div>
                <div class="ml-3" :class="{'hidden': !showText}">
                    Home
                </div>
            </div>
        </div>
        <div class="mt-auto">
            <div class="w-full h-[1px] bg-gray-700">
                
            </div>
            <div v-if="isLoading">
                <div class="p-6 flex w-fit">
                    <div class="animate-pulse bg-gray-500 h-10 min-w-10 flex text-center rounded-md items-center justify-center">
                    </div>
                    <div class="ml-3" :class="{'hidden': !this.showText }">
                        <div class="text-gray-300">
                            Loading...
                        </div>
                    </div>
                </div>
            </div>
            <div v-else>
                <div v-if="isAuthenticated" class="p-6 flex w-full cursor-pointer hover:text-white" @click="goProfile()">
                    <div class="h-10 min-w-10 border border-gray-600 flex text-center rounded-md items-center justify-center">
                        <div class="text-gray-300">
                            {{ getUserFirstLetter() }}
                        </div>
                    </div>
                    <div class="ml-3" :class="{'hidden': !this.showText }">
                        <div class="text-gray-300">
                            {{ user.name }}
                        </div>
                        <div class="text-xs font-thin">
                            View your profile   
                        </div>
                    </div>
                </div>
                <div v-else @click="goLogin()" class="bg-blue-600 rounded-md h-10 w-10 flex items-center justify-center hover:bg-blue-500 hover:cursor-pointer" :class="{'w-full': expand}">
                    <div :class="{'hidden': expand }">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5 text-gray-200">
                            <path fill-rule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clip-rule="evenodd" />
                          </svg>
                    </div>
                    <div class="text-gray-100" :class="{'hidden': !expand }">
                        Login
                    </div>
                </div>
                            
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            expand: false,
            showText: false,
            user: this.$auth0.user,
            isAuthenticated: this.$auth0.isAuthenticated,
            isLoading: this.$auth0.isLoading
        }
    },
    methods: {
        goHome() {
            this.$router.push({ name: 'home' });
        },
        goLogin() {
          this.$auth0.loginWithRedirect();
        },
        getUserFirstLetter() {
            return this.user.name.charAt(0).toUpperCase();
        },
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
<style>
    
</style>