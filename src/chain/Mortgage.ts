import {ethers} from "ethers";
// @ts-ignore
import contractAbi from "@/chain/config/abis/Mortgage.json";
import {AqaroEarlyInvestAddress} from "@/chain/config/smartContracts";
export default class Mortgage {
    private provider: any;
    private signer: any;
    private contractInterface: any;
    private contractAddress: string;

    constructor(chain: number, mortgageAddress: string) {
        // @ts-ignore
        // this.provider = new ethers.BrowserProvider(window.ethereum);
        this.provider = new ethers.providers.Web3Provider(window.ethereum);
        this.signer = this.provider.getSigner();

        if (chain === 1) {
            this.contractAddress = mortgageAddress;
        } else if (chain === 31337) {
            this.contractAddress = mortgageAddress;
        } else if (chain === 11155111) {
            this.contractAddress = mortgageAddress;
        } else {
            this.contractAddress = mortgageAddress;
        }

        this.contractInterface = new ethers.Contract(this.contractAddress, contractAbi.abi, this.signer);
    }

    async getPropertyAddress() {
        return await this.contractInterface.propertyContract();
    }

    async getMortgageAmount() {
        return await this.contractInterface.mortgageAmount();
    }

    async getBuyer() {
        return await this.contractInterface.buyer();
    }


}