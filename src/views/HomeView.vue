<script setup lang="ts">
import {onBeforeMount, onMounted, ref, watch} from "vue";
import {walletConnectionStore} from "@/stores/wallet.store";
import PropertyFactory from "@/chain/PropertyFactory";
import Property from "@/chain/Property";
import Hero from "@/components/pages/home/Hero.vue";
import LaunchNotify from "@/components/pages/home/LaunchNotify.vue";
import EarnAPY from "@/components/pages/home/EarnAPY.vue";
import {formatDollars, getEthPrice} from "@/utils/helpers";
import {useRoute} from "vue-router";
import PropertyGrid from "@/components/pages/property/Grid.vue";
import {propertyStore} from "@/stores/property.store";

const store = walletConnectionStore();
const propStore = propertyStore();
const route = useRoute();

type Address = {
    street: string;
    city: string;
    state: string;
    country: string;
    zip: string;
}

type PropertyType = {
    id: string,
    askingPrice: string,
    price: string,
    addr: Address,
    seller: string,
    address: string
}

const propertyContracts = ref([]);
const properties = ref<PropertyType[]>([]);
const ETH_PRICE = ref(0);

onBeforeMount(async() => {
    properties.value = [];
    ETH_PRICE.value = await getEthPrice();

    if (store.isConnected) {
        await fetchData();
    }
});

onMounted(async () => {
    const anchor = route.query.link;
    if (anchor) {
        const element = document.getElementById(`${anchor}`);
        if (element) {
            element.scrollIntoView();
        }
    }
});

async function fetchData() {
    properties.value = [];
    propertyContracts.value = [];
    await getAllPropertyContracts();
    if (propertyContracts.value.length > 0) {
        await getPropertyContracts();
    }
}

async function getAllPropertyContracts() {
  const contract = new PropertyFactory(store.getChainId);

  await contract.getAllPropertyContracts()
      .then(async (result: any) => {
        propertyContracts.value = result;
      })
      .catch((error: any) => {
        console.log(error);
      });
}

async function getPropertyContracts() {
    for (let i = 0; i < propertyContracts.value.length; i++) {
        await getPropertyByAddress(propertyContracts.value[i]);
    }
}

async function getPropertyByAddress(address: string) {
  const contract = new Property(store.getChainId, address);

    await contract.getPropertyInfo()
        .then(async (result: any) => {
            const property = {
                address: address,
                id: result.id.toString(),
                askingPrice: result.askingPrice.toString(),
                price: `${Number(result.price.toString()) / 1e6}`,
                addr: {
                    street: result.addr.street,
                    city: result.addr.city,
                    state: result.addr.state,
                    country: result.addr.country,
                    zip: result.addr.zip
                },
                seller: result.seller,
                thumbnail: ''
            }
            try {
                const serviceResult = await propStore.getPropertyThumbnail(property.id);
                property.thumbnail = serviceResult.data.thumbnail;
            } catch (e) {
                console.log(e);
            }

            // @ts-ignore
            properties.value.push(property);
        })
        .catch((error: any) => {
            console.log(error);
        });
}
//
// watch(store, async () => {
//   if (store.isConnected) {
//       properties.value = [];
//       propertyContracts.value = [];
//       await fetchData();
//   } else {
//     properties.value = [];
//     propertyContracts.value = [];
//   }
// });
</script>

<template>
    <div id="home-top">
        <Hero  />
        <div v-if="properties.length > 0" class="bg-gray-800">
            <div class="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
                <div class="flex items-center justify-between space-x-4">
                    <h2 class="text-lg font-medium text-white">Recent Listings</h2>
                    <RouterLink :to="{name: 'property.overview'}" class="whitespace-nowrap text-sm font-medium text-indigo-500 hover:text-indigo-600">
                        View all
                        <span aria-hidden="true"> &rarr;</span>
                    </RouterLink>
                </div>
                <PropertyGrid :properties="properties" :ETH_PRICE="ETH_PRICE" />
            </div>
        </div>
        <EarnAPY />
        <LaunchNotify />
    </div>
</template>
