<template>
    <div class="lg:ml-20 p-2 mt-10 lg:px-48 py-5 text-white">
        <div class="text-4xl">
            News
        </div>
        <div class="mt-10">
            <div v-if="loading">
    
            </div>
            <div v-else class="bg-night-dark-3 rounded-md relative">
                <div v-for="post in posts">
                    <div class="p-5 flex">
                        <img src="@/assets/launched.png" class="w-52" alt="post image">
                        <div class="ml-5">
                            <div class="font-bold text-4xl">
                                {{ post.title }}
                            </div>
                            <div class="mt-2">
                                {{ post.content }}
                            </div>
                        </div>
                        <div class="absolute right-4 bottom-4">
                            Read more
                        </div>
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
            loading: false,
            posts: []
        }
    },
    methods: {
        async getPosts() {
            this.loading = true
            const post = { 
                id: 1,
                image: '@/assets/game_screenshot.png',
                title: 'Now available, play today!',
                content: 'test' 
            }
            this.posts.push(post)
            this.loading = false
        }
    },
    mounted() {
        this.getPosts()
    }
}
</script>
<style></style>