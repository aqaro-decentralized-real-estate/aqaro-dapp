import { defineStore } from 'pinia'
import {axiosInstance} from "@/lib/http/axios.client";

type WalletAuthDto = {
    signature: string;
    address: string;
}

export const walletConnectionStore = defineStore('walletConnection', {
  state: () => ({
    connectedWallet: '',
    bearerToken: '',
    chainId: 0,
    connected: false,
    nonce: 0,
  }),
  actions: {
    setConnectedWallet(wallet: string) {
      this.connectedWallet = wallet
    },
    setChainId(chainId: number) {
      this.chainId = chainId
    },
    setConnected(connected: boolean) {
      this.connected = connected
    },
    disconnect() {
        this.connectedWallet = ''
        this.chainId = 0
        this.connected = false
    },
    setBearerToken(token: string) {
        localStorage.setItem('aqaro.auth.token', token);
        this.bearerToken = token
    },
    async getNonce() {
      return await axiosInstance.get(`/ethereum/signature/${this.connectedWallet}`);
    },
    async authenticate(dto: WalletAuthDto) {
      return await axiosInstance.post('/ethereum/authenticate', dto);
    }
  },
  getters: {
    getConnectedWallet: (state): string => state.connectedWallet,
    getChainId: (state): number => state.chainId,
    isConnected: (state): boolean => state.connected,
    getBearerToken: (state): string => state.bearerToken,
  }
});
