<script setup lang="ts">
import {walletConnectionStore} from "@/stores/wallet.store";
import {onBeforeMount, onMounted, ref, watch} from "vue";
import AqaroToken from "@/chain/AqaroToken";
import {AqaroEarlyInvestAddress, StakeVaultAddress} from "@/chain/config/smartContracts";
import {ethers} from "ethers";
import AqaroEarlyInvest from "@/chain/AqaroEarlyInvest";
import {useRoute} from "vue-router";
import Button from "@/components/form/button/Button.vue";
import {tokenStore} from "@/stores/token.store";
import {ETH, HARDHAT, SEPOLIA} from "@/chain/config/chains";
import Allocation from "@/components/pages/token/Allocation.vue";

const store = walletConnectionStore();
const aqaroStore = tokenStore();
const route = useRoute();

const tokenAmount = ref('');
const contractBalance = ref('');
const tokensSold = ref();

const isValid = ref(false);
const isSubmitted = ref(false);

const tokenPrice = 0.000125;

const presaleContractBalance = 3_000_000;
const tokenBalance = ref();

const showStakeNotification = ref(false);

const env = import.meta.env.VITE_ENV;
const rightChain = ref(true);
const rightChainNr = SEPOLIA;

onBeforeMount(async () => {
    if (env !== 'development') {
        if (store.getChainId !== rightChainNr) {
            rightChain.value = false;
            await changeNetwork(rightChainNr);
        }
    }

    if (store.isConnected && rightChain.value) {
        if (Number(aqaroStore.getBalance) > 0) {
            showStakeNotification.value = true;
        }

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
    await getContractEthBalance();
    await getTokenBalance();
    await getTokensSold();
}

async function changeNetwork(chain: number) {
    try {
        // @ts-ignore
        await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: ethers.utils.hexValue(chain) }]
        }).then(async () => {
            store.setChainId(rightChainNr);
            rightChain.value = true;
            await initPage();
        });
    } catch (err: any) {
        rightChain.value = false;
        console.log('Silent switch failed');
    }
}

async function getContractEthBalance() {
  const contract = new AqaroEarlyInvest(store.getChainId);
  await contract.getEthBalance()
      .then(async (response: any) => {
          contractBalance.value = ethers.utils.formatEther(response.toString());
      })
      .catch((error: any) => {
          console.log(error);
      });
}

async function getTokenBalance() {
    const contract = new AqaroToken(store.getChainId);
    await contract.balanceOf(store.getConnectedWallet)
        .then(async (response: any) => {
            aqaroStore.setTokenBalance(response.toString()); // amount in wei
        })
        .catch((error: any) => {
            console.log(error);
        });
}

async function getTokensSold() {
    const contract = new AqaroToken(store.getChainId);
    await contract.balanceOf(AqaroEarlyInvestAddress)
        .then(async (response: any) => {
            const amountOfTokensFormatted = ethers.utils.formatEther(response.toString());
            tokensSold.value = presaleContractBalance - Number(amountOfTokensFormatted);
            tokenBalance.value = Number(amountOfTokensFormatted);
        })
        .catch((error: any) => {
            console.log(error);
        });
}

async function participateInPresale() {
    isSubmitted.value = true;
    const contract = new AqaroEarlyInvest(store.getChainId);

    await contract.buyTokens(Number(tokenAmount.value))
        .then(async (response: any) => {
            await response.wait(1);
            isSubmitted.value = false;
            tokenAmount.value = '';
            await initPage();

            showStakeNotification.value = true;
        })
        .catch((error: any) => {
            isSubmitted.value = false;
            console.log(error);
        });
}

watch(tokenAmount, () => {
    // @ts-ignore
    isValid.value = Number(tokenAmount.value) && Number(tokenAmount.value) > 0;
});
</script>
<template>
    <div class="bg-gray-900">
        <div id="invest-top" class="bg-gray-800">
            <div v-if="store.isConnected" class="mx-auto px-6 py-24 max-w-7xl">
                <div class="grid grid-cols-8 gap-3">
                    <div class="col-span-8 md:col-span-5 bg-gray-900 text-gray-400 shadow rounded-lg py-6 px-5">
                        <h2 class="text-xl font-semibold leading-7 text-indigo-500">Aqaro Early Investment Program: Empowering Real Estate Innovation!</h2>
                        <p class="mt-6">
                            Be a pioneer in the transformation of the real estate industry with Aqaro's Early Investment Program.
                            We're revolutionizing the way properties are bought, sold, and financed by leveraging blockchain technology and a community-driven approach.
                        </p>
                        <p class="mt-8">
                            By investing in Aqaro, you become an integral part of our mission to create a decentralized housing market that breaks down barriers and fosters transparency.
                            Your support during this crucial stage will drive our progress, accelerate development, and bring us closer to launching the platform.
                        </p>
                        <p class="mt-8">
                            As an extra incentive for your investment in Aqaro tokens, we're delighted to offer you the opportunity to stake your tokens and earn an attractive extra interest yield.
                            With our commitment to your early commitment to Aqaro, we are allocating 2% of the total token supply as stake rewards,
                            which will be distributed over a period of 60 days.
                        </p>
                        <div class="mt-5">
                            <a :href="`https://etherscan.io/address/${AqaroEarlyInvestAddress}`" target="_blank" class="text-base font-semibold leading-7 text-indigo-500">
                                Show Contract On Etherscan <span aria-hidden="true">&rarr;</span>
                            </a>
                        </div>
                    </div>
                    <div class="col-span-8 md:col-span-3 text-gray-400">
                        <div class="bg-gray-900 shadow rounded-lg py-6 px-5">
                            <div class="w-full">
                                <label class="text-gray-300 w-full text-xl">Amount of Tokens to Purchase</label>
                                <input
                                        type="text"
                                        class="bg-white/5 w-full px-4 py-3 mt-2 focus:ring-indigo-600 focus:ring-offset-gray-900 rounded-lg placeholder-gray-400 text-gray-300"
                                        v-model="tokenAmount"
                                        placeholder="Enter amount of Tokens to buy">
                            </div>
                            <div class="mt-2 text-xs">
                                ETH to pay: {{ (Number(tokenAmount) * tokenPrice).toFixed(5) }}ETH
                            </div>
                            <div class="mt-4">
                                <div class="bg-gray-900 text-gray-400 shadow rounded-lg">
                                    {{tokenPrice}}ETH per Token | {{(1 / tokenPrice).toFixed(5)}} Tokens per ETH
                                </div>
                            </div>
                            <div class="text-xs mt-4">
                                <div class="bg-gray-900 text-indigo-400 shadow rounded-lg">
                                    {{tokenBalance}} Tokens Left For Sale
                                </div>
                                <div class="bg-gray-900 text-indigo-400 shadow rounded-lg">
                                    {{tokensSold}} Tokens Sold
                                </div>
                            </div>
                            <div v-if="showStakeNotification" class="mt-4">
                                <div class="bg-gray-800 text-gray-400 shadow rounded-lg">
                                    <div class="px-4 py-5 sm:p-6">
                                        <h3 class="text-base font-semibold leading-4 text-gray-400">
                                            Earn an extra 2% interest yield by staking your tokens!
                                        </h3>
                                        <div class="mt-2 max-w-xl text-sm text-gray-500">
                                            <p>
                                                Thank you for your investment in Aqaro tokens. You can now stake your tokens and earn an attractive extra interest yield.
                                            </p>
                                        </div>
                                        <div class="mt-3 text-sm leading-6">
                                            <RouterLink :to="{name: 'stake'}" class="font-semibold text-indigo-500 hover:text-indigo-600">
                                                Stake your tokens now
                                                <span aria-hidden="true"> &rarr;</span>
                                            </RouterLink>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="text-center w-full mt-4">
                                <div v-if="!rightChain" class="bg-red-100 border-2 rounded-md border-red-500 text-red-500">
                                    <div class="px-2 py-4">
                                        <h3 class="text-base font-medium leading-4 text-red-500">
                                            Connected to the wrong network!
                                        </h3>
                                        <p class="text-xs mt-2">
                                            Please connect to the Ethereum Mainnet to invest in Aqaro tokens.
                                        </p>
                                        <button class="mt-4 text-xs font-semibold text-blue-500 hover:text-blue-600" v-on:click="changeNetwork(rightChainNr)">
                                            Change Network
                                        </button>
                                    </div>
                                </div>

                                <Button
                                  v-if="rightChain"
                                  :text="'Invest'"
                                  :spinner="'animate-spin h-4 w-4 mr-2 text-white group-hover:text-gray-200'"
                                  :btnDisabled="'opacity-50 cursor-not-allowed flex-none block w-full rounded-md border-2 border-indigo-500 px-3 py-4 text-sm font-semibold text-indigo-500 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white'"
                                  :btnValid="'flex-none rounded-md border-2 border-indigo-500 block w-full px-3 py-4 text-sm font-semibold text-indigo-500 hover:bg-indigo-500 hover:text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white'"
                                  :btnSubmitted="'relative block w-full px-3 py-4 bg-indigo-500 text-sm font-semibold text-white items-center justify-center rounded-md'"
                                  :isSubmitted="isSubmitted"
                                  :isValid="isValid"
                                  @onClick="participateInPresale"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div v-else class="mx-auto px-6 text-white py-24 max-w-7xl">
                Connect Wallet to participate in seed round
            </div>
            <div class="bg-gray-900">
                <div class="text-white px-6 py-24 lg:px-8">
                    <div class="mx-auto max-w-3xl text-base leading-7 text-gray-400">
                        <p class="text-base font-semibold leading-7 text-indigo-600">Tokenomics</p>
                        <h1 class="mt-2 text-3xl font-bold tracking-tight text-gray-300 sm:text-4xl">AQR Token</h1>
                        <p class="mt-6 text-xl leading-8">
                            At Aqaro, we believe that a well-designed tokenomics plan is critical to the success of our decentralized housing market. Our token, the AQR, plays a key role in incentivizing user participation and contributing to the growth of the ecosystem.
                            With 69% of the tokens dedicated to the ecosystem, we ensure that users have a vested interest in the success of the platform.
                            The allocation of tokens to stake rewards, airdrops, legal expenses, and mortgages creates a balanced and sustainable ecosystem that benefits all stakeholders.
                            By utilizing a transparent and fair tokenomics plan, we can create a decentralized housing market that is equitable, accessible, and valuable for all participants.
                        </p>
                        <div class="mt-16 text-gray-400 max-w-2xl">
                            <h2 class="text-2xl font-bold tracking-tight text-gray-300">Governance</h2>
                            <p class="mt-6">
                                Aqaro is committed to creating a decentralized housing market that is transparent, secure, and community-driven.
                                To achieve this, we are incorporating a DAO (Decentralized Autonomous Organization) into our platform.
                                The DAO will be responsible for managing the mortgage pool, deciding on proposals and voting on changes to the platform, and ensuring that the platform operates in the best interest of its users.
                                The DAO will be powered by the Aqaro token, with users who hold AQR having the ability to propose and vote on changes within the ecosystem.
                                By utilizing a decentralized governance structure, we can create a more democratic and equitable housing market that benefits all participants.
                            </p>
                            <p class="mt-8">
                                Governance is a critical component of any decentralized platform, and Aqaro is no exception. With the ability to propose and vote on changes within the ecosystem, users have a say in how the platform is developed and operated.
                                This not only creates a more democratic and transparent ecosystem but also ensures that the platform is responsive to the needs of its users.
                                The governance structure of Aqaro will be transparent, fair, and efficient, with proposals and votes being recorded on the blockchain for all to see.
                                By utilizing a DAO and empowering users with the ability to govern the platform, we can create a truly decentralized housing market that operates in the best interest of its participants.
                            </p>
                            <p class="mt-8">
                                In addition to managing the mortgage pool and governance of the platform, the DAO will also play a critical role in handling mortgage requests.
                                Users who wish to obtain a mortgage for a property listed on the Aqaro platform will submit a request to the DAO, which will then review and decide on the request.
                                By utilizing a decentralized system for handling mortgage requests, we can eliminate the need for traditional banks and create a more accessible and transparent process for obtaining a mortgage.
                                This not only benefits buyers but also benefits investors who can earn interest by providing liquidity for the mortgage pool.
                            </p>
                        </div>
                        <Allocation/>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
