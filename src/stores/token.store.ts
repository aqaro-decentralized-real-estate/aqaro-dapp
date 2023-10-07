import { defineStore } from 'pinia'
import {axiosInstance} from "@/lib/http/axios.client";

type WalletAuthDto = {
    signature: string;
    address: string;
}

export const tokenStore = defineStore('aqaroToken', {
  state: () => ({
    balance: '',
    stakedBalance: '',
  }),
  actions: {
    setTokenBalance(balance: string) {
      this.balance = balance
    },
    setStakedBalance(balance: string) {
      this.stakedBalance = balance
    }
  },
  getters: {
    getBalance: (state): string => state.balance,
    getStakedBalance: (state): string => state.stakedBalance,
  }
});
