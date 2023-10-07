<script setup lang="ts">
import {walletConnectionStore} from "@/stores/wallet.store";
import {onBeforeMount, ref} from "vue";
import AqaroPresale from "@/chain/AqaroPresale";
import AqaroToken from "@/chain/AqaroToken";
import {AqaroPresaleAddress, StakeVaultAddress} from "@/chain/config/smartContracts";
import {ethers} from "ethers";
import Allocation from "@/components/pages/token/Allocation.vue";

const store = walletConnectionStore();

const tokenAmount = ref('');
const contractBalance = ref('');
const tokensSold = ref();

const tokenPrice = 0.0003;

const presaleContractBalance = 10_000_000;
const tokenBalance = ref();

onBeforeMount(async () => {
    await initPage();
});

async function initPage() {
    await getContractEthBalance();
    await getTokensSold();
    await getPresaleEndTime();
}

async function getContractEthBalance() {
  const contract = new AqaroPresale(store.getChainId);
  await contract.getEthBalance()
      .then(async (response: any) => {
          contractBalance.value = ethers.utils.formatEther(response.toString());
      })
      .catch((error: any) => {
          console.log(error);
      });
}

async function getTokensSold() {
    const contract = new AqaroToken(store.getChainId);
    await contract.balanceOf(AqaroPresaleAddress)
        .then(async (response: any) => {
            console.log(response.toString());

            const amountOfTokensFormatted = ethers.utils.formatEther(response.toString());
            tokensSold.value = presaleContractBalance - Number(amountOfTokensFormatted);
            tokenBalance.value = Number(amountOfTokensFormatted);
        })
        .catch((error: any) => {
            console.log(error);
        });
}

async function participateInPresale() {
    const contract = new AqaroPresale(store.getChainId);

    await contract.buyTokens(Number(tokenAmount.value))
        .then(async (response: any) => {
            const transactionReceipt = await response.wait(1);
            console.log(transactionReceipt);

            await initPage();
        })
        .catch((error: any) => {
            console.log(error);
        });
}

async function getPresaleEndTime() {
    const contract = new AqaroPresale(store.getChainId);
    await contract.getPresaleEndDate()
        .then(async (response: any) => {
            console.log(response.toString());
            console.log(new Date(response.toString() * 1000).toLocaleString());
        })
        .catch((error: any) => {
            console.log(error);
        });
}

</script>
<template>
    <div class="bg-gray-900">
        <div class="bg-gray-800">
            <div v-if="store.isConnected" class="mx-auto px-6 py-24 max-w-7xl">
                <div class="grid grid-cols-8 gap-3">
                    <div class="col-span-8 md:col-span-5 bg-gray-900 text-gray-400 shadow rounded-lg py-6 px-5">
                        <h2 class="text-xl font-semibold leading-7 text-indigo-500">
                            Aqaro Presale
                        </h2>
                        <p class="mt-6">
                            Aqaro is a decentralized housing market that is committed to creating a more transparent, accessible, and equitable way of buying, selling, and investing in real estate.
                            To achieve our mission, we are launching an initial coin offering (ICO) to raise funds for the development and growth of our platform.
                            We are selling 10 million AQR tokens at a price of $0.50 per token, with a softcap of 1000 ETH and a hardcap of 3000 ETH.
                            The proceeds from the ICO will be used to expand our team, accelerate the development of new features, and establish partnerships with key players in the real estate industry.
                        </p>
                        <p class="mt-8">
                            In the event that we do not reach our softcap, users will have the option to claim back their ETH.
                            This ensures that your investment is protected and that we only move forward with the ICO if we are able to achieve our minimum funding goal.
                            By participating in our ICO, you have the opportunity to join the Aqaro community and be a part of the future of housing.
                            With the AQR token, you can contribute to the growth and development of the platform, earn rewards for staking, and have a say in the governance of the ecosystem.
                            Our ICO is not just an investment in a token, it is an investment in a more transparent, secure, and equitable housing market.
                            Join us today and help us to create a decentralized housing market that benefits everyone.
                        </p>
                        <div class="mt-5">
                            <a :href="`https://sepolia.etherscan.io/address/${AqaroPresaleAddress}`" target="_blank" class="text-base font-semibold leading-7 text-indigo-500">
                                Show Contract On (Sepolia)Etherscan <span aria-hidden="true">&rarr;</span>
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
                            <div class="my-4">
                                ETH to pay: {{ (Number(tokenAmount) * tokenPrice).toFixed(5) }}ETH
                            </div>
                            <div>
                                <div class="bg-gray-900 text-gray-400 shadow rounded-lg">
                                    {{tokenBalance}} Tokens Left For Sale
                                </div>
                                <div class="bg-gray-900 text-gray-400 shadow rounded-lg">
                                    {{tokensSold}} Tokens Sold
                                </div>
                            </div>
                            <div class="text-center w-full mt-4">
                                <button v-if="Number(tokenAmount) && Number(tokenAmount) > 0" v-on:click="participateInPresale" class="px-2 py-2 border-2 border-indigo-500 text-indigo-500 rounded-lg hover:bg-indigo-500 hover:text-white">
                                    Participate In Presale
                                </button>
                                <button v-else class="px-2 cursor-not-allowed py-2 border-2 border-indigo-500 text-indigo-500 rounded-lg">
                                    Participate In Presale
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
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
