<script setup lang="ts">
import {RouterLink, RouterView, useRouter} from 'vue-router'
import Header from './components/layout/Header.vue'
import Footer from "@/components/layout/Footer.vue";
import Banner from "@/components/layout/Banner.vue";
import {onBeforeMount} from "vue";
import UrlChecker from "@/components/layout/UrlChecker.vue";

const router = useRouter();

onBeforeMount(() => {
  console.log(router);
});
</script>

<template>
  <div class="wrapper min-h-screen bg-gray-800">
    <UrlChecker />

    <Banner />
    <Header
            v-if="
            router.currentRoute.value.name === 'home' ||
            router.currentRoute.value.name === 'about' ||
            router.currentRoute.value.name === 'just.shipped' ||
            router.currentRoute.value.name === 'early.investor' ||
            router.currentRoute.value.name === 'property.create' ||
            router.currentRoute.value.name === 'property.overview' ||
            router.currentRoute.value.name === 'property.detail' ||
            router.currentRoute.value.name === 'stake' ||
            router.currentRoute.value.name === 'mortgage.liquidity.provider' ||
            router.currentRoute.value.name === 'mortgage.property.request'"
    />
    <RouterView />
    <Footer
            v-if="
            router.currentRoute.value.name === 'home' ||
            router.currentRoute.value.name === 'about' ||
            router.currentRoute.value.name === 'just.shipped' ||
            router.currentRoute.value.name === 'early.investor' ||
            router.currentRoute.value.name === 'property.create' ||
            router.currentRoute.value.name === 'property.overview' ||
            router.currentRoute.value.name === 'property.detail' ||
            router.currentRoute.value.name === 'stake' ||
            router.currentRoute.value.name === 'mortgage.liquidity.provider' ||
            router.currentRoute.value.name === 'mortgage.property.request'"
    />
  </div>
</template>

