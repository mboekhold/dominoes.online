<template>
  <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
    <div v-if="loading">
      <div class="mb-10">
        <svg class="animate-spin h-10 w-10 text-gray-500 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
          </path>
        </svg>
      </div>
      <div class="text-xl font-medium">
        Setting things up...
      </div>
    </div>
  </div>
</template>
<script>
import { supabase } from '../supabase';

export default {
  data() {
    return {
      user: null,
      loading: false
    }
  },
  methods: {
    async getUserProfile() {
      const session = (await supabase.auth.getSession()).data.session;
      if (session) {
        const user = (await supabase.auth.getSession()).data.session.user;
        try {
          this.loading = true;
          const { data, error, status } = await supabase
            .from('profiles')
            .select(`id, username, avatar_url,
                            countries (
                                id,
                                name,
                                flag_url
                            )`)
            .eq('id', user.id)
            .single();

          if (error && status === 406) {
            // No profile found, create a new profile
            this.$router.push({ name: 'set-username' });
          } else {
            this.$router.push({ name: 'home' });
          }
        } catch (error) {
          console.log(error.message)
        } finally {
          this.loading = false;
        }
      }
    },
  },
  mounted() {
    this.getUserProfile();
    if (!document.body.classList.contains('light-bg')) {
      document.body.classList.add('light-bg');
    }
  },
  unmounted() {
    document.body.classList.remove('light-bg');
  },
}
</script>
<style>

</style>