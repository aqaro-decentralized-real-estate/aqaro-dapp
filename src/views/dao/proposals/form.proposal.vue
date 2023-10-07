<script setup lang="ts">
import {walletConnectionStore} from "@/stores/wallet.store";
import {ref, watch} from "vue";
import {useRoute, useRouter} from "vue-router";
import Tiptap from "@/components/form/Tiptap.vue";
import TiptapContent from "@/components/form/TiptapContent.vue";
import Button from "@/components/form/button/Button.vue";
import {proposalStore} from "@/stores/proposal.store";

const router = useRouter();
const route = useRoute();
const store = walletConnectionStore();
const propStore = proposalStore();

const content = ref<string>('');

const isSubmitted = ref<boolean>(false);
const isValid = ref<boolean>(false);

async function createProposal() {
    isSubmitted.value = true;

    const formData = new FormData();
    formData.append('content', content.value);

    await propStore.listProposalService(formData)
        .then(async (response: any) => {
            if (response.status === 201) {
                isSubmitted.value = false;
                clearForm();

                await router.push({name: 'dao.proposal.overview'});
            }
        }).catch((error: any) => {
            isSubmitted.value = false;
            console.log(error);
        });
}

const updateContent = (value: string) => {
    content.value = value;
}

function clearForm() {
    content.value = '';
}

watch(content, (value) => {
    isValid.value = value.length > 0;
})
</script>
<template>
    <main class="lg:pl-72">
        <div>
            <div class="px-4 y-10 sm:px-6 lg:px-8 lg:py-6">
                <div class="mx-auto max-w-7xl">
                    <div class="space-y-12">
                        <div class="text-gray-300">
                            <h2 class="text-base font-semibold leading-7 text-white">Your Feedback Matters - Help Shape the Future of Aqaro</h2>
                            <p class="mt-1 text-sm leading-6 text-gray-400">
                                At Aqaro, we value the input and perspectives of our users. As an alpha user, you have the unique opportunity to provide feedback, share your insights, and make feature requests that will help us enhance and refine the Aqaro platform. We believe that your valuable feedback will play a vital role in shaping the future of the decentralized housing market.
                            </p>
                            <p class="mt-1 text-sm leading-6 text-gray-400">
                                We encourage you to actively participate in the development process by sharing your thoughts, suggestions, and ideas. Whether you have a brilliant feature suggestion, a user experience improvement, or general feedback, your input is invaluable to us. Our team is dedicated to listening to our users and incorporating their feedback to create an exceptional user experience.
                            </p>
                            <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                                <div class="col-span-full">
                                    <Tiptap :content="content" v-on:update:content="updateContent" />

                                    <TiptapContent class="mt-4" :content="content" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="mt-6 flex items-center justify-end gap-x-6">
                        <button v-on:click="clearForm" class="text-sm font-semibold leading-6 text-white">Cancel</button>

                        <Button
                          :text="'Create Proposal'"
                          :spinner="'animate-spin mr-1 h-3.5 w-3.5 text-white group-hover:text-gray-200'"
                          :btnDisabled="'opacity-50 cursor-not-allowed flex-none rounded-md border-2 border-indigo-500 px-3 py-2 text-sm font-semibold text-indigo-500 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white'"
                          :btnValid="'flex-none rounded-md border-2 border-indigo-500 px-3 py-2 text-sm font-semibold text-indigo-500 hover:bg-indigo-500 hover:text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white'"
                          :btnSubmitted="'relative w-full inline-flex flex-1 bg-indigo-500 px-3 py-2 text-sm font-semibold text-white items-center justify-center rounded-md'"
                          :isSubmitted="isSubmitted"
                          :isValid="isValid"
                          @onClick="createProposal"
                        />
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>
