<template>
    <div>
        <SideNavigation :loading="loading" :authenticated="authenticated" :user_profile="user_profile" />
        <div class="flex flex-col">
            <router-view :loading="loading" :authenticated="authenticated" :user="user" :user_profile="user_profile" />
        </div>
    </div>
</template>
<script>
import { supabase } from '../supabase';
import SideNavigation from '@/components/SideNavigation.vue'
export default {
    components: {
        SideNavigation,
    },
    data() {
        return {
            isMobile: false,
            sidebarOpen: false,
            setSidebarOpen: false,
            authenticated: false,
            loading: false,
            user: null,
            user_profile: null,
        }
    },
    methods: {
        handleResize() {
            if (window.innerWidth < 768) {
                this.isMobile = true
            }
        },
        async getUserProfile() {
            try {
                this.loading = true;
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
                    let {data: file, error: err} = await supabase.storage.from('avatars').download(data.avatar_url)
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
    },
    mounted() {
        this.getUserProfile();
    },
    created() {
        window.addEventListener("resize", this.handleResize);
    },
    destroyed() {
        window.removeEventListener("resize", this.handleResize);
    },
}
</script>
<style></style>