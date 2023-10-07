<script setup lang="ts">
import {formatDollars} from "@/utils/helpers";

const props = defineProps({
    properties: {
        type: Array,
        required: true,
    },
    ETH_PRICE: {
        type: Number,
        required: true,
    },
})
</script>
<template>
    <div class="mt-6 grid grid-cols-1 gap-x-8 gap-y-8 sm:grid-cols-2 sm:gap-y-10 lg:grid-cols-4">
        <div v-for="property in properties" :key="property.id" class="group relative bg-gray-900 rounded-2xl">
            <div class="aspect-h-3 aspect-w-4 overflow-hidden rounded-lg">
                <div class="relative overflow-hidden h-48">
                    <img
                      v-if="property.thumbnail !== ''"
                      class="h-full w-full object-cover object-center"
                      :src="property.thumbnail"
                      :alt="property.addr.street" />
                    <!--                      src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c" -->

                    <img
                      v-else
                        src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c"
                        :alt="property.addr.street" />
                </div>

                <div class="flex items-end p-4" aria-hidden="true">
                    <div class="w-full rounded-md bg-indigo-600 hover:bg-indigo-700 px-4 py-2 text-center text-sm font-medium text-white backdrop-blur backdrop-filter">
                        View Product
                    </div>
                </div>
            </div>
            <div class="p-5 block">
                <h2 class="text-2xl font-bold text-white">{{ property.addr.street }}</h2>
                <div class="flex items-center justify-between space-x-3 text-base font-medium text-gray-500">
                    <span class="text-base">
                        <RouterLink :to="{name: 'property.detail', params: {address: property.address}, query: {link: 'property-top'}}">
                            <span aria-hidden="true" class="absolute inset-0" />
                            <p>{{ property.addr.city }}</p>
                            <p>{{ property.addr.state }}</p>
                            <p>{{ property.addr.zip }} </p>
                        </RouterLink>
                    </span>
                </div>
                <!--                        <p class="mt-1 text-sm text-gray-500"><span>m2</span> <span>x rooms</span></p>-->
                <h3 class="mt-4 text-lg text-indigo-500">{{formatDollars(property.price)}}</h3>
                <h3 class="text-lg text-indigo-500">{{ Number(property.price / ETH_PRICE).toFixed(6) }}ETH</h3>
            </div>
        </div>
    </div>
</template>
