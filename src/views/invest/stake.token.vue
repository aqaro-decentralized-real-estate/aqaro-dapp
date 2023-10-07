<script setup lang="ts">
import {walletConnectionStore} from "@/stores/wallet.store";
import {onBeforeMount, onMounted, ref, watch} from "vue";
import AqaroPresale from "@/chain/AqaroPresale";
import AqaroToken from "@/chain/AqaroToken";
import {AqaroPresaleAddress, StakeVaultAddress} from "@/chain/config/smartContracts";
import {ethers} from "ethers";
import Button from "@/components/form/button/Button.vue";
import {tokenStore} from "@/stores/token.store";
import StakeVault from "@/chain/StakeVault";
import {ETH, HARDHAT, SEPOLIA} from "@/chain/config/chains";
import Allocation from "@/components/pages/token/Allocation.vue";
import {useRoute} from "vue-router";

const route = useRoute();
const store = walletConnectionStore();
const aqaroStore = tokenStore();

const tokenAmount = ref('');

enum StakeState {
    APPROVE,
    APPROVED,
    STAKE,
    STAKED
}

const stakeState = ref(StakeState.APPROVE);
const approvedAmount = ref('0');

const isSubmitted = ref(false);
const isValid = ref(false);

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
        await initPage();
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

async function initPage() {
    tokenAmount.value = '';
    await getTokenBalance();
    await getAllowance();
    await getStakedBalance();
}

async function getTokenBalance() {
    const contract = new AqaroToken(store.getChainId);
    await contract.balanceOf(store.getConnectedWallet)
        .then(async (response: any) => {
            aqaroStore.setTokenBalance(response.toString()); // value in wei
        })
        .catch((error: any) => {
            console.log(error);
        });
}

async function getAllowance() {
    const contract = new AqaroToken(store.getChainId);
    await contract.allowance(store.getConnectedWallet, StakeVaultAddress)
        .then(async (response: any) => {
            if (ethers.utils.formatUnits(response.toString(), 18) === "0" || ethers.utils.formatUnits(response.toString(), 18) === "0.0") {
                stakeState.value = StakeState.APPROVE;
            } else if (ethers.utils.formatUnits(response.toString(), 18) === ethers.utils.formatUnits(aqaroStore.stakedBalance, 18)) {
                stakeState.value = StakeState.APPROVE;
                approvedAmount.value = "0";
            } else {
                stakeState.value = StakeState.APPROVED;
                approvedAmount.value = ethers.utils.formatUnits(response.toString(), 18);
            }
        })
        .catch((error: any) => {
            console.log(error);
            isSubmitted.value = false;
        });
}

async function getStakedBalance() {
    const contract = new StakeVault(store.getChainId);
    await contract.balanceOf(store.getConnectedWallet)
        .then(async (response: any) => {
            aqaroStore.setStakedBalance(response.toString());  // value in wei
        })
        .catch((error: any) => {
            console.log(error);
        });
}

async function approve() {
    isSubmitted.value = true;
    const contract = new AqaroToken(store.getChainId);
    await contract.approve(StakeVaultAddress, ethers.utils.parseUnits(tokenAmount.value, 18))
        .then(async (response: any) => {
            await response.wait(1);
            await getAllowance();
            isSubmitted.value = false;
        })
        .catch((error: any) => {
            isSubmitted.value = false;
            console.log(error);
        });
}

async function stake() {
    isSubmitted.value = true;
    const contract = new StakeVault(store.getChainId);
    await contract.stake(ethers.utils.parseUnits(tokenAmount.value, 18))
        .then(async (response: any) => {
            await response.wait(1);
            await initPage();
            isSubmitted.value = false;
        })
        .catch((error: any) => {
            isSubmitted.value = false;
            console.log(error);
        });
}

watch(tokenAmount, async (value) => {
    if (value === '' && parseFloat(value) <= 0) {
        isValid.value = false;
        return;
    }

    if (parseFloat(value) > parseFloat(ethers.utils.formatUnits(aqaroStore.getBalance, 18))) {
        isValid.value = false;
        return;
    }

    isValid.value = true;
})
</script>
<template>
    <div id="stake-top" class="bg-gray-900">
        <div class="bg-gray-800">
            <div v-if="store.isConnected" class="mx-auto px-6 py-24 max-w-7xl">
                <div class="grid grid-cols-8 gap-3">
                    <div class="col-span-8 md:col-span-5 bg-gray-900 text-gray-400 shadow rounded-lg py-6 px-5">
                        <h2 class="text-xl font-semibold leading-7 text-indigo-500">
                            Aqaro Staking
                        </h2>
                        <p class="mt-8">
                            Your decision to stake the tokens demonstrates your trust in us, and we deeply appreciate it.
                            It fuels our determination to continue building and refining the Aqaro platform in the coming months.
                            Together, we will revolutionize the real estate industry and create a future where buying, selling, and financing properties are seamless and empowering.
                        </p>
                        <div class="mt-5">
                            <a :href="`https://etherscan.io/address/${StakeVaultAddress}`" target="_blank" class="text-base font-semibold leading-7 text-indigo-500">
                                Show Contract On Etherscan <span aria-hidden="true">&rarr;</span>
                            </a>
                        </div>
                    </div>
                    <div class="col-span-8 md:col-span-3 text-gray-400">
                        <div class="bg-gray-900 shadow rounded-lg py-6 px-5">
                            <div class="w-full">
                                <label class="text-gray-300 w-full text-xl">Amount of Tokens to Stake</label>
                                <div class="relative mt-2 flex items-center">
                                    <input type="text" v-model="tokenAmount" placeholder="0" class="bg-white/5 w-full text-lg focus:ring-indigo-600 focus:ring-offset-gray-900 rounded-lg placeholder-gray-400 text-gray-300 py-6 pr-14 pl-3" />
                                    <div class="absolute inset-y-0 right-0 flex py-1.5 pr-4">
                                        <div class="block pt-1.5">
                                            <div class="block w-full">
                                                <kbd class="bg-gray-900 text-xs float-right rounded-xl px-5 py-1">AQR</kbd>
                                            </div>
                                            <div class="block float-right">
                                                <span class="text-xs">
                                                    Balance: {{ethers.utils.formatUnits(aqaroStore.getBalance, 18)}}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div v-if="stakeState === StakeState.APPROVED" class="mt-4">
                                <div class="bg-gray-900 text-gray-400 shadow rounded-lg">
                                    Approved: {{ approvedAmount }} AQR
                                </div>
                            </div>
                            <div v-if="ethers.utils.formatUnits(aqaroStore.getStakedBalance, 18) > 0" class="mt-4">
                                <div class="bg-gray-900 text-gray-400 shadow rounded-lg">
                                    Staked Amount: {{ ethers.utils.formatUnits(aqaroStore.getStakedBalance, 18) }} AQR
                                </div>
                            </div>
                            <div class="text-center w-full mt-4">
                                <Button
                                  v-if="stakeState === StakeState.APPROVE"
                                  :text="'Approve'"
                                  :spinner="'animate-spin h-4 w-4 mr-2 text-white group-hover:text-gray-200'"
                                  :btnDisabled="'opacity-50 cursor-not-allowed flex-none block w-full rounded-md border-2 border-indigo-500 px-3 py-4 text-sm font-semibold text-indigo-500 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white'"
                                  :btnValid="'flex-none rounded-md border-2 border-indigo-500 block w-full px-3 py-4 text-sm font-semibold text-indigo-500 hover:bg-indigo-500 hover:text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white'"
                                  :btnSubmitted="'relative block w-full px-3 py-4 bg-indigo-500 text-sm font-semibold text-white items-center justify-center rounded-md'"
                                  :isSubmitted="isSubmitted"
                                  :isValid="isValid"
                                  @onClick="approve"
                                />
                                <Button
                                  v-if="stakeState === StakeState.APPROVED"
                                  :text="'Stake'"
                                  :spinner="'animate-spin h-4 w-4 mr-2 text-white group-hover:text-gray-200'"
                                  :btnDisabled="'opacity-50 cursor-not-allowed flex-none block w-full rounded-md border-2 border-indigo-500 px-3 py-4 text-sm font-semibold text-indigo-500 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white'"
                                  :btnValid="'flex-none rounded-md border-2 border-indigo-500 block w-full px-3 py-4 text-sm font-semibold text-indigo-500 hover:bg-indigo-500 hover:text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white'"
                                  :btnSubmitted="'relative block w-full px-3 py-4 bg-indigo-500 text-sm font-semibold text-white items-center justify-center rounded-md'"
                                  :isSubmitted="isSubmitted"
                                  :isValid="isValid"
                                  @onClick="stake"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="bg-gray-900">
                <div class="text-white px-6 py-24 lg:px-8">
                    <div class="mx-auto max-w-3xl text-base leading-7 text-gray-400">
                        <p class="text-base font-semibold leading-7 text-indigo-600">Staking</p>
                        <h1 class="mt-2 text-3xl font-bold tracking-tight text-gray-300 sm:text-4xl">Earn rewards by staking your Aqaro tokens</h1>
                        <p class="mt-6 text-xl leading-8">
                            In the world of blockchain investments, the ability to earn passive income has become a sought-after feature.
                            At Aqaro, we understand the importance of rewarding our early investors. That's why we're excited to introduce our token staking program, where you can earn attractive rewards by staking your Aqaro tokens.
                            In this blog post, we'll explore how our commitment to your early investment is reflected in the allocation of 2% of the total token supply as stake rewards, distributed over a period of 60 days.
                        </p>
                        <div class="mt-16 text-gray-400 max-w-2xl">
                            <h2 class="text-2xl font-bold tracking-tight text-gray-300">Stake and Earn</h2>
                            <p class="mt-6">
                                By staking your Aqaro tokens, you unlock the potential to earn an extra interest yield on top of your initial investment.
                                We're thrilled to offer this unique opportunity to our valued investors,
                                as it aligns with our dedication to providing additional benefits to those who show trust and commitment in our project.
                            </p>
                            <p class="mt-8">
                                To demonstrate our appreciation for your early commitment to Aqaro, we have set aside 2% of the total token supply specifically for stake rewards.
                                These rewards will be distributed over a 60-day period, allowing you to enjoy the benefits of staking for an extended period.
                                It's a win-win situation where your investment works for you while contributing to the overall stability and growth of the Aqaro ecosystem.
                            </p>
                        </div>
<!--                        <Allocation/>-->
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
