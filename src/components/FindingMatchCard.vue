<template>
    <div>
        <div class="flex items-center p-4">
            <div @click="goBack()"
                class="border-gray-600 border p-2 rounded-md w-fit cursor-pointer text-gray-200 hover:border-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                    stroke="currentColor" class="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                </svg>
            </div>
            <div class="ml-5 font-bold text-xl">
                Finding a match
            </div>
        </div>
        <div class="w-full h-[1px] bg-gray-700"></div>
        <div class="text-center mt-10 text-xl">
            {{ time_elapsed }}
        </div>
        <div class="mt-5 w-4/5 mx-auto">
            <img src="@/assets/world_map.png" alt="Finding match">
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            time_elapsed: '00:00'
        }
    },
    methods: {
        goBack() {
            this.$emit("go-back")
        },
        startTimer() {
            let time = 0
            setInterval(() => {
                time += 1
                // Make in format $:mm:ss
                let minutes = Math.floor((time % 3600) / 60)
                let seconds = time % 60
                this.time_elapsed = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
            }, 1000)
        }
    },
    mounted() {
        this.startTimer()
    },
}
</script>
<style lang="">

</style>