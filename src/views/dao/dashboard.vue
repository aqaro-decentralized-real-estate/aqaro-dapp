<script setup lang="ts">
import Feed from "@/components/pages/dao/dashboard/Feed.vue";
import {onBeforeMount, ref} from "vue";
import {Menu, MenuButton, MenuItem, MenuItems} from '@headlessui/vue'
import {
    ChatBubbleLeftEllipsisIcon,
    CodeBracketIcon,
    EllipsisVerticalIcon,
    EyeIcon,
    FlagIcon,
    HandThumbUpIcon,
    ShareIcon,
    StarIcon,
} from '@heroicons/vue/20/solid'
import MortgageFactory from "@/chain/MortgageFactory";
import {walletConnectionStore} from "@/stores/wallet.store";
import Mortgage from "@/chain/Mortgage";
import Property from "@/chain/Property";
import {Property as PropertyType} from "@/types/Property";

const store = walletConnectionStore();

const dashboardFeed = ref<Feed[]>([]);

const mortgage = ref({amount: 0, buyer: ''});
const property = ref({} as PropertyType);
const propertyAddress = ref('');

onBeforeMount(async () => {
    const contract = new MortgageFactory(store.getChainId);
    await contract.getMortgageContracts()
      .then(async res => {
        if (res.length > 0) {
            for(let i = 0; i < res.length; i++) {
                await getMortgageRequest(res[i])
            }
        }
    }).catch((err) => {
        console.log(err);
    });
});

const getMortgageRequest = async (res: string) => {
    const contract = new Mortgage(store.getChainId, res);

    await contract.getMortgageAmount()
      .then(async response => {
          mortgage.value.amount = response;
      }).catch((err) => {
          console.log(err);
      });

    await contract.getBuyer()
      .then(async response => {
          mortgage.value.buyer = response;
      }).catch((err) => {
          console.log(err);
      });


    await contract.getPropertyAddress()
      .then(async response => {
          propertyAddress.value = response;
          await getProperty(response);
      }).catch((err) => {
          console.log(err);
      });

    await setTimeline();
}

const getProperty = async (address: string) => {
    const contract = new Property(store.getChainId, address);
    await contract.getPropertyInfo()
      .then(async result => {
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
          };
      }).catch((err) => {
          console.log(err);
      })
}


const setTimeline = async () => {
    const feed: Feed = {
        property: property.value,
        mortgage: mortgage.value
    }
    dashboardFeed.value.push(feed);
}
</script>
<template>
    <main class="lg:pl-72 bg-gray-800 min-h-screen">
        <div class="grid grid-cols-12 gap-4 px-4 pt-4">
            <div class="col-span-12 md:col-span-9">
                <div>
                    <div>
                        <h1 class="sr-only">Recent Requests</h1>
                        <div v-if="dashboardFeed.length > 0" role="list" class="space-y-4">
                            <div v-for="(req, key) in dashboardFeed" :key="key" class="bg-gray-900 px-4 py-6 shadow sm:rounded-lg sm:p-6">
                                <article :aria-labelledby="'question-title-' + key">
                                    <div>
                                        <div class="flex space-x-3">
                                            <div class="min-w-0 flex-1">
                                                <p class="text-xs font-medium text-gray-500">
                                                    Mortgage Requested by:
                                                    {{ req.mortgage.buyer }}
                                                </p>
                                                <p class="text-sm text-gray-500">
    <!--                                                <a :href="question.href" class="hover:underline">-->
    <!--                                                    <time :datetime="question.datetime">{{ question.date }}</time>-->
    <!--                                                </a>-->
                                                </p>
                                            </div>
                                        </div>
                                        <div :id="'question-title-' + key" >
                                            <RouterLink :to="{name: 'property.detail', params: {address: propertyAddress}}" class="group">
                                                <div>
                                                    <h2 class="mt-4 text-base font-medium text-gray-500 group-hover:text-indigo-600">
                                                        {{ req.property.addr.street }}
                                                    </h2>
                                                    <h2 class="text-base font-medium text-gray-500 group-hover:text-indigo-600">
                                                        {{ req.property.addr.city }}, {{ req.property.addr.state }}
                                                    </h2>
                                                    <h2 class="text-base font-medium text-gray-500 group-hover:text-indigo-600">
                                                        {{ req.property.addr.zip }}
                                                    </h2>
                                                    <div class="text-xs text-indigo-500">
                                                        Sold by: {{ req.property.seller.name }} <br>
                                                        <a :href="`https://sepolia.etherscan.io/address/${req.property.seller.wallet}`" target="_blank" class="text-indigo-500">
                                                            {{ req.property.seller.wallet }}
                                                        </a>
                                                    </div>
                                                </div>
                                            </RouterLink>
                                        </div>
                                    </div>
                                    <div class="mt-2 space-y-4 text-sm text-gray-500" v-html="req.property.description" />
                                    <div class="mt-2 space-y-4 text-sm text-gray-500">
                                        {{req.mortgage.amount.toString()}}
                                    </div>
<!--                                    <div class="mt-6 flex justify-between space-x-8">-->
<!--                                        <div class="flex space-x-6">-->
<!--                                            <span class="inline-flex items-center text-sm">-->
<!--                                                <button type="button" class="inline-flex space-x-2 text-gray-400 hover:text-gray-500">-->
<!--                                                    <HandThumbUpIcon class="h-5 w-5" aria-hidden="true" />-->
<!--    &lt;!&ndash;                                                <span class="font-medium text-gray-900">{{ question.likes }}</span>&ndash;&gt;-->
<!--                                                    <span class="sr-only">likes</span>-->
<!--                                                </button>-->
<!--                                            </span>-->
<!--                                            <span class="inline-flex items-center text-sm">-->
<!--                                                <button type="button" class="inline-flex space-x-2 text-gray-400 hover:text-gray-500">-->
<!--                                                    <ChatBubbleLeftEllipsisIcon class="h-5 w-5" aria-hidden="true" />-->
<!--    &lt;!&ndash;                                                <span class="font-medium text-gray-900">{{ question.replies }}</span>&ndash;&gt;-->
<!--                                                    <span class="sr-only">replies</span>-->
<!--                                                </button>-->
<!--                                            </span>-->
<!--                                            <span class="inline-flex items-center text-sm">-->
<!--                                                <button type="button" class="inline-flex space-x-2 text-gray-400 hover:text-gray-500">-->
<!--                                                    <EyeIcon class="h-5 w-5" aria-hidden="true" />-->
<!--    &lt;!&ndash;                                                <span class="font-medium text-gray-900">{{ question.views }}</span>&ndash;&gt;-->
<!--                                                    <span class="sr-only">views</span>-->
<!--                                                </button>-->
<!--                                            </span>-->
<!--                                        </div>-->
<!--                                    </div>-->
                                </article>
                            </div>
                        </div>
                        <div v-else class="bg-gray-900 px-4 py-6 text-white shadow sm:rounded-lg sm:p-6">
                            No Recent Requests
                        </div>
                    </div>
                </div>
            </div>
            <aside class="hidden md:block md:col-span-3">
                <div class="bg-gray-900 px-4 py-6 shadow sm:rounded-lg sm:p-6">
                    <Feed />
                </div>
                <div class="bg-gray-900 mt-4 px-4 py-6 shadow sm:rounded-lg sm:p-6">
                    <Feed />
                </div>
            </aside>
        </div>
    </main>


</template>