<template>
    <div class="ml-20">
        <div v-if="loading">
            <div>
                <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 loader"></div>
            </div>
        </div>
        <div v-else class="px-20 pt-5 relative text-gray-200">
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            loading: true
        }
    },
}
</script>
<style>
.loader {
    width: 85px;
    height: 50px;
    --g1: conic-gradient(from 90deg at left 3px top 3px, #ffffff 90deg, #fff 0);
    --g2: conic-gradient(from -90deg at bottom 3px right 3px, #0000 90deg, #fff 0);
    background: var(--g1), var(--g1), var(--g1), var(--g2), var(--g2), var(--g2);
    background-position: left, center, right;
    background-repeat: no-repeat;
    animation: l9 1s infinite;
}

@keyframes l9 {
    0% {
        background-size: 25px 50%, 25px 50%, 25px 50%
    }

    25% {
        background-size: 25px 100%, 25px 50%, 25px 50%
    }

    50% {
        background-size: 25px 50%, 25px 100%, 25px 50%
    }

    75% {
        background-size: 25px 50%, 25px 50%, 25px 100%
    }

    100% {
        background-size: 25px 50%, 25px 50%, 25px 50%
    }
}
</style>