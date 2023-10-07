import {ethers} from "ethers";
import {
    AqaroEarlyInvestAddress,
    MortgagePoolAddress,
} from "@/chain/config/smartContracts";
// @ts-ignore
import contractAbi from "@/chain/config/abis/MortgagePool.json";
export default class MortgagePool {
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
            this.contractAddress = MortgagePoolAddress;
        } else if (chain === 31337) {
            this.contractAddress = MortgagePoolAddress;
        } else if (chain === 11155111) {
            this.contractAddress = MortgagePoolAddress;
        } else {
            this.contractAddress = MortgagePoolAddress;
        }

        this.contractInterface = new ethers.Contract(this.contractAddress, contractAbi.abi, this.signer);
    }

    async getContractBalance() {
        return await this.contractInterface.contractBalance();
    }

    async getStakedBalance(address: string) {
        return await this.contractInterface.mortgageLiquidity(address);
    }

    async provideMortgageLiquidity(amount: number) {
        return await this.contractInterface.provideMortgageLiquidity({value: ethers.utils.parseEther(amount.toString())});
    }
}