<script setup lang="ts">
import {onBeforeMount, onMounted, ref} from "vue";
import {walletConnectionStore} from "@/stores/wallet.store";
import {useRoute} from "vue-router";
import Property from "@/chain/Property";
import {Property as PropertyType} from "@/types/Property";
import {ethers} from "ethers";
import Show from "@/components/pages/property/show.vue";
import {propertyStore} from "@/stores/property.store";

const store = walletConnectionStore();
const propStore = propertyStore();
const route = useRoute();

const loaded = ref(false);
const property = ref({} as PropertyType);
const propFiles = ref([]);
const highestBid = ref('0');
const bidOpen = ref(false);
const contractOpenDate = ref(new Date());
const propertyContractAddress = ref('');

onBeforeMount(async () => {
    if (route.params.address) {
        propertyContractAddress.value = `${route.params.address}`;
        await getPropertyChain(`${route.params.address}`);
        await getPropertyService(property.value.service_id);
        await getBidOpen(`${route.params.address}`);

        await getHighestBid(`${route.params.address}`);
    }

    loaded.value = true;
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

async function getPropertyChain(address: string) {
    const contract = new Property(store.getChainId, address);

    await contract.getPropertyInfo()
        .then(async (result: PropertyType) => {
            property.value = {
                id: result.id.toString(),
                service_id: result.service_id.toString(),
                askingPrice: result.askingPrice.toString(),
                price: `${Number(result.price.toString()) / 1e6}`,
                description: result.description,
                addr: {
                    street: result.addr.street,
                    city: result.addr.city,
                    state: result.addr.state,
                    country: result.addr.country,
                    zip: result.addr.zip
                },
                seller: {
                    wallet: result.seller.wallet,
                    name: result.seller.name,
                    email: result.seller.email,
                    status: result.seller.status
                },
                created: result.created.toString()
            }
            // property.value = result;
        })
        .catch((error: any) => {
            console.log(error);
        });
}

async function getPropertyService(id: string) {
    await propStore.getProperty(id)
        .then(response => {
            console.log(response.data)
            propFiles.value = response.data.files;
        });

}

async function getBidOpen(address: string) {
    const contract = new Property(store.getChainId, address);

    await contract.biddingOpenTime()
        .then(async (result: any) => {
            const currentDate = new Date().getTime();
            const contractOpenTime = new Date(result.toString() * 1000).getTime();
            // @ts-ignore
            contractOpenDate.value = new Date(result.toString() * 1000).toLocaleString();

            bidOpen.value = currentDate >= contractOpenTime;
        })
        .catch((error: any) => {
            console.log(error);
        });
}

async function getHighestBid(address: string) {
    const contract = new Property(store.getChainId, address);

    await contract.getHighestBid()
        .then(async (result: any) => {
            highestBid.value = ethers.utils.formatEther(result.toString());
        })
        .catch((error: any) => {
            console.log(error);
        });
}
</script>
<template>
    <div class="bg-gray-900">
      <Show id="property-top" v-if="store.isConnected && loaded"
        :property="property"
        :files="propFiles"
        :contractOpenDate="contractOpenDate"
        :propertyContractAddress="propertyContractAddress"
        :bidOpen="bidOpen"
      />
    </div>
</template>
