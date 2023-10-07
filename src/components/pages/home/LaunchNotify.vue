<script setup lang="ts">
import {ref} from "vue";
import Subscribe from "@/components/form/Subscribe.vue";

enum subscribeType {
    Launch = 'Launch',
    Newsletter = 'Newsletter'
}
</script>
<template>
    <div class="bg-gray-800 py-16 sm:py-24">
        <div class="mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div class="relative isolate overflow-hidden bg-gray-900 px-6 py-24 shadow-2xl sm:rounded-3xl sm:px-24 xl:py-32">
                <h2 class="mx-auto max-w-2xl text-center text-3xl font-bold tracking-tight text-white sm:text-4xl">Get notified when we’re launching.</h2>
                <p class="mx-auto mt-2 max-w-xl text-center text-lg leading-8 text-gray-300">
                    Be the first to experience the future of housing - sign up for our launch notifications and get ready to join the decentralized housing revolution.
                </p>
                <div class="md:flex md:max-w-md gap-x-4 mx-auto mt-10 ">
                    <div class="block">
                        <Subscribe :subType="subscribeType.Launch" :buttonText="'Notify me'" />
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>
