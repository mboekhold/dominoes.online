<template>
    <div class="h-full bg-white w-full p-5">
        <div class="mt-10 mx-auto w-[330px] sm:w-[348px]">
            <div @click="goHome()"
                class="cursor-pointer w-10 h-10 p-1 bg-black rounded-md flex items-center justify-center">
                <img src="../assets/logo.png" alt="logo" class="w-10">
            </div>
            <div class="mt-2 text-3xl">
                Get started
            </div>
            <div class="text-gray-600 mt-2 text-sm">
                Create a new account
            </div>
            <div class="mt-10">
                <button @click="continueWithGoogle()"
                    class="flex items-center justify-center w-full border p-2 rounded-md text-gray-700 border-gray-300 hover:bg-gray-100">
                    <svg class="w-5" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"
                        xmlns:xlink="http://www.w3.org/1999/xlink" style="display: block;">
                        <path fill="#EA4335"
                            d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z">
                        </path>
                        <path fill="#4285F4"
                            d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z">
                        </path>
                        <path fill="#FBBC05"
                            d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z">
                        </path>
                        <path fill="#34A853"
                            d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z">
                        </path>
                        <path fill="none" d="M0 0h48v48H0z"></path>
                    </svg>
                    <div class="flex-grow">
                        Continue with Google
                    </div>
                </button>
            </div>
            <div class="mt-5">
                <!-- OR Seperator -->
                <div class="flex items-center">
                    <div class="h-px bg-gray-300 w-full"></div>
                    <div class="text-gray-400 px-2">OR</div>
                    <div class="h-px bg-gray-300 w-full"></div>
                </div>
            </div>
            <div class="mt-5 w-full">
                <div v-if="error"
                    class="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
                    role="alert">
                    <span class="font-medium">{{ error }}</span>
                </div>
                <div>
                    <form @submit.prevent="signUpuser" class="flex flex-col space-y-3">
                        <!-- Label -->
                        <div class="flex flex-col space-y-3">
                            <label for="email" class="text-sm text-gray-700">Email</label>
                            <input autocomplete="email" required v-model="email" type="email"
                                placeholder="you@example.com" class="border border-gray-300 p-2 rounded-md">
                        </div>
                        <div class="flex flex-col space-y-3">
                            <label for="username" class="text-sm text-gray-700">Username</label>
                            <input required v-model="username" type="text" placeholder="username"
                                class="border border-gray-300 p-2 rounded-md">
                        </div>
                        <div class="flex flex-col space-y-3">
                            <label for="password" class="text-sm text-gray-700">Password</label>
                            <input autocomplete="current-password" required v-model="password" type="password"
                                placeholder="••••••••••" class="border border-gray-300 p-2 rounded-md">
                        </div>
                        <div class="mt-5">
                            <button type="submit" :disabled="loading"
                                class="bg-blue-500 text-white w-full p-2 rounded-md flex items-center justify-center">
                                <svg v-if="loading" class="animate-spin h-5 w-5 text-white mr-2"
                                    xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                        stroke-width="4"></circle>
                                    <path class="opacity-75" fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                                    </path>
                                </svg>
                                <div>
                                    Sign up
                                </div>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <div class="mt-5">
                <div class="text-center text-gray-500 text-sm">
                    Have an account? <a @click="goToLogin()" class="cursor-pointer text-gray-900 underline">Sign in
                        now</a>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { supabase } from '../supabase';
export default {
    data() {
        return {
            loading: false,
            error: '',
            email: '',
            username: '',
            password: '',
        }
    },
    methods: {
        async signUpuser() {
            // Check if username exists
            const { data, error } = await supabase
                .from('profiles')
                .select('id')
                .eq('username', this.username)
                .single();
            if (data) {
                this.error = 'Username already exists';
                return;
            }
            try {
                this.loading = true;
                const { data, error } = await supabase.auth.signUp({
                    email: this.email,
                    password: this.password,
                });
                if (error) throw error;
                const { err } = await supabase.from('profiles').insert([
                    { id: data.user.id, username: this.username },
                ]);
                if (err) throw error;
            } catch (error) {
                this.error = error.message;
                this.loading = false;
            } finally {
                this.loading = false;
                if (!this.error) {
                    this.goHome();
                }
            }
        },
        continueWithGoogle() {
            supabase.auth.signInWithOAuth({
                provider: 'google',
            });
        },
        goHome() {
            this.$router.push('/');
        },
        goToLogin() {
            this.$router.push('/login');
        }
    },
    mounted() {
        if (!document.body.classList.contains('light-bg')) {
            document.body.classList.add('light-bg');
        }
    },
    unmounted() {
        document.body.classList.remove('light-bg');
    }
}
</script>

<style></style>