<script setup lang="ts">
import { HomeModernIcon, GlobeEuropeAfricaIcon, ShieldCheckIcon, BanknotesIcon, UsersIcon } from '@heroicons/vue/20/solid'
import {onBeforeMount, onMounted} from "vue";
import {useRoute} from "vue-router";

const route = useRoute();

onMounted(async () => {
    const anchor = route.query.link;
    if (anchor) {
        const element = document.getElementById(`${anchor}`);
        if (element) {
            element.scrollIntoView();
        }
    }
});
</script>

<template>
    <div id="about-top" class="relative isolate bg-gray-900 overflow-hidden py-24 sm:py-32">
        <div class="absolute -top-80 left-[max(6rem,33%)] -z-10 transform-gpu blur-3xl sm:left-1/2 md:top-20 lg:ml-20 xl:top-3 xl:ml-56" aria-hidden="true">
            <div class="aspect-[801/1036] w-[50.0625rem] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30" style="clip-path: polygon(63.1% 29.6%, 100% 17.2%, 76.7% 3.1%, 48.4% 0.1%, 44.6% 4.8%, 54.5% 25.4%, 59.8% 49.1%, 55.3% 57.9%, 44.5% 57.3%, 27.8% 48%, 35.1% 81.6%, 0% 97.8%, 39.3% 100%, 35.3% 81.5%, 97.2% 52.8%, 63.1% 29.6%)" />
        </div>
        <div class="mx-auto max-w-7xl px-6 lg:px-8">
            <div class="mx-auto max-w-2xl lg:mx-0">
                <h1 class="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">Explore the Aqaro Features</h1>
                <p class="mt-6 text-xl leading-8 text-gray-300">
                    Welcome to Aqaro, where we're transforming the real estate industry with innovative technology and a decentralized approach. Say goodbye to cumbersome processes and hello to a streamlined experience that empowers you to buy, sell, and finance properties with ease.
                </p>
            </div>
            <div class="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:mx-0 lg:mt-10 lg:max-w-none lg:grid-cols-12">
                <div class="relative lg:order-last lg:col-span-5">
                    <svg class="absolute -top-[40rem] left-1 -z-10 h-[64rem] w-[175.5rem] -translate-x-1/2 stroke-gray-900/10 [mask-image:radial-gradient(64rem_64rem_at_111.5rem_0%,white,transparent)]" aria-hidden="true">
                        <defs>
                            <pattern id="e87443c8-56e4-4c20-9111-55b82fa704e3" width="200" height="200" patternUnits="userSpaceOnUse">
                                <path d="M0.5 0V200M200 0.5L0 0.499983" />
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" stroke-width="0" fill="url(#e87443c8-56e4-4c20-9111-55b82fa704e3)" />
                    </svg>
                    <figure class="border-l border-indigo-600 pl-8">
                        <blockquote class="text-xl font-semibold leading-8 tracking-tight text-white">
                            <p>“Aqaro is not just a solution; it is the ultimate answer to all the challenges faced in the housing market. From listing properties effortlessly to providing secure financing options, Aqaro covers every aspect of the industry. Our platform will truly transform the way individuals navigate the real estate world.”</p>
                        </blockquote>
                        <figcaption class="mt-8 flex gap-x-4">
                            <img src="@/assets/jdk_italy.png" alt="Jordy de Koning" class="mt-1 h-10 w-10 flex-none rounded-full bg-gray-50" />
                            <div class="text-sm leading-6">
                                <div class="font-semibold text-white">Jordy de Koning, CTO</div>
                                <a href="https://twitter.com/developerjordy" target="_blank" class="text-gray-600 hover:text-indigo-600">@developerjordy</a>
                            </div>
                        </figcaption>
                    </figure>
                </div>
                <div class="max-w-xl text-base leading-7 text-gray-300 lg:col-span-7">
                    <p>
                        With Aqaro, our unique selling proposition lies in our decentralized housing market.
                        Experience a transparent marketplace where you have control and peace of mind.
                    </p>
                    <ul role="list" class="mt-8 max-w-xl space-y-8 text-gray-300">
                        <li class="flex gap-x-3">
                            <HomeModernIcon class="mt-1 h-5 w-5 flex-none text-indigo-500" aria-hidden="true" />
                            <span><strong class="font-semibold text-indigo-500">Decentralized Housing Market</strong>
                                Aqaro operates on a decentralized model, leveraging blockchain technology to eliminate intermediaries and create a transparent, secure, and efficient housing market.
                                This unique approach removes barriers and empowers individuals to participate in property transactions directly.
                            </span>
                        </li>
                        <li class="flex gap-x-3">
                            <UsersIcon class="mt-1 h-5 w-5 flex-none text-indigo-500" aria-hidden="true" />
                            <span><strong class="font-semibold text-indigo-500">Community-Driven Decision-Making</strong>
                                Aqaro incorporates a decentralized autonomous organization (DAO), enabling active community participation in shaping the future of the platform.
                                Users have a voice in governance, feature enhancements, and ecosystem development, creating a truly inclusive and collaborative environment.
                            </span>
                        </li>
                        <li class="flex gap-x-3">
                            <BanknotesIcon class="mt-1 h-5 w-5 flex-none text-indigo-500" aria-hidden="true" />
                            <span><strong class="font-semibold text-indigo-500">Innovative Mortgage System</strong>
                                Aqaro revolutionizes property financing through its decentralized finance (DeFi) model.
                                Borrowers can access mortgages directly from the community, enjoying customized terms, competitive interest rates, and flexible repayment options.
                                By leveraging a decentralized liquidity pool, Aqaro expands access to financing and creates new opportunities for property buyers.
                            </span>
                        </li>
                        <li class="flex gap-x-3">
                            <ShieldCheckIcon class="mt-1 h-5 w-5 flex-none text-indigo-500" aria-hidden="true" />
                            <span><strong class="font-semibold text-indigo-500">Enhanced Security and Trust</strong>
                                Aqaro prioritizes the security and privacy of user data through blockchain technology. Transactions recorded on the blockchain are immutable, transparent, and resistant to fraud.
                                Advanced security measures, such as encryption and smart contracts, safeguard user funds and ensure trust within the ecosystem.
                            </span>
                        </li>
                        <li class="flex gap-x-3">
                            <GlobeEuropeAfricaIcon class="mt-1 h-5 w-5 flex-none text-indigo-500" aria-hidden="true" />
                            <span><strong class="font-semibold text-indigo-500">Global Reach and Expansion</strong>
                            Aqaro has a roadmap for global expansion, aiming to penetrate new markets and establish partnerships worldwide. This commitment to growth ensures that Aqaro can cater to a diverse range of properties and participants, fostering a vibrant and inclusive global ecosystem.
                            </span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>
