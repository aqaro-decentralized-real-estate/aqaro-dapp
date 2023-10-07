<script setup lang="ts">
import {walletConnectionStore} from "@/stores/wallet.store";
import {onBeforeMount, ref} from "vue";
import {useRoute} from "vue-router";
import Feed from "@/components/pages/dao/dashboard/Feed.vue";

const route = useRoute();
const store = walletConnectionStore();
</script>
<template>
    <main class="lg:pl-72">
        <div class="xl:pr-96">
            <div class="px-4 text-white py-10 sm:px-6 lg:px-8 lg:py-6">
                Overview Mortgages
            </div>
        </div>
    </main>

<!--    <aside class="fixed inset-y-0 top-11 right-0 hidden w-96 overflow-y-auto border-l border-gray-200 px-4 py-6 sm:px-6 lg:px-8 xl:block">-->
<!--        <Feed />-->
<!--    </aside>-->
</template>