<template>
    <div>
        <nav class="border-b border-b-gray-600 ">
            <div class="flex flex-wrap items-center justify-between px-2 sm:px-10 py-4">
                <a href="#" class="flex items-center space-x-3 rtl:space-x-reverse">
                    <img src="../assets/logo.png" class="h-8" alt="Flowbite Logo" />
                    <span class="self-center text-2xl font-semibold whitespace-nowrap text-white">Dominoes</span>
                </a>
                <!-- <button data-collapse-toggle="navbar-default" type="button"
                    class="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                    aria-controls="navbar-default" aria-expanded="false">
                    <span class="sr-only">Open main menu</span>
                    <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                        viewBox="0 0 17 14">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M1 1h15M1 7h15M1 13h15" />
                    </svg>
                </button> -->
                <div class="block md:w-auto" id="navbar-default">
                    <ul>
                        <!-- <li>
                            <a href="#"
                                class="block py-2 px-3 bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 "
                                aria-current="page">Home
                            </a>
                        </li> -->
                        <li>
                            <router-link to="/practice"
                                class="block py-2 px-6 hover:bg-blue-600 bg-blue-700 rounded-lg text-white"
                                aria-current="page">Play now
                            </router-link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    </div>
</template>
<script>
export default {

}
</script>
