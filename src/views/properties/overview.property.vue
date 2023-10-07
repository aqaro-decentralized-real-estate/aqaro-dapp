<script setup lang="ts">
import {onBeforeMount, onMounted, ref} from "vue";
import {getEthPrice} from "@/utils/helpers";
import {walletConnectionStore} from "@/stores/wallet.store";
import PropertyGrid from "@/components/pages/property/Grid.vue";
import PropertyFactory from "@/chain/PropertyFactory";
import Property from "@/chain/Property";
import {propertyStore} from "@/stores/property.store";
import {useRoute} from "vue-router";
const store = walletConnectionStore();
const propStore = propertyStore();
type PropertyType = {
    id: string,
    askingPrice: string,
    price: string,
    addr: Address,
    seller: string,
    address: string,
    thumbnail: string
}

type Address = {
    street: string;
    city: string;
    state: string;
    country: string;
    zip: string;
}

const route = useRoute();

const properties = ref<PropertyType[]>([]);
const ETH_PRICE = ref(0);
const propertyContracts = ref([]);

onBeforeMount(async() => {
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
            properties.value.push(property)
        })
        .catch((error: any) => {
            console.log(error);
        });
}
</script>
<template>
    <div id="property-top" class="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
     <PropertyGrid :properties="properties" :ETH_PRICE="ETH_PRICE" />
    </div>
</template>
