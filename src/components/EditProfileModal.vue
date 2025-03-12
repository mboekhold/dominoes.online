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

        <div class="fixed inset-0 z-10 w-screen overflow-y-auto" @click="closeModal">
            <div class="flex min-h-full justify-center p-4 text-center items-center sm:p-0">
                <!--
        Modal panel, show/hide based on modal state.

        Entering: "ease-out duration-300"
          From: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          To: "opacity-100 translate-y-0 sm:scale-100"
        Leaving: "ease-in duration-200"
          From: "opacity-100 translate-y-0 sm:scale-100"
          To: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
      -->
                <div @click.stop
                    class="relative text-white transform overflow-hidden rounded-lg window text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-md">
                    <div class="p-8">
                        <div>
                            <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                <h3 class="text-2xl font-semibold leading-6" id="modal-title">Settings</h3>
                                <div class="mt-5 text-white">
                                    <form @submit.prevent="" class="flex flex-col space-y-5">
                                        <div class="flex flex-col space-y-3">
                                            <div class="mb-2">
                                                Avatar
                                                <div>
                                                    <input accept="image/*" type="file" class="hidden" ref="avatar" @change="onAvatarChange">
                                                </div>
                                            </div>
                                            <div class="relative w-fit">
                                                <!-- <div @click="toggleSelectAvatar()"
                                                    class="absolute -bottom-3 -right-10 bg-night-dark border border-gray-600 px-2 py-1 rounded-lg">
                                                    <div class="flex items-center cursor-pointer">
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                                                            viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
                                                            class="w-4">
                                                            <path stroke-linecap="round" stroke-linejoin="round"
                                                                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                                                        </svg>
                                                        <div class="ml-1 text-sm">
                                                            Edit
                                                        </div>
                                                    </div>
                                                </div> -->
                                                <div>
                                                    <img :src="getUserAvatar(copy_profile)" class="rounded-md w-16 h-16">
                                                </div>
                                            </div>
                                        </div>
                                        <div class="flex flex-col space-y-3">
                                            <div class="text-sm">
                                                Country
                                            </div>
                                            <div>
                                                <select
                                                    class="border focus:ring-0 focus:ring-offset-0 bg-night-dark-3 border-gray-600 p-2 rounded-md w-full"
                                                    v-model="selected_country">
                                                    <option v-for="country in countries" :value="country">
                                                        {{ country.name }}
                                                    </option>
                                                </select>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                        <button type="button" @click="saveProfile()" class="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm  text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto" :disabled="loading">
                            <svg v-if="loading" class="animate-spin h-5 w-5 text-white mr-2"
                                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                    stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                                </path>
                            </svg>
                            <div>
                                Save
                            </div>
                        </button>
                        <button type="button" @click="closeModal()"
                            class="mt-3 inline-flex w-full justify-center rounded-md bg-gray-700 px-3 py-2 text-sm  text-white shadow-sm ring-1 ring-inset ring-gray-600 hover:bg-gray-600 sm:mt-0 sm:w-auto">Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { getUserAvatar } from '../utils';
import { supabase } from '../supabase';
export default {
    props: {
        user_profile: Object,
        user: Object
    },
    data() {
        return {
            loading: false,
            countries: [],
            selected_country: this.user_profile.countries,
            copy_profile: { ...this.user_profile },
            avatar_url: null,
        }
    },
    methods: {
        getUserAvatar,
        closeModal() {
            this.$emit('close');
        },
        toggleSelectAvatar() {
            this.$refs.avatar.click();
        },
        onAvatarChange(event) {
            this.avatar_file = event.target.files[0];
            this.copy_profile.avatar_url = URL.createObjectURL(this.avatar_file);
        },
        async uploadAvatar() {
            if(this.avatar_file) {
                // Generate a unique filename
                const file_name = `${this.user_profile.id}-${Date.now()}.${this.avatar_file.name.split('.').pop()}`;
                const { data, error } = await supabase.storage.from('avatars').upload(file_name, this.avatar_file);
                if (error) throw error;
                return data;
            }
        },
        async saveProfile() {
            this.loading = true;
            try {
                const upload = await this.uploadAvatar();
                const updates = {
                    country_id: this.selected_country.id,
                    updated_at: new Date()
                }
                if (upload) {
                    updates.avatar_url = upload.path;
                }
                const { data, error } = await supabase.from('profiles').update(updates).eq('id', this.user_profile.id);
                if (error) throw error;
                this.$router.push({ name: 'profile' }).then(() => {
                    window.location.reload();
                })
            } catch (error) {
                console.log(error);
            } finally {
                this.loading = false;
            }
        },
        async getCountries() {
            let { data, error } = await supabase.from('countries').select('id, name, flag_url');
            if (error) {
                console.log(error);
            } else {
                this.countries = data
            }
        }
    },
    mounted() {
        this.getCountries();
    }

}
</script>
<style>
.window {
    @apply bg-night-dark-3;
}
</style>