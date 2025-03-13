<template>
  <div class="mt-10 mx-auto w-[330px] sm:w-[348px]">
    <div class="text-3xl">
      Set your username
    </div>
    <div class="mt-10">
      <div v-if="error" class="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
        role="alert">
        <span class="font-medium">{{ error }}</span>
      </div>
      <form @submit.prevent="saveUsername" class="flex flex-col space-y-3">
        <div class="flex flex-col space-y-3">
          <label for="username" class="text-sm text-gray-700">Username</label>
          <input autocomplete="username" v-model="username" required type="username" placeholder="username"
            class="border border-gray-300 p-2 rounded-md">
        </div>
        <div class="mt-5">
          <button type="submit" class="bg-blue-500 text-white w-full p-2 rounded-md flex items-center justify-center">
            <svg v-if="loading" class="animate-spin h-5 w-5 text-white mr-2" xmlns="http://www.w3.org/2000/svg"
              fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4">
              </circle>
              <path class="opacity-75" fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
              </path>
            </svg>
            <div>
              Save
            </div>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
<script>
import { supabase } from '../supabase';
export default {
  data() {
    return {
      username: '',
      error: "",
      loading: false
    }
  },
  methods: {
    async saveUsername() {
      try {
        this.loading = true;
        const userId = (await supabase.auth.getSession()).data.session.user.id
        const { error } = await supabase.from('profiles').insert([
          { id: userId, username: this.username.toLowerCase() },
        ]);
        if (error) throw error;
      } catch (error) {
        if (error) {
          this.error = "Username already taken";
        }
      } finally {
        if(this.error === '') {
          this.$router.push({ name: 'home' });
        }
        this.loading = false;
      }
    }
  },
  mounted() {
    if (!document.body.classList.contains('light-bg')) {
      document.body.classList.add('light-bg');
    }
  },
  unmounted() {
    document.body.classList.remove('light-bg');
  },
}
</script>
<style></style>