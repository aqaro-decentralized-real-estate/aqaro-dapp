<script setup lang="ts">
import {walletConnectionStore} from "@/stores/wallet.store";
import {onBeforeMount, ref} from "vue";
import {useRoute} from "vue-router";
import Feed from "@/components/pages/dao/dashboard/Feed.vue";
import {proposalStore} from "@/stores/proposal.store";
import {ChatBubbleLeftEllipsisIcon, EyeIcon, HandThumbUpIcon, HandThumbDownIcon} from "@heroicons/vue/20/solid";
import {tokenStore} from "@/stores/token.store";
import StakeVault from "@/chain/StakeVault";

const route = useRoute();
const store = proposalStore();
const aqaroStore = tokenStore();
const connectionStore = walletConnectionStore();

const proposals = ref<any[]>([]);
const loading = ref<boolean>(false);
const canCreate = ref<boolean>(false);

onBeforeMount(async () => {
    loading.value = true;
    store.setCanVote(false);

    await store.getAll()
        .then((response: any) => {
            if (response.status === 200) {
                proposals.value = response.data.proposals.data;
            }
        }).catch((error: any) => {
            console.log(error);
        });

    await getHolderBalances();

    loading.value = false;
});

async function getHolderBalances() {
    if (aqaroStore.getBalance !== '' && Number(aqaroStore.getBalance) > 0) {
        canCreate.value = true;
        store.setCanVote(true);
    }

    const contract = new StakeVault(connectionStore.getChainId);

    await contract.balanceOf(connectionStore.getConnectedWallet)
      .then((response) => {
          if (Number(response.toString()) > 0) {
              canCreate.value = true;
              store.setCanVote(true);
          }
      }).catch(e => {
          console.log(`overview.propsosal:getHolderBalance`)
          console.log(e)
      })

}

function truncate(str: string) {
    return str.length > 450 ? str.substring(0, 450) + "..." : str;
}
</script>
<template>
    <main class="lg:pl-72">
        <div class="px-4 pt-8 text-white">
            <div>
                <div class="flex">
                    <div class="flex-1">
<!--                        Overview Proposals-->
                    </div>
                    <div v-if="canCreate" class="flex">
                        <RouterLink :to="{name: 'dao.proposal.create'}" class="border-2 border-indigo-500 px-2 py-2 rounded-lg text-indigo-500 hover:bg-indigo-500 hover:text-gray-900">
                            Create Proposal
                        </RouterLink>
                    </div>
                </div>
            </div>
            <div class="grid grid-cols-12 gap-4 mt-8">
                <div v-if="proposals.length > 0 && !loading" class="col-span-12">
                    <div v-for="(proposal, key) in proposals" :key="key" class="bg-gray-900 px-4 mb-4 py-6 shadow sm:rounded-lg sm:p-6">
                        <RouterLink :to="{name: 'dao.proposal.detail', params: {id: proposal.id}}">
                            <div>
                                <div v-html="truncate(proposal.content)" id="html" />
                            </div>
                            <div>
                                <div class="mt-6 flex justify-between space-x-8">
                                    <div class="flex space-x-6">
                                        <span class="inline-flex items-center text-sm">
                                            <button type="button" class="inline-flex space-x-2 text-gray-400">
                                                <HandThumbUpIcon class="h-5 w-5" aria-hidden="true" />
                                                <span class="font-medium text-gray-400">{{ proposal.likes.length }}</span>
                                                <span class="sr-only">likes</span>
                                            </button>
                                        </span>
                                        <span class="inline-flex items-center text-sm">
                                            <button type="button" class="inline-flex space-x-2 text-gray-400">
                                                <HandThumbDownIcon class="h-5 w-5" aria-hidden="true" />
                                                <span class="font-medium text-gray-400">{{ proposal.dislikes.length }}</span>
                                                <span class="sr-only">replies</span>
                                            </button>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </RouterLink>
                    </div>
                </div>
                <div v-else-if="loading" class="bg-gray-900 col-span-12 px-4 py-6 text-white shadow sm:rounded-lg sm:p-6">
                    Fetching data...
                </div>
                <div v-else-if="proposals.length === 0 && !loading" class="bg-gray-900 col-span-12 px-4 py-6 text-white shadow sm:rounded-lg sm:p-6">
                    No Recent Proposals
                </div>
            </div>
        </div>
    </main>
</template>
<style>
#html h1 {
    font-size: 2em;
}

#html h2 {
    font-size: 1.5em;
}

#html h3 {
    font-size: 1.17em;
}

#html h4 {
    font-size: 1.12em;
}

#html h5 {
    font-size: .83em;
}

#html p {
    font-size: 1em;
}
</style>