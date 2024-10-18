<template>
  <div class="p-2 pt-10 lg:ml-10 lg:px-20 lg:py-10  text-gray-200">
    <div v-if="loading">
      <div class="flex flex-col lg:flex-row items-center space-y-4">
        <!-- Placeholder for user avatar -->
        <div class="h-14 w-14 rounded-md bg-gray-700 animate-pulse"></div>
        <!-- Placeholder for username -->
        <div class="ml-4 h-10 w-1/3 rounded-md bg-gray-700 animate-pulse"></div>
        <!-- Placeholder for buttons -->
        <div class="ml-auto w-full lg:w-fit gap-5 flex flex-col lg:flex-row lg:space-x-2">
          <div class="h-14 w-full lg:w-32 rounded-lg bg-gray-700 animate-pulse"></div>
          <div class="h-14 w-full lg:w-32 rounded-lg bg-gray-700 animate-pulse"></div>
        </div>
      </div>

      <!-- Placeholder for the stats section -->
      <div class="mt-10 w-full">
        <div class="h-40 w-full rounded-md bg-gray-700 animate-pulse"></div>
      </div>
      <div class="h-40 mt-14 rounded-lg bg-gray-700 animate-pulse"></div>
    </div>
    <div v-if="user && !loading">
      <div class="flex flex-col gap-10 lg:flex-row items-center">
        <div class="flex text-center rounded-md items-center justify-center">
          <img :src=getUserAvatar(user_profile) alt="avatar" class="h-16 w-16 rounded-md border border-gray-600">
        </div>
        <div class="ml-4">
          <div class="text-4xl font-medium">
            {{ user_profile.username }}
          </div>
          <div v-if="!user_profile.countries" @click="toggleEditProfileModal"
            class="text-sm text-gray-400 underline cursor-pointer">
            Click to set a country flag
          </div>
          <div v-else>
            <div class="flex items-center">
              <img :src="user_profile.countries.flag_url" alt="country flag" class="w-8 rounded-sm">
              <div class="ml-2">
                {{ user_profile.countries.name }}
              </div>
            </div>
          </div>
        </div>
        <div class="lg:ml-auto flex gap-5 flex-col lg:flex-row justify-center items-center w-full lg:w-fit">
          <button @click="toggleEditProfileModal()"
            class="flex items-center justify-center border border-gray-600 hover:bg-gray-800 hover:border-gray-400 text-gray-200 py-2 px-8 rounded-lg h-14 w-full text-xl font-bold">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
              <path fill-rule="evenodd"
                d="M11.078 2.25c-.917 0-1.699.663-1.85 1.567L9.05 4.889c-.02.12-.115.26-.297.348a7.493 7.493 0 0 0-.986.57c-.166.115-.334.126-.45.083L6.3 5.508a1.875 1.875 0 0 0-2.282.819l-.922 1.597a1.875 1.875 0 0 0 .432 2.385l.84.692c.095.078.17.229.154.43a7.598 7.598 0 0 0 0 1.139c.015.2-.059.352-.153.43l-.841.692a1.875 1.875 0 0 0-.432 2.385l.922 1.597a1.875 1.875 0 0 0 2.282.818l1.019-.382c.115-.043.283-.031.45.082.312.214.641.405.985.57.182.088.277.228.297.35l.178 1.071c.151.904.933 1.567 1.85 1.567h1.844c.916 0 1.699-.663 1.85-1.567l.178-1.072c.02-.12.114-.26.297-.349.344-.165.673-.356.985-.57.167-.114.335-.125.45-.082l1.02.382a1.875 1.875 0 0 0 2.28-.819l.923-1.597a1.875 1.875 0 0 0-.432-2.385l-.84-.692c-.095-.078-.17-.229-.154-.43a7.614 7.614 0 0 0 0-1.139c-.016-.2.059-.352.153-.43l.84-.692c.708-.582.891-1.59.433-2.385l-.922-1.597a1.875 1.875 0 0 0-2.282-.818l-1.02.382c-.114.043-.282.031-.449-.083a7.49 7.49 0 0 0-.985-.57c-.183-.087-.277-.227-.297-.348l-.179-1.072a1.875 1.875 0 0 0-1.85-1.567h-1.843ZM12 15.75a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5Z"
                clip-rule="evenodd" />
            </svg>
            <div class="ml-2">
              Settings
            </div>
          </button>
          <button @click="signOut()"
            class="lg:ml-2 flex items-center justify-center border border-gray-600 hover:bg-gray-800 hover:border-gray-400 text-gray-200 py-2 px-8 rounded-lg h-14 w-full text-xl font-bold">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
              <path fill-rule="evenodd"
                d="M7.5 3.75A1.5 1.5 0 0 0 6 5.25v13.5a1.5 1.5 0 0 0 1.5 1.5h6a1.5 1.5 0 0 0 1.5-1.5V15a.75.75 0 0 1 1.5 0v3.75a3 3 0 0 1-3 3h-6a3 3 0 0 1-3-3V5.25a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3V9A.75.75 0 0 1 15 9V5.25a1.5 1.5 0 0 0-1.5-1.5h-6Zm10.72 4.72a.75.75 0 0 1 1.06 0l3 3a.75.75 0 0 1 0 1.06l-3 3a.75.75 0 1 1-1.06-1.06l1.72-1.72H9a.75.75 0 0 1 0-1.5h10.94l-1.72-1.72a.75.75 0 0 1 0-1.06Z"
                clip-rule="evenodd" />
            </svg>
            <div class="ml-2">
              Sign out
            </div>
          </button>
        </div>
      </div>
      <div class="mt-10 w-full bg-night-dark-3 p-5 rounded-lg">
        <div class="grid grid-cols-1 gap-5 lg:grid-cols-3">
          <div class="flex items-center">
            <div class="h-20 w-20 bg-[#282f3d] text-cyan-600 rounded-lg flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-12">
                <path
                  d="M18.375 2.25c-1.035 0-1.875.84-1.875 1.875v15.75c0 1.035.84 1.875 1.875 1.875h.75c1.035 0 1.875-.84 1.875-1.875V4.125c0-1.036-.84-1.875-1.875-1.875h-.75ZM9.75 8.625c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-.75a1.875 1.875 0 0 1-1.875-1.875V8.625ZM3 13.125c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v6.75c0 1.035-.84 1.875-1.875 1.875h-.75A1.875 1.875 0 0 1 3 19.875v-6.75Z" />
              </svg>
            </div>
            <div class="ml-4">
              <div class="text-gray-400">
                Games played
              </div>
              <div class="text-3xl font-medium">
                0
              </div>
            </div>
          </div>
          <div class="flex items-center">
            <div class="h-20 w-20 bg-[#282f3d] rounded-lg flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                class="w-12 text-yellow-600">
                <path fill-rule="evenodd"
                  d="M5.166 2.621v.858c-1.035.148-2.059.33-3.071.543a.75.75 0 0 0-.584.859 6.753 6.753 0 0 0 6.138 5.6 6.73 6.73 0 0 0 2.743 1.346A6.707 6.707 0 0 1 9.279 15H8.54c-1.036 0-1.875.84-1.875 1.875V19.5h-.75a2.25 2.25 0 0 0-2.25 2.25c0 .414.336.75.75.75h15a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-2.25-2.25h-.75v-2.625c0-1.036-.84-1.875-1.875-1.875h-.739a6.706 6.706 0 0 1-1.112-3.173 6.73 6.73 0 0 0 2.743-1.347 6.753 6.753 0 0 0 6.139-5.6.75.75 0 0 0-.585-.858 47.077 47.077 0 0 0-3.07-.543V2.62a.75.75 0 0 0-.658-.744 49.22 49.22 0 0 0-6.093-.377c-2.063 0-4.096.128-6.093.377a.75.75 0 0 0-.657.744Zm0 2.629c0 1.196.312 2.32.857 3.294A5.266 5.266 0 0 1 3.16 5.337a45.6 45.6 0 0 1 2.006-.343v.256Zm13.5 0v-.256c.674.1 1.343.214 2.006.343a5.265 5.265 0 0 1-2.863 3.207 6.72 6.72 0 0 0 .857-3.294Z"
                  clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-4">
              <div class="text-gray-400">
                Games won
              </div>
              <div class="text-3xl font-medium">
                0
              </div>
            </div>
          </div>
          <div class="flex items-center">
            <div class="h-20 w-20 bg-[#282f3d] rounded-lg flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-12 text-red-700">
                <path fill-rule="evenodd"
                  d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z"
                  clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-4">
              <div class="text-gray-400">
                Games lost
              </div>
              <div class="text-3xl font-medium">
                0
              </div>
            </div>
          </div>
        </div>
        <div class="flex items-center mt-12">
          <div class="text-gray-400">
            Win rate
          </div>
          <div>
            <div class="ml-2 text-xl">
              0%
            </div>
          </div>
        </div>
      </div>
      <div class="mt-10 text-4xl font-medium">
        Recent games
      </div>
      <div class="mt-2 w-full min-h-44 bg-night-dark-3 p-5 rounded-lg">
        <div v-if="gameHistory.length === 0" class="flex h-full w-full justify-center items-center">
          <div class="text-2xl font-medium mt-12">
            No games played yet
          </div>
        </div>
      </div>
    </div>
  </div>
  <EditProfileModal v-if="showEditProfileModal" :user_profile="user_profile" :user="user"
    @close="toggleEditProfileModal" />
</template>
<script>
import { supabase } from '../supabase';
import { getUserAvatar } from '../utils';
import EditProfileModal from '../components/EditProfileModal.vue';
export default {
  components: {
    EditProfileModal,
  },
  data() {
    return {
      gameHistory: [],
      showEditProfileModal: false,
      country: null,
      loading: false,
      user: null,
      user_profile: null,
      authenticated: false,
    }
  },
  methods: {
    getUserAvatar,
    toggleEditProfileModal() {
      this.showEditProfileModal = !this.showEditProfileModal;
    },
    getUserFirstLetter() {
      return this.user.email.charAt(0).toUpperCase();
    },
    updateProfile() {
      // Update the user profile
    },
    async getUserProfile() {
      this.loading = true;
      try {
        this.user = (await supabase.auth.getSession()).data.session.user;
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
    },
    async signOut() {
      try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        this.$router.push('/').then(() => {
          window.location.reload();
        });
      } catch (error) {
        console.error('Error signing out:', error.message);
      }
    }
  },
  mounted() {
    this.getUserProfile();
  }
}
</script>
<style></style>