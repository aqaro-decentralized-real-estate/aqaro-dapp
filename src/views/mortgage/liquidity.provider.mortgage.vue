<script setup lang="ts">
import {walletConnectionStore} from "@/stores/wallet.store";
import {onBeforeMount, onMounted, ref, watch} from "vue";
import MortgagePool from "@/chain/MortgagePool";
import {ethers} from "ethers";
import {useRoute} from "vue-router";
import Button from "@/components/form/button/Button.vue";

const route = useRoute();
const store = walletConnectionStore();
const ethAmount = ref('');

const contractBalance = ref('0');
const stakedBalance = ref('0');

const isValid = ref(false);
const isSubmitted = ref(false);

onBeforeMount(async() => {
    if (store.isConnected) {
        await initPage();
        setInterval(async () => {
            await initPage();
        }, 10000);
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

async function initPage() {
    await getMortgagePoolBalance();
    await getStakedBalance();
}

async function getMortgagePoolBalance() {
    const contract = new MortgagePool(store.chainId);
    await contract.getContractBalance()
        .then((response: any) => {
            contractBalance.value = ethers.utils.formatEther(response.toString());
        })
        .catch((error: any) => {
            console.log(error);
        })
}

async function getStakedBalance() {
    const contract = new MortgagePool(store.chainId);
    await contract.getStakedBalance(store.connectedWallet)
        .then((response: any) => {
            stakedBalance.value = ethers.utils.formatEther(response.toString());
        }).catch((error: any) => {
            console.log(error);
        });
}

async function provideLiquidity() {
    isSubmitted.value = true;
    const contract = new MortgagePool(store.chainId);
    await contract.provideMortgageLiquidity(Number(ethAmount.value))
        .then(async (response: any) => {
            await response.wait(1);
            isSubmitted.value = false;
            ethAmount.value = '';
            await initPage();
        })
        .catch((error: any) => {
            isSubmitted.value = false;
            console.log(error);
        })
}

watch(ethAmount, () => {
    // @ts-ignore
    isValid.value = Number(ethAmount.value) && Number(ethAmount.value) > 0;
});
</script>
<template>
    <div id="earn-top" class="bg-gray-900">
        <div id="invest" class="bg-gray-800">
            <div v-if="store.isConnected" class="mx-auto px-6 py-24 max-w-7xl">
                <div class="grid grid-cols-8 gap-6">
                    <div class="col-span-8 md:col-span-5 bg-gray-900 text-gray-400 shadow rounded-lg py-6 px-5">
                        <h2 class="text-xl font-semibold leading-7 text-indigo-500">
                            Aqaro Mortgage System: Liquidity Providers Fuel Real Estate Financing
                        </h2>
                        <p class="mt-6">
                            Liquidity providers are at the heart of Aqaro's success, playing a pivotal role in driving the lending capabilities of our platform.
                            By providing liquidity to our mortgage pool, you become a vital contributor to the real estate financing ecosystem.
                            Join us as a liquidity provider and fuel the Aqaro mortgage system while earning a significant passive income on your ETH holdings.
                        </p>
                        <p class="mt-8">
                            At Aqaro, we leverage the ETH liquidity provided by our valued stakeholders to offer mortgages to potential buyers.
                            As borrowers repay their mortgages with interest, the returns goes directly back to our liquidity providers, ensuring a steady and lucrative passive income stream.
                            By participating as a liquidity provider, you help facilitate real estate transactions and support the growth of the Aqaro decentralized housing market.
                        </p>
                        <p class="mt-8">
                            Becoming a liquidity provider on Aqaro is a seamless and rewarding experience.
                            Simply stake your ETH in our platform, and your assets will be utilized to fund mortgages for homebuyers.
                            The more liquidity you provide, the greater your potential earnings will be.
                            We prioritize transparency and security, ensuring that your investment is protected throughout the process.
                        </p>
                        <div class="mt-5">
                            <a href="https://sepolia.etherscan.io/address/0x8938E8B37e71482A461D9E5596eA78B1B3eB197a" target="_blank" class="text-base font-semibold leading-7 text-indigo-500">
                                Show Contract On (Sepolia)Etherscan <span aria-hidden="true">&rarr;</span>
                            </a>
                        </div>
                    </div>
                    <div class="col-span-8 md:col-span-3 text-gray-400">
                        <div class="bg-gray-900 shadow rounded-lg py-6 px-5">
                            <div>
                                <h2 class="text-2xl font-bold tracking-tight text-gray-300 ">Total ETH Staked</h2>
                                <p>
                                    {{ contractBalance }} ETH
                                </p>
                            </div>
                            <div class="w-full mt-6">
                                <label class="text-gray-300 w-full text-xl">Provide ETH Liquidity</label>
                                <input
                                        type="text"
                                        class="bg-white/5 w-full px-4 py-3 mt-2 focus:ring-indigo-600 focus:ring-offset-gray-900 rounded-lg placeholder-gray-400 text-gray-300"
                                        v-model="ethAmount"
                                        placeholder="Enter amount of ETH to stake">
                            </div>
                            <div class="text-center w-full mt-4">
                                <Button
                                  :text="' Provide ETH Liquidity'"
                                  :spinner="'animate-spin h-4 w-4 mr-2 text-white group-hover:text-gray-200'"
                                  :btnDisabled="'opacity-50 cursor-not-allowed flex-none block w-full rounded-md border-2 border-indigo-500 px-3 py-4 text-sm font-semibold text-indigo-500 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white'"
                                  :btnValid="'flex-none rounded-md border-2 border-indigo-500 block w-full px-3 py-4 text-sm font-semibold text-indigo-500 hover:bg-indigo-500 hover:text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white'"
                                  :btnSubmitted="'relative block w-full px-3 py-4 bg-indigo-500 text-sm font-semibold text-white items-center justify-center rounded-md'"
                                  :isSubmitted="isSubmitted"
                                  :isValid="isValid"
                                  @onClick="provideLiquidity"
                                />
                            </div>
                        </div>
                        <div v-if="Number(contractBalance) && Number(contractBalance) > 0" class="bg-gray-900 shadow mt-6 rounded-lg py-6 px-5">
                            <div class="w-full">
                                <div class="flex">
                                    <div>
                                        <label class="text-gray-300 w-full text-xl">Provided Liquidity</label>
                                        <p class="text-gray-300 text-xl">{{ stakedBalance }} ETH</p>
                                        <div class="w-full mt-4">
<!--                                            <button v-if="Number(ethAmount) && Number(ethAmount) > 0" v-on:click="provideLiquidity" class="px-2 py-2 w-full border-2 border-indigo-500 text-indigo-500 rounded-lg hover:bg-indigo-500 hover:text-white">-->
<!--                                                Claim Rewards-->
<!--                                            </button>-->
<!--                                            <button v-else class="px-2 w-full cursor-not-allowed py-2 border-2 border-indigo-500 text-indigo-500 rounded-lg">-->
<!--                                                Claim Rewards-->
<!--                                            </button>-->

<!--                                            <Button-->
<!--                                              :text="'Claim Rewards'"-->
<!--                                              :spinner="'animate-spin mr-1 h-3.5 w-3.5 text-white group-hover:text-gray-200'"-->
<!--                                              :btnDisabled="'opacity-50 cursor-not-allowed flex-none rounded-md border-2 border-indigo-500 px-3 py-2 text-sm font-semibold text-indigo-500 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white'"-->
<!--                                              :btnValid="'flex-none rounded-md border-2 border-indigo-500 px-3 py-2 text-sm font-semibold text-indigo-500 hover:bg-indigo-500 hover:text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white'"-->
<!--                                              :btnSubmitted="'relative w-full inline-flex flex-1 bg-indigo-500 px-3 py-2 text-sm font-semibold text-white items-center justify-center rounded-md'"-->
<!--                                              :isSubmitted="isSubmitted"-->
<!--                                              :isValid="isValid"-->
<!--                                              @onClick="provideLiquidity"-->
<!--                                            />-->
                                        </div>
                                    </div>
                                    <div class="pl-6">
                                        <label class="text-gray-300 w-full text-xl">Earned</label>
                                        <p class="text-gray-300 text-xl">-- ETH</p>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
            <div v-else class="mx-auto px-6 text-white py-24 max-w-7xl">
                Connect Wallet to become a Mortgage Provider
            </div>
            <div id="mortgage-liquidity" class="bg-gray-900">
                <div class="text-white px-6 py-24 lg:px-8">
                    <div class="mx-auto max-w-3xl text-base leading-7 text-gray-400">
                        <p class="text-base font-semibold leading-7 text-indigo-600">Mortgage Liquidity</p>
                        <h1 class="mt-2 text-3xl font-bold tracking-tight text-gray-300 sm:text-4xl">How Mortgages Work</h1>
                        <p class="mt-6 text-xl leading-8">
                            Aqaro is a decentralized housing market that leverages blockchain technology and decentralized finance (DeFi) to create a more transparent and accessible way of buying and selling real estate.
                            By removing intermediaries and utilizing a decentralized autonomous organization (DAO) to handle mortgage requests, Aqaro is able to offer a more secure and equitable platform for users.
                        </p>
                        <p class="mt-6">
                            One of the unique features of Aqaro is its DeFi model, which relies on the pooling of liquidity from multiple investors to provide mortgages for potential buyers.
                            Users who provide Ether liquidity for the mortgage pool can earn a generous return on their investment, with a competitive 10% APY.
                            As the mortgages are paid off with interest, the returns go directly back to the liquidity providers, allowing you to earn a significant return on your investment without lifting a finger.
                        </p>
                        <p class="mt-6">
                            To list their properties on Aqaro, users simply need to create a smart contract that includes all relevant details such as the property's location, price, and documentation.
                            Potential buyers can then browse the listings and make offers directly to the seller. Aqaro offers users the option to apply for mortgages, which are handled by the Aqaro DAO.
                            The DAO assesses the borrower's creditworthiness and offers them a mortgage, which is also recorded on the blockchain.
                        </p>
                        <p class="mt-6">
                            The Aqaro DAO plays a crucial role in the platform's operation, acting as a decentralized lender that assesses mortgage requests and provides loans without the need for traditional banks.
                            The DAO operates using a set of rules and guidelines that are coded into the blockchain, ensuring that all transactions are transparent and equitable.
                            This model not only allows for greater accessibility to mortgages but also benefits investors by providing higher returns on their investments.
                        </p>
                        <p class="mt-6">
                            At Aqaro, we are committed to creating a more secure and efficient decentralized housing market that benefits all stakeholders.
                            By leveraging innovative technology and risk management solutions, we are able to create a platform that provides greater access to mortgages and offers a lucrative investment opportunity for liquidity providers.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
