import {BigNumber, ethers} from "ethers";
import {
    StakeVaultAddress,
} from "@/chain/config/smartContracts";
// @ts-ignore
import contractAbi from "@/chain/config/abis/StakeVault.json";
export default class StakeVault {
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
            this.contractAddress = StakeVaultAddress;
        } else if (chain === 31337) {
            this.contractAddress = StakeVaultAddress;
        } else if (chain === 11155111) {
            this.contractAddress = StakeVaultAddress;
        } else {
            this.contractAddress = StakeVaultAddress;
        }

        this.contractInterface = new ethers.Contract(this.contractAddress, contractAbi.abi, this.signer);
    }

    async stake(amount: BigNumber) {
        return await this.contractInterface.stake(amount);
    }

    async balanceOf(address: string) {
        return await this.contractInterface.balanceOf(address);
    }
}