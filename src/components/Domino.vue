<template>
    <div>
        <div v-if="!placeHorizontal" class="domino-vertical" :class="{ 'bottom-2': selected }">
            <div class="h-full relative">
                <template v-if="domino.top === 1">
                    <div class="dot center"></div>
                </template>
                <template v-if="domino.top === 2">
                    <div class="dot top-left"></div>
                    <div class="dot bottom-right"></div>
                </template>
                <template v-if="domino.top === 3">
                    <div class="dot top-left"></div>
                    <div class="dot center"></div>
                    <div class="dot bottom-right"></div>
                </template>
                <template v-if="domino.top === 4">
                    <div class="dot top-left"></div>
                    <div class="dot top-right"></div>
                    <div class="dot bottom-left"></div>
                    <div class="dot bottom-right"></div>
                </template>
                <template v-if="domino.top === 5">
                    <div class="dot top-left"></div>
                    <div class="dot top-right"></div>
                    <div class="dot center"></div>
                    <div class="dot bottom-left"></div>
                    <div class="dot bottom-right"></div>
                </template>
                <template v-if="domino.top === 6">
                    <div class="dot top-left"></div>
                    <div class="dot center-left"></div>
                    <div class="dot bottom-left"></div>
                    <div class="dot top-right"></div>
                    <div class="dot center-right"></div>
                    <div class="dot bottom-right"></div>
                </template>
            </div>
            <div class="h-px bg-gray-600 border-0 dark:bg-gray-700"></div>
            <div class="h-full relative">
                <template v-if="domino.bottom === 1">
                    <div class="dot center"></div>
                </template>
                <template v-if="domino.bottom === 2">
                    <div class="dot top-left"></div>
                    <div class="dot bottom-right"></div>
                </template>
                <template v-if="domino.bottom === 3">
                    <div class="dot top-left"></div>
                    <div class="dot center"></div>
                    <div class="dot bottom-right"></div>
                </template>
                <template v-if="domino.bottom === 4">
                    <div class="dot top-left"></div>
                    <div class="dot top-right"></div>
                    <div class="dot bottom-left"></div>
                    <div class="dot bottom-right"></div>
                </template>
                <template v-if="domino.bottom === 5">
                    <div class="dot top-left"></div>
                    <div class="dot top-right"></div>
                    <div class="dot center"></div>
                    <div class="dot bottom-left"></div>
                    <div class="dot bottom-right"></div>
                </template>
                <template v-if="domino.bottom === 6">
                    <div class="dot top-left"></div>
                    <div class="dot center-left"></div>
                    <div class="dot bottom-left"></div>
                    <div class="dot top-right"></div>
                    <div class="dot center-right"></div>
                    <div class="dot bottom-right"></div>
                </template>
            </div>
        </div>
        <div v-if="placeHorizontal" class="domino-horizontal">
            <div class="h-full w-full relative">
                <template v-if="domino.top === 1">
                    <div class="dot center"></div>
                </template>
                <template v-if="domino.top === 2">
                    <div class="dot top-left"></div>
                    <div class="dot bottom-right"></div>
                </template>
                <template v-if="domino.top === 3">
                    <div class="dot top-left"></div>
                    <div class="dot center"></div>
                    <div class="dot bottom-right"></div>
                </template>
                <template v-if="domino.top === 4">
                    <div class="dot top-left"></div>
                    <div class="dot top-right"></div>
                    <div class="dot bottom-left"></div>
                    <div class="dot bottom-right"></div>
                </template>
                <template v-if="domino.top === 5">
                    <div class="dot top-left"></div>
                    <div class="dot top-right"></div>
                    <div class="dot center"></div>
                    <div class="dot bottom-left"></div>
                    <div class="dot bottom-right"></div>
                </template>
                <template v-if="domino.top === 6">
                    <div class="dot top-left"></div>
                    <div class="dot top-center"></div>
                    <div class="dot top-right"></div>
                    <div class="dot bottom-left"></div>
                    <div class="dot bottom-center"></div>
                    <div class="dot bottom-right"></div>
                </template>
            </div>
            <div class="w-px bg-gray-200 border-0 dark:bg-gray-700"></div>
            <div class="h-full w-full relative">
                <template v-if="domino.bottom === 1">
                    <div class="dot center"></div>
                </template>
                <template v-if="domino.bottom === 2">
                    <div class="dot top-left"></div>
                    <div class="dot bottom-right"></div>
                </template>
                <template v-if="domino.bottom === 3">
                    <div class="dot top-left"></div>
                    <div class="dot center"></div>
                    <div class="dot bottom-right"></div>
                </template>
                <template v-if="domino.bottom === 4">
                    <div class="dot top-left"></div>
                    <div class="dot top-right"></div>
                    <div class="dot bottom-left"></div>
                    <div class="dot bottom-right"></div>
                </template>
                <template v-if="domino.bottom === 5">
                    <div class="dot top-left"></div>
                    <div class="dot top-right"></div>
                    <div class="dot center"></div>
                    <div class="dot bottom-left"></div>
                    <div class="dot bottom-right"></div>
                </template>
                <template v-if="domino.bottom === 6">
                    <div class="dot top-left"></div>
                    <div class="dot top-center"></div>
                    <div class="dot top-right"></div>
                    <div class="dot bottom-left"></div>
                    <div class="dot bottom-center"></div>
                    <div class="dot bottom-right"></div>
                </template>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        domino: {
            type: Object,
            required: true
        },
        placeHorizontal: {
            type: Boolean,
            required: false,
            default: false
        },
        selected: {
            type: Boolean,
            required: false,
            default: false
        }
    }
}
</script>

<style scoped>
.dot {
    width: 10px;
    height: 10px;
    background-color: black;
    border-radius: 50%;
}

.center {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

.top-left {
    position: absolute;
    top: 10%;
    left: 10%;
}

.center-left {
    position: absolute;
    bottom: 39%;
    left: 10%;
}

.bottom-left {
    position: absolute;
    bottom: 10%;
    left: 10%;
}

.top-right {
    position: absolute;
    top: 10%;
    right: 10%;
}

.center-right {
    position: absolute;
    bottom: 39%;
    right: 10%;
}

.bottom-right {
    position: absolute;
    bottom: 10%;
    right: 10%;
}

.top-center {
    position: absolute;
    top: 10%;
    left: 39%;
}

.bottom-center {
    position: absolute;
    bottom: 10%;
    left: 39%;
}

.domino-vertical {
    @apply bg-white rounded-lg border border-black h-24 w-14 px-1 flex justify-between flex-col relative cursor-pointer;
}

.domino-horizontal {
    @apply bg-white rounded-lg border border-black h-14 w-24 py-1 flex justify-between flex-row relative cursor-pointer;
}

@media screen and (max-width: 1024px) {

    .dot {
        width: 7px;
        height: 7px;
        background-color: black;
        border-radius: 50%;
    }

    .center {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }

    .top-left {
        position: absolute;
        top: 10%;
        left: 10%;
    }

    .center-left {
        position: absolute;
        bottom: 39%;
        left: 10%;
    }

    .bottom-left {
        position: absolute;
        bottom: 10%;
        left: 10%;
    }

    .top-right {
        position: absolute;
        top: 10%;
        right: 10%;
    }

    .center-right {
        position: absolute;
        bottom: 39%;
        right: 10%;
    }

    .bottom-right {
        position: absolute;
        bottom: 10%;
        right: 10%;
    }

    .top-center {
        position: absolute;
        top: 10%;
        left: 39%;
    }

    .bottom-center {
        position: absolute;
        bottom: 10%;
        left: 39%;
    }

    .domino-vertical {
        @apply bg-white rounded-lg border border-black h-16 w-10 px-1 flex justify-between flex-col relative cursor-pointer;
    }

    .domino-horizontal {
        @apply bg-white rounded-lg border border-black h-10 w-16 py-1 flex justify-between flex-row relative cursor-pointer;
    }
}
</style>
