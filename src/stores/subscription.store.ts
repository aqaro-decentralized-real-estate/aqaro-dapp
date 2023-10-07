import { defineStore } from 'pinia';
import {axiosInstance} from '@/lib/http/axios.client';

enum subscribeType {
  Launch = 'Launch',
  Newsletter = 'Newsletter'
}

type SubscriptionDto = {
    email: string;
    type: subscribeType;
}

export const useSubscriptionStore = defineStore('subscription', {
  state: () => ({
    subscribed: false,
    error: null,
  }),
  actions: {
    async subscribe(dto: SubscriptionDto) {
        return await axiosInstance.post('/subscribe' , dto);
    },
  },
});
