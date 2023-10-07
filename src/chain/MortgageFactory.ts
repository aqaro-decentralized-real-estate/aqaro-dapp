import {ethers} from "ethers";
import {
    AqaroEarlyInvestAddress,
    MortgageFactoryAddress,
} from "@/chain/config/smartContracts";
// @ts-ignore
import contractAbi from "@/chain/config/abis/MortgageFactory.json";

export default class MortgageFactory {
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
            this.contractAddress = MortgageFactoryAddress;
        } else if (chain === 31337) {
            this.contractAddress = MortgageFactoryAddress;
        } else if (chain === 11155111) {
            this.contractAddress = MortgageFactoryAddress;
        } else {
            this.contractAddress = MortgageFactoryAddress;
        }

        this.contractInterface = new ethers.Contract(this.contractAddress, contractAbi.abi, this.signer);
    }

    async getContract() {
        return this.contractInterface;
    }

    public async requestMortgage(propContract: string, sender: any, mortgagePayment: any): Promise<any> {
        return await this.contractInterface.requestMortgage(propContract, sender, mortgagePayment);
    }

    public async getMortgageContracts(): Promise<any> {
        return await this.contractInterface.getMortgageContracts();
    }
}