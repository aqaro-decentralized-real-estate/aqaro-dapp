<script setup lang="ts">
import {onBeforeMount, ref, watch} from 'vue'
import { Dialog, DialogPanel } from '@headlessui/vue'
import { Bars3Icon, XMarkIcon } from '@heroicons/vue/24/outline'
import {connectMetaMask, formatAddress, getSigner, setChainSettings, setMetaMaskListeners} from "@/utils/helpers";
import {walletConnectionStore} from "@/stores/wallet.store";
import {useRouter} from "vue-router";
import Button from "@/components/form/button/Button.vue";
import AqaroToken from "@/chain/AqaroToken";
import {tokenStore} from "@/stores/token.store";
import {ethers} from "ethers";
import {HARDHAT, SEPOLIA} from "@/chain/config/chains";

const router = useRouter();
const store = walletConnectionStore();
const aqaroStore = tokenStore();

const mobileMenuOpen = ref(false);

let wallet = ref('');
let fullWallet = ref('');
let connected = ref(false);

const isSubmitted = ref(false);

const rightChain = ref(true);
const rightChainNr = SEPOLIA

onBeforeMount(async() => {
    let token = store.getBearerToken;

    if (!token)
        token = localStorage.getItem('aqaro.auth.token');

    if (token) {
        store.setBearerToken(token);
        const signer = await getSigner();
        const address = await signer.getAddress();
        connected.value = true;
        store.setConnected(true);
        store.setConnectedWallet(address);
        fullWallet.value = address;
        wallet.value = formatAddress(address);
        await setMetaMaskListeners();
        await setChainSettings();

        if (store.getChainId !== rightChainNr) {
            rightChain.value = false;
            return;
        }

        await getAqaroBalance();
    }
});

async function connect() {
  isSubmitted.value = true;
  await connectMetaMask();
  await setChainSettings();

    if (store.getChainId !== rightChainNr) {
        rightChain.value = false;
        return;
    }

  await initConnection();
  isSubmitted.value = false;
}

async function changeNetwork(chain: number) {
        // @ts-ignore
        await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: ethers.utils.hexValue(chain) }]
        });

        rightChain.value = true;
        await initConnection();
}

async function initConnection() {
    await setChainSettings();
    if (store.getConnectedWallet !== "") {
        const message = await store.getNonce();

        const signer = await getSigner();
        const signature = await signer.signMessage(message.data);

        fullWallet.value = store.getConnectedWallet;
        try {
            const dto = {
                address: store.getConnectedWallet,
                signature: signature
            }

            const authResult = await store.authenticate(dto);
            if (authResult.status !== 200) {
                store.disconnect();
                return;
            }
            store.setBearerToken(authResult.data.access_token);

            wallet.value = formatAddress(store.getConnectedWallet);

            if (wallet.value) {
                connected.value = true;
                store.setConnected(true);

                await getAqaroBalance();
            }
        } catch(e) {
            console.log(e);
        }
    }
}

async function getAqaroBalance() {
    const contract = new AqaroToken(store.getChainId);
    await contract.balanceOf(store.getConnectedWallet)
      .then(async res => {
          aqaroStore.setTokenBalance(res.toString());  // value in wei
      }).catch((err) => {
          console.log(err);
      });
}

async function routerTo(route: string) {
    mobileMenuOpen.value = false;
    await router.push({name: route});
}

async function walletBtnClicked() {
    if (rightChain.value) {
        await disconnect();
    } else {
        await changeNetwork(rightChainNr);
    }
}

async function disconnect() {
  await store.disconnect();
  connected.value = false;
  wallet.value = '';
}

// @ts-ignore
watch(store, async()  => {
    if (fullWallet.value !== store.getConnectedWallet) {
        await initConnection();
    }
});
</script>
<template>
    <header class="bg-gray-900">
        <nav class="mx-auto flex max-w-7xl items-center justify-between h-28 p-6 lg:px-8" aria-label="Global">
            <div class="flex items-center gap-x-12">
                <RouterLink :to="{name: 'home'}" class="-m-1.5 p-1.5">
                    <h2 class="text-2xl font-bold leading-7 text-white sm:truncate sm:text-3xl sm:tracking-tight">Aqaro</h2>
                </RouterLink>
                <div class="hidden lg:flex lg:gap-x-12">
                    <RouterLink :to="{name: 'home'}" class="text-sm font-semibold leading-6 text-white">Home</RouterLink>
                    <RouterLink :to="{name: 'about'}" class="text-sm font-semibold leading-6 text-white">About</RouterLink>

<!--                    <RouterLink :to="{name: 'early.investor'}" class="text-sm font-semibold leading-6 text-white">Invest</RouterLink>-->
                    <RouterLink v-if="Number(aqaroStore.getBalance) > 0" :to="{name: 'stake'}" class="text-sm font-semibold leading-6 text-white">Stake</RouterLink>

                    <RouterLink :to="{name: 'mortgage.liquidity.provider'}" class="text-sm font-semibold leading-6 text-white">Mortgage Provider</RouterLink>

                    <RouterLink v-if="store.isConnected" :to="{name: 'property.create'}" class="text-sm font-semibold leading-6 text-white">List Property</RouterLink>
                </div>
            </div>
            <div class="flex lg:hidden">
                <button type="button" class="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700" @click="mobileMenuOpen = true">
                    <span class="sr-only">Open main menu</span>
                    <Bars3Icon class="h-6 w-6" aria-hidden="true" />
                </button>
            </div>
            <div class="hidden lg:flex">
                <RouterLink v-if="store.isConnected" :to="{name: 'dao.dashboard'}" class="text-sm pt-2 pr-4 font-semibold leading-6 text-white">DAO <span aria-hidden="true">&rarr;</span></RouterLink>

                <Button
                  v-if="!connected"
                  :text="'connect'"
                  :spinner="'animate-spin mr-1 h-3.5 w-3.5 text-gray-900 group-hover:text-gray-800'"
                  :btnDisabled="'opacity-50 cursor-not-allowed text-sm px-4 py-1.5 bg-white rounded-2xl font-semibold hover:cursor-pointer leading-6 text-gray-900'"
                  :btnValid="'flex-none rounded-md text-sm px-4 py-1.5 bg-white rounded-2xl font-semibold hover:cursor-pointer leading-6 text-gray-900'"
                  :btnSubmitted="'relative w-full inline-flex flex-1 bg-white px-4 py-1.5 text-sm font-semibold text-gray-900 items-center justify-center rounded-md'"
                  :isSubmitted="isSubmitted"
                  :isValid="true"
                  @onClick="connect"
                />

                <button v-if="connected" v-on:click="walletBtnClicked" class="border-2 pl-4 relative border-gray-600 bg-gray-100 font-medium pb-2 pt-1 px-4 rounded-3xl">
                    <span class="inline-flex items-center gap-x-1.5 text-xs font-medium text-gray-600">
                        <svg v-if="rightChain" class="h-1.5 w-1.5 fill-green-400" viewBox="0 0 6 6" aria-hidden="true">
                          <circle cx="3" cy="3" r="3" />
                        </svg>
                        <span v-if="rightChain">{{ wallet }}</span>
                        <svg v-if="!rightChain" class="h-1.5 w-1.5 fill-red-500" viewBox="0 0 6 6" aria-hidden="true">
                          <circle cx="3" cy="3" r="3" />
                        </svg>
                        <span v-if="!rightChain">Wrong Network</span>
                      </span>
                </button>

            </div>
        </nav>
        <Dialog as="div" class="lg:hidden bg-gray-900 text-white" @close="mobileMenuOpen = false" :open="mobileMenuOpen">
            <div class="fixed inset-0 z-40" />
            <DialogPanel class="fixed inset-y-0 right-0 z-40 w-full overflow-y-auto bg-gray-900 text-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
                <div class="flex items-center justify-between">
                    <span v-on:click="routerTo('home')" class="-m-1.5 p-1.5">
                        <h2 class="text-2xl font-bold leading-7 text-white sm:truncate sm:text-3xl sm:tracking-tight">Aqaro</h2>
                    </span>
                    <button type="button" class="-m-2.5 rounded-md p-2.5 text-gray-700" @click="mobileMenuOpen = false">
                        <span class="sr-only">Close menu</span>
                        <XMarkIcon class="h-6 w-6" aria-hidden="true" />
                    </button>
                </div>
                <div class="mt-6 flow-root">
                    <div class="-my-6 divide-y divide-gray-500/10">
                        <div class="space-y-2 py-6">
                            <span v-on:click="routerTo('home')" class="-mx-3 block rounded-md text-gray-300 hover:text-indigo-500 py-2.5 px-3 text-base font-semibold leading-7">Home</span>
                            <span v-on:click="routerTo('about')" class="-mx-3 block rounded-md text-gray-300 hover:text-indigo-500 py-2.5 px-3 text-base font-semibold leading-7">About</span>

<!--                            <span v-on:click="routerTo('early.investor')" class="-mx-3 block rounded-md text-gray-300 hover:text-indigo-500 py-2.5 px-3 text-base font-semibold leading-7">Invest</span>-->
                            <span v-if="Number(aqaroStore.getBalance) > 0" v-on:click="routerTo('stake')" class="-mx-3 block rounded-md text-gray-300 hover:text-indigo-500 py-2.5 px-3 text-base font-semibold leading-7">Stake</span>

                            <span v-on:click="routerTo('mortgage.liquidity.provider')" class="-mx-3 block rounded-md text-gray-300 hover:text-indigo-500 py-2.5 px-3 text-base font-semibold leading-7">Mortgage Provider</span>

                            <span v-if="store.isConnected" v-on:click="routerTo('property.create')" class="-mx-3 block rounded-md text-gray-300 hover:text-indigo-500 py-2.5 px-3 text-base font-semibold leading-7">List Property</span>

                            <span v-if="store.isConnected" v-on:click="routerTo('dao.dashboard')" class="-mx-3 block rounded-md text-gray-300 hover:text-indigo-500 py-2.5 px-3 text-base font-semibold leading-7">DAO</span>
                        </div>
                        <div class="py-6">
                            <span v-if="!connected" v-on:click="connect" class="text-sm font-semibold hover:cursor-pointer leading-6 text-white">Connect <span aria-hidden="true">&rarr;</span></span>
                            <button v-if="connected" v-on:click="disconnect" class="border-2 border-gray-600 bg-gray-100 font-medium pb-2 pt-1 px-4 rounded-3xl">
                                <span v-if="rightChain" class="inline-flex items-center gap-x-1.5 text-xs font-medium text-gray-600">
                                    <svg class="h-1.5 w-1.5 fill-green-400" viewBox="0 0 6 6" aria-hidden="true">
                                      <circle cx="3" cy="3" r="3" />
                                    </svg>
                                    {{ wallet }}
                                </span>
                                <span v-if="!rightChain" class="inline-flex items-center gap-x-1.5 text-xs font-medium text-gray-600">
                                    <svg class="h-1.5 w-1.5 fill-red-500" viewBox="0 0 6 6" aria-hidden="true">
                                      <circle cx="3" cy="3" r="3" />
                                    </svg>
                                    Wrong Network
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </DialogPanel>
        </Dialog>
    </header>
</template>
