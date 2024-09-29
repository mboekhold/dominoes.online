<template>
  <div class="ml-10 px-20 py-20 text-gray-200">
    <div v-if="user && !loading">
      <div class="flex items-center">
        <div class="h-14 min-w-14 border border-gray-600 flex text-center rounded-md items-center justify-center">
          <div class="text-gray-300 text-2xl">
            {{ getUserFirstLetter() }}
          </div>
        </div>
        <div class="ml-2 text-xl font-bold">
          {{ user.email }}
        </div>
      </div>
      <form @submit.prevent="updateProfile">
        <div>
          <label for="email">Email</label>
          <input id="email" type="text" :value="user.email" disabled>
        </div>
        <div>
          <label for="username">Username</label>
          <input id="username" type="text" v-model="username">
        </div>
        <div>
          <button type="submit" :disabled="loading">

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
        user: null,
        loading: false,
        username: '',
        avatar_url: '',
      }
    },
    methods: {
      getUserFirstLetter() {
        return this.user.email.charAt(0).toUpperCase();
      },
      async getUserProfile() {
        try {
          this.loading = true;
          this.user = (await supabase.auth.getSession()).data.session.user;
          const { data, error, status } = await supabase
            .from('profiles')
            .select(`username, avatar_url`)
            .eq('id', this.user.id)
            .single();

          if (error && status !== 406) throw error
          if (data) {
            this.username = data.username
            this.avatar_url = data.avatar_url
          }
        } catch (error) {
          alert(error.message)
        } finally {
          this.loading = false;
        }
      },
      async updateProfile() {
        try {
          this.loading = true;
          const updates = {
            id: this.user.id,
            username: this.username,
            avatar_url: this.avatar_url,
            updated_at: new Date(),
          }
          const { error } = await supabase.from('profiles').upsert(updates)
          if (error) throw error
        } catch (error) {
          alert(error.message)
        } finally {
          this.loading = false;
        }
      },
      async logOut() {
        try {
          this.loading = true;
          const { error } = await supabase.auth.signOut()
          if (error) throw error
        } catch (error) {
          alert(error.message)
        } finally {
          this.loading = false;
        }
      }
    },
    mounted() {
      this.getUserProfile();
    },
  }
</script>
<style>

</style>