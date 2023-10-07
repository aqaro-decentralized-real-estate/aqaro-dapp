import {BigNumber, ethers} from "ethers";
import {
    AqaroEarlyInvestAddress,
    AqaroTokenAddress,
} from "@/chain/config/smartContracts";
// @ts-ignore
import contractAbi from "@/chain/config/abis/AqaroToken.json";
export default class AqaroToken {
    private provider: any;
    private signer: any;
    private contractInterface: any;
    private contractAddress: string;

    constructor(chain: number) {
        // @ts-ignore
        // this.provider = new ethers.BrowserProvider(window.ethereum);
        this.provider = new ethers.providers.Web3Provider(window.ethereum);
        this.signer = this.provider.getSigner();

        if (chain === 1) {
            this.contractAddress = AqaroTokenAddress;
        } else if (chain === 31337) {
            this.contractAddress = AqaroTokenAddress;
        } else if (chain === 11155111) {
            this.contractAddress = AqaroTokenAddress;
        } else {
            this.contractAddress = AqaroTokenAddress;
        }

        this.contractInterface = new ethers.Contract(this.contractAddress, contractAbi.abi, this.signer);
    }

    async balanceOf(address: string) {
        return await this.contractInterface.balanceOf(address);
    }

    async approve(address: string, amount: BigNumber) {
        return await this.contractInterface.approve(address, amount);
    }

    async allowance(owner: string, spender: string) {
        return await this.contractInterface.allowance(owner, spender);
    }
}