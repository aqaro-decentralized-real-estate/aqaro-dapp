import axios from "axios";

export default class CoingeckoApi {
    public axiosInstance = axios.create({
        baseURL: import.meta.env.VITE_COINGECKO_API_URL,
        headers: {
            'Content-Type': 'application/json',
        },
    });

    async getCoins(id: string) {
        return await this.axiosInstance.get(`/coins/${id}`);
    }

    async getTokenPrice(id: string, currency: string) {
        return await this.axiosInstance.get(`/simple/price?ids=${id}&vs_currencies=${currency}`);
    }
}