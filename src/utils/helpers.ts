import {ethers} from "ethers";

import {walletConnectionStore} from "@/stores/wallet.store";
import CoingeckoApi from "@/lib/api/coingecko.api";
import {ref} from "vue";

export async function connectMetaMask() {
    if ((window as any).ethereum) {
        const store = walletConnectionStore();

        const provider = new ethers.providers.Web3Provider((window as any).ethereum);
        await provider.send("eth_requestAccounts", []);

        // @ts-ignore
        window.ethereum.request({method: "eth_requestAccounts"})
            .then(async (accounts: string[]) => {
                store.setConnectedWallet(accounts[0]);
            })
            .catch((err: any) => console.log(err))
    }
}

export function formatAddress(address: string) {
    const first = address.substring(0, 6);
    const last = address.slice(-6);
    return `${first}...${last}`;
}

export async function setMetaMaskListeners() {
    const store = walletConnectionStore();
    // @ts-ignore
    window.ethereum.on('accountsChanged', async () => {
        (window as any).ethereum.request({method: "eth_requestAccounts"})
            .then(async (accounts: string[]) => {
                store.setConnectedWallet(accounts[0]);
            })
            .catch((err: any) => console.log(err))
    });
    // @ts-ignore
    window.ethereum.on('chainChanged', (chainId: any) => {
        console.log('chainChanged');
        console.log(chainId);
        setChainSettings();
    });
}

export async function setChainSettings() {
    const provider = new ethers.providers.Web3Provider((window as any).ethereum);
    const signer = provider.getSigner();
    const chainId = await signer.getChainId();
    const store = walletConnectionStore();
    store.setChainId(Number(chainId.toString()));
}

export async function getSigner() {
    const provider = new ethers.providers.Web3Provider((window as any).ethereum);
    return provider.getSigner();
}

export function formatDollars(value: string) {
    let formatter;
    formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2
    });
    // @ts-ignore
    return formatter.format(Number(value));
}

export async function getEthPrice() {
    // return 1900;


    const CURRENCY = 'usd';
    const api = new CoingeckoApi();

    const result = await api.getTokenPrice('ethereum', CURRENCY);
    return result.data.ethereum.usd;
}
