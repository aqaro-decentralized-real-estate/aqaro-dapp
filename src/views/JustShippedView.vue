<script setup lang="ts">
import { CheckCircleIcon, InformationCircleIcon } from '@heroicons/vue/20/solid'
import Roadmap from "@/components/pages/roadmap/Roadmap.vue";
</script>

<template>
    <div class="bg-gray-900 px-6 py-32 lg:px-8">
        <div class="mx-auto max-w-3xl text-base leading-7 text-gray-400">
            <p class="text-base font-semibold leading-7 text-indigo-500">v0.0.1</p>
            <h1 class="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">Experience the Alpha Version of Aqaro</h1>
            <p class="mt-6 text-xl leading-8">
                Welcome to the exciting world of Aqaro! We are thrilled to announce the launch of our alpha version on the Sepolia network.
                This release gives you a sneak peek into the future of the decentralized housing market and provides an opportunity to get a feel for the Aqaro platform before its full release.
                Although the features are built in their basic form, this alpha version showcases the core functionalities of Aqaro, including property listing, mortgage application, and DAO overview of requested mortgages.
            </p>
            <div class="mt-10 max-w-2xl">
                <p>
                    Explore the Alpha Features
                </p>
                <ul role="list" class="mt-8 max-w-xl space-y-8 text-gray-400">
                    <li class="flex gap-x-3">
                        <CheckCircleIcon class="mt-1 h-5 w-5 flex-none text-indigo-600" aria-hidden="true" />
                        <span>
                            <strong class="font-semibold text-gray-100">List Properties</strong>
                            Discover a wide range of properties available for listing on the Aqaro platform.
                            Browse through the listings to get a glimpse of the diverse real estate options that will be accessible to buyers and sellers.
                            While the features are kept basic in this alpha release, you can experience the seamless property listing process and envision the future possibilities.
                        </span>
                    </li>
                    <li class="flex gap-x-3">
                        <CheckCircleIcon class="mt-1 h-5 w-5 flex-none text-indigo-600" aria-hidden="true" />
                        <span>
                            <strong class="font-semibold text-gray-100">Apply for Mortgage</strong>
                            Experience the convenience of applying for a mortgage directly through the Aqaro platform.
                            Although the alpha version offers a simplified mortgage application process, you can still get a sense of the seamless and efficient nature of the application flow.
                            Imagine the potential of securing financing for your dream home in a decentralized and transparent manner.
                        </span>
                    </li>
                    <li class="flex gap-x-3">
                        <CheckCircleIcon class="mt-1 h-5 w-5 flex-none text-indigo-600" aria-hidden="true" />
                        <span>
                            <strong class="font-semibold text-gray-100">DAO Overview of Requested Mortgages</strong>
                            Witness the power of the Aqaro DAO as it handles and manages mortgage requests.
                            In this alpha version, you can explore an overview of requested mortgages.
<!--                            and gain insights into the underlying decentralized governance system.-->
                            Witness how the Aqaro DAO eliminates the need for traditional intermediaries and provides an inclusive environment for mortgage seekers and lenders.
                        </span>
                    </li>
                </ul>
                <h2 class="mt-16 text-2xl font-bold tracking-tight text-white">Opportunity to Invest in Aqaro</h2>
                <p class="mt-6">
                    As we embark on this exciting journey, we invite you to become a part of the Aqaro success story.
                    With the alpha version now live, this is the perfect opportunity to invest in Aqaro and join us on our mission to revolutionize the real estate industry.
<!--                    Stay tuned for the mainnet deployment, where you can actively participate in the growth of Aqaro and capitalize on its immense potential.-->
                </p>

                <h2 class="mt-16 text-2xl font-bold tracking-tight text-white">
                    Stake Tokens and Earn More AQR during Alpha Development
                </h2>
                <p class="mt-6">
                    During the alpha development phase, we are thrilled to offer you the opportunity to stake your Aqaro tokens and earn additional AQR rewards.
                    By staking your tokens, you not only contribute to the stability and liquidity of the Aqaro ecosystem
                    but also have the potential to earn more AQR tokens as a reward for your early commitment.
                    This program allows you to actively participate in the development of Aqaro while reaping the benefits of your investment.
                </p>
                <p class="mt-6">
                    Experience the future of real estate with Aqaro's alpha version on the Sepolia network.
<!--                    Explore the basic yet impactful features, and envision the immense potential that lies ahead.-->
                    Join us on this transformative journey, invest in Aqaro,
                    stake your tokens, and shape the future of the decentralized housing market.
                    Together, let's create a transparent, accessible, and equitable real estate ecosystem.
                </p>
            </div>
            <Roadmap />
        </div>
    </div>
</template>
