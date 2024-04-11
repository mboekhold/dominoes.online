<template>
    <div>
        <div
            class="w-full max-w-md p-4 rounded-lg shadow sm:p-8 bg-gray-800 border-gray-700">
            <div class="flex items-center justify-between mb-4">
                <h5 class="text-xl font-bold leading-none  text-white">{{ room.name }}</h5>
                <a href="#" class="text-sm font-medium hover:underline text-blue-500">
                    Join
                </a>
            </div>
            <div class="flow-root">
                <ul role="list" class="divide-y divide-gray-700">
                    <li class="py-3 sm:py-4">
                        <div class="flex items-center">
                            <div class="flex-1 min-w-0 ms-4">
                                <p class="text-sm font-medium truncate text-white">
                                    Neil Sims
                                </p>
                            </div>
                            <div class="inline-flex items-center text-base font-semibold text-white">
                                Wins: 10
                            </div>
                        </div>
                    </li>
                    <li class="py-3 sm:py-4">
                        <div class="flex items-center ">
                            <div class="flex-1 min-w-0 ms-4">
                                <p class="text-sm font-medium truncate text-white">
                                    Bonnie Green
                                </p>
                            </div>
                            <div class="inline-flex items-center text-base font-semibold text-white">
                                Wins: 5
                            </div>
                        </div>
                    </li>
                    <li class="py-3 sm:py-4">
                        <div class="flex items-center">
                            <div class="flex-1 min-w-0 ms-4">
                                <p class="text-sm font-medium truncate text-white">
                                    Michael Gough
                                </p>
                            </div>
                            <div class="inline-flex items-center text-base font-semibold text-white">
                                Wins: 2
                            </div>
                        </div>
                    </li>
                    <li class="py-3 sm:py-4">
                        <div class="flex items-center ">
                            <div class="flex-1 min-w-0 ms-4">
                                <p class="text-sm font-medium truncate text-white">
                                    Lana Byrd
                                </p>
                            </div>
                            <div class="inline-flex items-center text-base font-semibold text-white">
                                Wins: 1
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        room: {
            type: Object,
            required: true
        }
    }
}
</script>