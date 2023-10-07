<script setup lang="ts">
import {onBeforeMount, ref} from "vue";
import {useRoute} from "vue-router";
import {proposalStore} from "@/stores/proposal.store";
import {HandThumbDownIcon, HandThumbUpIcon} from "@heroicons/vue/20/solid";
import {tokenStore} from "@/stores/token.store";
import {walletConnectionStore} from "@/stores/wallet.store";

const route = useRoute();
const store = proposalStore();
const connectionStore = walletConnectionStore();
const aqaroStore = tokenStore();

const proposal = ref<any>({});

const likes = ref<any[]>([]);
const dislikes = ref<any[]>([]);

const loaded = ref<boolean>(false);
onBeforeMount(async () => {
    if (route.params.id) {
        await fetchProposal();
    }

    loaded.value = true;
});

async function fetchProposal() {
    await store.getById(`${route.params.id}`)
      .then((response: any) => {
          if (response.status === 200) {
              proposal.value = response.data.proposal;
              likes.value = response.data.proposal.likes;
              dislikes.value = response.data.proposal.dislikes;
          }
      }).catch((error: any) => {
          console.log(error);
      });
}

async function clickLike() {
    await store.likeProposal(`${route.params.id}`)
        .then(async (response: any) => {
            if (response.status === 200) {
                // likes.value.push(response.data.like);

                await fetchProposal();
            }
        }).catch((error: any) => {
            console.log(error);
        });
}

async function clickDislike() {
    await store.dislikeProposal(`${route.params.id}`)
        .then(async (response: any) => {
            if (response.status === 200) {
                // dislikes.value.push(response.data.dislike);

                await fetchProposal();
            }
        }).catch((error: any) => {
            console.log(error);
        });
}
</script>
<template>
    <main class="lg:pl-72">
        <div v-if="loaded" class="px-4 pt-8 text-white">
            <div class="block">
                <div v-html="proposal.content" />
            </div>
            <div class="block mt-4">
                <div v-if="store.getCanVote"  class="flex space-x-6">
                    <span class="inline-flex items-center text-sm">
                        <button v-on:click="clickLike" type="button" class="inline-flex space-x-2 text-gray-400 hover:text-gray-500">
                            <HandThumbUpIcon class="h-5 w-5" aria-hidden="true" />
                            <span class="font-medium text-gray-400">{{ likes.length }}</span>
                            <span class="sr-only">likes</span>
                        </button>
                    </span>
                    <span class="inline-flex items-center text-sm">
                        <button v-on:click="clickDislike" type="button" class="inline-flex space-x-2 text-gray-400 hover:text-gray-500">
                            <HandThumbDownIcon class="h-5 w-5" aria-hidden="true" />
                            <span class="font-medium text-gray-400">{{ dislikes.length }}</span>
                            <span class="sr-only">replies</span>
                        </button>
                    </span>
                </div>
                <div v-else class="block mt-12">
                    <div class="flex space-x-6">
                        <span class="inline-flex items-center text-sm">
                            <button type="button" class="inline-flex space-x-2 text-gray-400 hover:text-gray-500">
                                <HandThumbUpIcon class="h-5 w-5" aria-hidden="true" />
                                <span class="font-medium text-gray-400">{{ likes.length }}</span>
                                <span class="sr-only">likes</span>
                            </button>
                        </span>
                            <span class="inline-flex items-center text-sm">
                            <button type="button" class="inline-flex space-x-2 text-gray-400 hover:text-gray-500">
                                <HandThumbDownIcon class="h-5 w-5" aria-hidden="true" />
                                <span class="font-medium text-gray-400">{{ dislikes.length }}</span>
                                <span class="sr-only">replies</span>
                            </button>
                        </span>
                    </div>
                    <p class="text-white text-xs">
                        Only with AQR tokens you can vote on this proposal.
                    </p>
                    <RouterLink :to="{name: 'early.investor'}" class="text-green-500">
                        Invest now...
                    </RouterLink>
                </div>
            </div>
        </div>
    </main>
</template>
<style>
h1 {
    font-size: 2.5rem;
    line-height: 2.5rem;
    font-weight: 700;
    letter-spacing: -0.025em;
}
h2 {
    font-size: 2rem;
    line-height: 2rem;
    font-weight: 700;
    letter-spacing: -0.025em;
}
h3 {
    font-size: 1.75rem;
    line-height: 2rem;
    font-weight: 700;
    letter-spacing: -0.025em;
}
h4 {
    font-size: 1.5rem;
    line-height: 2rem;
    font-weight: 700;
    letter-spacing: -0.025em;
}
h5 {
    font-size: 1.25rem;
    line-height: 1.75rem;
    font-weight: 700;
    letter-spacing: -0.025em;
}

</style>