<script setup>
import { XMarkIcon } from '@heroicons/vue/20/solid';
import {ref} from "vue";

const show = ref(true);
</script>
<template>
    <div v-show="show" class="relative bg-yellow-500 isolate flex items-center gap-x-6 overflow-hidden bg-gray-50 px-6 py-2.5 sm:px-3.5 sm:before:flex-1">
        <p class="text-sm leading-6 text-gray-900">
            <span>
                Verify our url, must be: <span class="font-bold">https://aqaro.app</span>
            </span>
        </p>
        <div class="flex flex-1 justify-end">
            <button type="button" v-on:click="show = false" class="-m-3 p-3 focus-visible:outline-offset-[-4px]">
                <span class="sr-only">Dismiss</span>
                <XMarkIcon class="h-5 w-5 text-gray-900" aria-hidden="true" />
            </button>
        </div>
    </div>
</template>
