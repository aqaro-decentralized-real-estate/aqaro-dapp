<script setup lang="ts">
import { EnvelopeIcon} from '@heroicons/vue/20/solid'
import {formatDollars, getEthPrice} from "@/utils/helpers";
import {onBeforeMount, ref} from "vue";
type Seller = {
    wallet: string,
    name: string,
    email: string,
    status: number
}
type Property = {
    addr: Address,
    askingPrice: string,
    price: string,
    id: string,
    seller: Seller,
    description: string,
    created: string
}
type Address = {
    street: string;
    city: string;
    state: string;
    country: string;
    zip: string;
}

const storage = import.meta.env.VITE_STORAGE_URL;

const ETH_PRICE = ref(0);

onBeforeMount(async () => {
    ETH_PRICE.value = await getEthPrice();
});

defineProps({
    property: {
        type: Object,
        required: true,
    },
    files: {
        type: Array,
        required: true,
    },
    contractOpenDate: {
        type: Date,
        required: true
    },
    propertyContractAddress: {
        type: String,
        required: true
    },
    bidOpen: {
        type: Boolean,
        required: true
    },
})

</script>
<template>
    <div class="bg-gray-900">
        <div class="pt-6">
            <div class="mx-auto mt-6 text-white max-w-2xl sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:gap-x-8 lg:px-8">
                <div v-for="(file, key) in files" :key="key">
                    <div class="col-span-1 gap-4 mb-4 rounded-xl">
                        <img :src="file" class="h-full w-full object-cover object-center rounded-xl" />
                    </div>
                </div>
            </div>

            <div class="mx-auto max-w-2xl px-4 pb-16 pt-10 sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:grid-rows-[auto,auto,1fr] lg:gap-x-8 lg:px-8 lg:pb-24 lg:pt-16">
                <div class="lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8">
                    <h1 class="text-2xl font-bold tracking-tight text-gray-200 sm:text-3xl">{{ property.addr.street }}</h1>
                    <h2 class="text-xl font-bold tracking-tight text-gray-400">{{ property.addr.city }} | {{ property.addr.state }}</h2>
                    <h2 class="text-xl font-bold tracking-tight text-gray-400">{{ property.addr.zip }}</h2>
                </div>

                <div class="mt-8 lg:row-span-3">
                    <h2 class="sr-only">Property information</h2>
                    <p class="text-2xl tracking-tight text-white">{{ formatDollars(property.price) }}</p>
                    <p class="text-xl tracking-tight text-white">{{ Number(property.price / ETH_PRICE).toFixed(6) }}ETH</p>

<!--                    <p class="text-gray-400 mt-8">-->
<!--                        Sale start date: <br>-->
<!--                        {{contractOpenDate}}-->
<!--                    </p>-->

                    <div class="mt-8 bg-gray-800 rounded-xl">
                        <div class="flex w-full items-center justify-between space-x-6 p-6">
                            <div class="flex-1 truncate">
                                <div class="flex items-center space-x-3">
                                    <h3 class="truncate text-sm font-medium text-gray-300">{{ property.seller.name }}</h3>
                                    <span v-if="property.seller.status === 0" class="inline-flex flex-shrink-0 items-center rounded-full bg-red-50 px-1.5 py-0.5 text-xs font-medium text-red-700 ring-1 ring-inset ring-green-600/20">
                                        KYC: NONE
                                    </span>
                                    <span v-if="property.seller.status === 1" class="inline-flex flex-shrink-0 items-center rounded-full bg-yellow-50 px-1.5 py-0.5 text-xs font-medium text-yellow-700 ring-1 ring-inset ring-green-600/20">
                                        KYC: PENDING
                                    </span>
                                    <span v-if="property.seller.status === 2" class="inline-flex flex-shrink-0 items-center rounded-full bg-green-50 px-1.5 py-0.5 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                                        KYC: VERIFIED
                                    </span>
                                </div>
                                <p class="mt-1 truncate text-sm text-gray-500">{{ property.seller.wallet }}</p>
                                <div class="truncate text-sm text-gray-500">
<!--                                    <a :href="`mailto:${property.seller.email}`" class="flex py-4 text-sm font-semibold text-gray-300">-->
<!--                                        <EnvelopeIcon class="h-5 w-5 text-gray-300" aria-hidden="true" />-->
<!--                                        <span class="pl-2">Email</span>-->
<!--                                    </a>-->
                                </div>
                            </div>
                        </div>
                    </div>


                    <button v-if="bidOpen" class="mt-10 flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                        Make Offer
                    </button>
                    <RouterLink :to="{name: 'mortgage.property.request', params: {address: propertyContractAddress}, query: {link: 'request-top'}}" class="mt-10 flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                        Request mortgage
                    </RouterLink>
                </div>

                <div class="py-10 lg:col-span-2 lg:col-start-1 lg:border-r lg:border-gray-200 lg:pb-16 lg:pr-8 lg:pt-6">
                    <div>
                        <div class="space-y-6">
                            <p class="text-base text-gray-400">
                                {{ property.description }}
                            </p>
                        </div>
                    </div>

<!--                    <div class="mt-10">-->
<!--                        <h3 class="text-sm font-medium text-indigo-500">Highlights</h3>-->

<!--                        <div class="mt-4">-->
<!--                            <ul role="list" class="list-disc space-y-2 pl-4 text-sm">-->
<!--                                <li v-for="highlight in product.highlights" :key="highlight" class="text-gray-400">-->
<!--                                    <span class="text-gray-400">{{ highlight }}</span>-->
<!--                                </li>-->
<!--                            </ul>-->
<!--                        </div>-->
<!--                    </div>-->

<!--                    <div class="mt-10">-->
<!--                        <h2 class="text-sm font-medium text-indigo-500">Details</h2>-->

<!--                        <div class="mt-4 space-y-6">-->
<!--                            <p class="text-sm text-gray-400">-->
<!--                                Located in the heart of downtown, this apartment offers easy access to a wide range of local amenities.-->
<!--                                Take a stroll to the nearby park and enjoy a picnic on a sunny day, or explore the bustling local market with its fresh produce and artisanal goods.-->
<!--                                For your daily needs, there are several grocery stores and convenience stores within walking distance, while a wide range of cafes, restaurants, and bars offer plenty of options for dining and entertainment.-->
<!--                                With excellent public transportation links nearby, you're just a short ride away from all that the city has to offer.-->
<!--                                Come see for yourself and discover the convenience and charm of this vibrant neighborhood.-->
<!--                            </p>-->
<!--                        </div>-->
<!--                    </div>-->
                </div>
            </div>
        </div>
    </div>
</template>