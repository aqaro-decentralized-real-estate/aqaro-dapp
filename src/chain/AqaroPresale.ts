import {ethers} from "ethers";
import {
    AqaroEarlyInvestAddress,
    AqaroPresaleAddress,
} from "@/chain/config/smartContracts";
// @ts-ignore
import contractAbi from "@/chain/config/abis/AqaroPresale.json";
export default class AqaroPresale {
    private provider: any;
    private signer: any;
    private contractInterface: any;
    private contractAddress: string;

    private ETHTokenPrice = 0.0003;

    constructor(chain: number) {
        // @ts-ignore
        // this.provider = new ethers.BrowserProvider(window.ethereum);
        this.provider = new ethers.providers.Web3Provider(window.ethereum);
        this.signer = this.provider.getSigner();

        if (chain === 1) {
            this.contractAddress = AqaroPresaleAddress;
        } else if (chain === 31337) {
            this.contractAddress = AqaroPresaleAddress;
        } else if (chain === 11155111) {
            this.contractAddress = AqaroPresaleAddress;
        } else {
            this.contractAddress = AqaroPresaleAddress;
        }

        this.contractInterface = new ethers.Contract(this.contractAddress, contractAbi.abi, this.signer);
    }

    async getEthBalance() {
        return await this.provider.getBalance(AqaroPresaleAddress);
    }

    async buyTokens(amount: number) {
        const ethToPay = (amount * this.ETHTokenPrice).toFixed(5);
        const amountInWei = ethers.utils.parseEther(amount.toString());
        return await this.contractInterface.buyAqaroToken(amountInWei, {value: ethers.utils.parseEther(ethToPay.toString())});
    }

    async getPresaleEndDate() {
        return await this.contractInterface.presaleEndDate();
    }
}