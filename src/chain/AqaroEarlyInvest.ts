import {ethers} from "ethers";
import {
    AqaroEarlyInvestAddress,
} from "@/chain/config/smartContracts";
// @ts-ignore
import contractAbi from "@/chain/config/abis/AqaroEarlySale.json";
export default class AqaroEarlyInvest {
    private provider: any;
    private signer: any;
    private contractInterface: any;
    private contractAddress: string;

    private ETHTokenPrice = 0.000125;

    constructor(chain: number) {
        // @ts-ignore
        // this.provider = new ethers.BrowserProvider(window.ethereum);
        this.provider = new ethers.providers.Web3Provider(window.ethereum);
        this.signer = this.provider.getSigner();

        if (chain === 1) {
            this.contractAddress = AqaroEarlyInvestAddress;
        } else if (chain === 31337) {
            this.contractAddress = AqaroEarlyInvestAddress;
        } else if (chain === 11155111) {
            this.contractAddress = AqaroEarlyInvestAddress;
        } else {
            this.contractAddress = AqaroEarlyInvestAddress;
        }

        this.contractInterface = new ethers.Contract(this.contractAddress, contractAbi.abi, this.signer);
    }

    async getEthBalance() {
        return await this.provider.getBalance(AqaroEarlyInvestAddress);
    }

    async buyTokens(amount: number) {
        const ethToPay = (amount * this.ETHTokenPrice).toFixed(5);
        const amountInWei = ethers.utils.parseEther(amount.toString());
        return await this.contractInterface.investInAqaro(amountInWei, {value: ethers.utils.parseEther(ethToPay.toString())});
    }
}