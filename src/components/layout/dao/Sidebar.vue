<script setup lang="ts">
import { Dialog, DialogPanel, TransitionChild, TransitionRoot } from '@headlessui/vue'
import {
    Bars3Icon,
    HomeModernIcon,
    PresentationChartLineIcon,
    HomeIcon,
    XMarkIcon,
} from '@heroicons/vue/24/outline'
import {walletConnectionStore} from "@/stores/wallet.store";
import {formatAddress} from "@/utils/helpers";
import {ref} from "vue";

const store = walletConnectionStore();

const navigation = [
    { name: 'Dashboard', href: 'dao.dashboard', icon: HomeIcon, current: true },
    { name: 'Mortgages', href: 'dao.mortgage.overview', icon: HomeModernIcon, current: false },
    { name: 'Proposals', href: 'dao.proposal.overview', icon: PresentationChartLineIcon, current: false },
    // { name: 'Liquidity Pool', href: '#', icon: CalendarIcon, current: false },
    // { name: 'Documents', href: '#', icon: DocumentDuplicateIcon, current: false },
    // { name: 'Reports', href: '#', icon: ChartPieIcon, current: false },
]
const tokenInfo = [
    { id: 1, name: 'Earned', href: '#', initial: 'E', current: false },
    { id: 2, name: 'Staked', href: '#', initial: 'S', current: false },
    { id: 3, name: 'Balance', href: '#', initial: 'B', current: false },
]

const sidebarOpen = ref(false);
</script>
<template>
    <TransitionRoot as="template" class="bg-gray-900" :show="sidebarOpen">
        <Dialog as="div" class="relative z-50 lg:hidden" @close="sidebarOpen = false">
            <TransitionChild as="template" enter="transition-opacity ease-linear duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="transition-opacity ease-linear duration-300" leave-from="opacity-100" leave-to="opacity-0">
                <div class="fixed inset-0 bg-gray-900/80" />
            </TransitionChild>

            <div class="fixed inset-0 flex">
                <TransitionChild as="template" enter="transition ease-in-out duration-300 transform" enter-from="-translate-x-full" enter-to="translate-x-0" leave="transition ease-in-out duration-300 transform" leave-from="translate-x-0" leave-to="-translate-x-full">
                    <DialogPanel class="relative mr-16 flex w-full max-w-xs flex-1">
                        <TransitionChild as="template" enter="ease-in-out duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="ease-in-out duration-300" leave-from="opacity-100" leave-to="opacity-0">
                            <div class="absolute left-full top-0 flex w-16 justify-center pt-5">
                                <button type="button" class="-m-2.5 p-2.5" @click="sidebarOpen = false">
                                    <span class="sr-only">Close sidebar</span>
                                    <XMarkIcon class="h-6 w-6 text-white" aria-hidden="true" />
                                </button>
                            </div>
                        </TransitionChild>
                        <!-- Sidebar component, swap this element with another sidebar if you like -->
                        <div class="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-2">
                            <div class="flex h-16 shrink-0 items-center">
                                <RouterLink :to="{name: 'home'}" class="-m-1.5 p-1.5">
                                    <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">Aqaro</h2>
                                </RouterLink>
                            </div>
                            <nav class="flex flex-1 flex-col">
                                <ul role="list" class="flex flex-1 flex-col gap-y-7">
                                    <li>
                                        <RouterLink :to="{name: 'dao.dashboard'}" class="group text-gray-700 hover:text-indigo-600 hover:bg-gray-700 flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold">
                                            <HomeIcon class="mr-4 flex-shrink-0 h-6 w-6 text-gray-300" aria-hidden="true" />
                                            Dashboard
                                        </RouterLink>
<!--                                        <RouterLink :to="{name: 'dao.mortgage.overview'}" class="group text-gray-700 hover:text-indigo-600 hover:bg-gray-700 flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold">-->
<!--                                            <HomeModernIcon class="mr-4 flex-shrink-0 h-6 w-6 text-gray-300" aria-hidden="true" />-->
<!--                                            Mortgages-->
<!--                                        </RouterLink>-->
                                        <RouterLink :to="{name: 'dao.proposal.overview'}" class="group text-gray-700 hover:text-indigo-600 hover:bg-gray-700 flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold">
                                            <PresentationChartLineIcon class="mr-4 flex-shrink-0 h-6 w-6 text-gray-300" aria-hidden="true" />
                                            Proposals
                                        </RouterLink>
                                    </li>
                                </ul>
                            </nav>
                        </div>
                    </DialogPanel>
                </TransitionChild>
            </div>
        </Dialog>
    </TransitionRoot>

  <!-- Static sidebar for desktop -->
    <div class="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <!-- Sidebar component, swap this element with another sidebar if you like -->
        <div class="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-gray-900 px-6">
            <div class="flex h-16 shrink-0 items-center">
                <RouterLink :to="{name: 'home'}" class="-m-1.5 p-1.5">
                    <h2 class="text-2xl font-bold leading-7 text-white sm:truncate sm:text-3xl sm:tracking-tight">Aqaro</h2>
                </RouterLink>
            </div>
            <nav class="flex flex-1 flex-col">
                <ul role="list" class="flex flex-1 flex-col gap-y-7">
                    <li>
                        <RouterLink :to="{name: 'dao.dashboard'}" class="group text-gray-500 hover:bg-gray-700 flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold">
                            <HomeIcon class="mr-4 flex-shrink-0 h-6 w-6 text-gray-500" aria-hidden="true" />
                            Dashboard
                        </RouterLink>
<!--                        <RouterLink :to="{name: 'dao.mortgage.overview'}" class="group text-gray-500 hover:bg-gray-700 flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold">-->
<!--                            <HomeModernIcon class="mr-4 flex-shrink-0 h-6 w-6 text-gray-500" aria-hidden="true" />-->
<!--                            Mortgages-->
<!--                        </RouterLink>-->
                        <RouterLink :to="{name: 'dao.proposal.overview'}" class="group text-gray-500 hover:bg-gray-700 flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold">
                            <PresentationChartLineIcon class="mr-4 flex-shrink-0 h-6 w-6 text-gray-500" aria-hidden="true" />
                            Proposals
                        </RouterLink>
                    </li>

                    <li class="-mx-6 mt-auto">
                        <span v-if="store.isConnected" class="flex items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-white hover:bg-gray-800">
<!--                            <img class="h-8 w-8 rounded-full bg-gray-50" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" />-->
                            <span class="sr-only">Your profile</span>
                            <span aria-hidden="true">
                                <span class="inline-flex items-center gap-x-1.5">
                                    <svg class="h-2 w-2 fill-green-400" viewBox="0 0 6 6" aria-hidden="true">
                                      <circle cx="3" cy="3" r="3" />
                                    </svg>
                                    <span>{{ formatAddress(store.getConnectedWallet) }}</span>
                                </span>
                            </span>
                        </span>
                    </li>
                </ul>
            </nav>
        </div>
    </div>
    <div class="sticky top-0 bg-gray-900 z-40 flex items-center gap-x-6 px-4 py-4 shadow-sm sm:px-6 lg:hidden">
        <button type="button" class="-m-2.5 p-2.5 text-gray-700 lg:hidden" @click="sidebarOpen = true">
            <span class="sr-only">Open sidebar</span>
            <Bars3Icon class="h-6 w-6" aria-hidden="true" />
        </button>
        <div class="flex-1 text-sm font-semibold leading-6 text-gray-900">Dashboard</div>
<!--        <a href="#">-->
<!--            <span class="sr-only">Your profile</span>-->
<!--            <img class="h-8 w-8 rounded-full bg-gray-50" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" />-->
<!--        </a>-->
    </div>
</template>
<style scoped>
.router-link-active {
    background-color: #1f2937;
    color: #4f46e5;
}
.router-link-active svg {
    color: #4f46e5;
}
</style>