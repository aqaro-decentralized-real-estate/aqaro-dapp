<script setup lang="ts">
import {walletConnectionStore} from "@/stores/wallet.store";
import {onBeforeMount, onMounted, ref, watch} from "vue";
import {useRoute, useRouter} from "vue-router";
import Property from "@/chain/Property";
import MortgageFactory from "@/chain/MortgageFactory";
import {ethers} from "ethers";
import PropertyFactory from "@/chain/PropertyFactory";
import {formatDollars, getEthPrice} from "../../utils/helpers";
import Button from "@/components/form/button/Button.vue";
import {Property as PropertyType} from "@/types/Property";

const store = walletConnectionStore();
const router = useRouter();
const route = useRoute();

type Property = {
    addr: Address,
    askingPrice: string,
    id: string,
    seller: string,
    created: string
}
type Address = {
    street: string;
    city: string;
    state: string;
    country: string;
    zip: string;
}

const loaded = ref(false);

const isValid = ref(false);
const isSubmitted = ref(false);

const ETH_PRICE = ref(0);

const property = ref<PropertyType>({} as PropertyType);
const bidOpen = ref(false);
const contractOpenDate = ref(new Date());
const propertyContractAddress = ref('');

const mortgageEndDate = ref(new Date());
const totalMonthlyPayments = ref(0);

const mortgageRequest = ref({
    name: '',
    income: '',
    extraMortgageAmount: '0',
    ownMoney: '',
});
const interestRate = ref(2.5);
const monthlyMortgageAmount = ref(0);
const minMonthlyAmount = ref(0); // when mortgage takes longer than 35 years, this is the minimum monthly amount
const monthlyMortgageAmountSet = ref(0);

const totalAmountPaidOff = ref(0);
const totalMortgage = ref(0);
const totalInterestPaid = ref(0);
const totalMortgageYears = ref(0);

onBeforeMount(async () => {
    ETH_PRICE.value = await getEthPrice();
    if (route.params.address) {
        propertyContractAddress.value = `${route.params.address}`;
        await getProperty(`${route.params.address}`);
        await getBidOpen(`${route.params.address}`);
    }

    loaded.value = true;
});

onMounted(async () => {
    const anchor = route.query.link;
    if (anchor) {
        const element = document.getElementById(`${anchor}`);
        if (element) {
            element.scrollIntoView();
        }
    }
});

async function getProperty(address: string) {
    const contract = new Property(store.getChainId, address);

    await contract.getPropertyInfo()
        .then(async (result: PropertyType) => {
            property.value = result;
        })
        .catch((error: any) => {
            console.log(error);
        });
}

async function getBidOpen(address: string) {
    const contract = new Property(store.getChainId, address);

    await contract.biddingOpenTime()
        .then(async (result: any) => {
            const currentDate = new Date().getTime();
            const contractOpenTime = new Date(result.toString() * 1000).getTime();
            contractOpenDate.value = new Date(result.toString() * 1000);

            bidOpen.value = currentDate >= contractOpenTime;
        })
        .catch((error: any) => {
            console.log(error);
        });
}

async function requestMortgage() {
    isSubmitted.value = true;
    const yearlyIncome = (Number(mortgageRequest.value.income) * 12) * 1e6;
    const monthlyIncome = Number(mortgageRequest.value.income) * 1e6;
    const mortgageRequester = {
        name: mortgageRequest.value.name,
        incomeYearly: yearlyIncome,
        incomeMonthly: monthlyIncome,
        KYCVerified: false
    }

    const mortgageETHAmount = (Number((Number(property.value.price) / 1e6) / ETH_PRICE.value) + Number(mortgageRequest.value.extraMortgageAmount)) - Number(mortgageRequest.value.ownMoney);
    const mortgagePayment = {
        amountETH: ethers.utils.parseEther(mortgageETHAmount.toString()),
        amountUSD: (mortgageETHAmount * ETH_PRICE.value * 1e6).toFixed(0),
        totalPayments: totalMonthlyPayments.value, // in months
        endDate: mortgageEndDate.value.getTime(),
        interestRate: interestRate.value * 1000,
    }
    propertyContractAddress.value;

    const contract = new MortgageFactory(store.getChainId);

    console.log({mortgageRequester, mortgagePayment, propertyContractAddress: propertyContractAddress.value})

    // Set Listener for PropertyCreated event
    const contractInstance = await contract.getContract();
    await contractInstance.on('MortgageRequested', (mortgageContract: string, propertyContract: string, owner: any) => {
        if (owner.toString().toLowerCase() === store.getConnectedWallet.toString().toLowerCase()) {
            console.log({mortgageContract, propertyContract, owner});
            // router.push({name: 'dao.mortgage.request.detail', params: {address: mortgageContract}});
            router.push({name: 'dao.dashboard'});
        }
    });

    await contract.requestMortgage(propertyContractAddress.value, mortgageRequester, mortgagePayment)
        .then(async (result: any) => {
            await result.wait(1);
        })
        .catch((error: any) => {
            isSubmitted.value = false;
            console.log(error);
        });
}

function calculateMortgageTotalAmount(income: number, propertyCost: number) {
    totalMortgage.value = propertyCost;
    const monthlyInterestRate = (interestRate.value / 100) / 12; // monthly interest rate
    const loanAmount = propertyCost; // assume full property cost as loan amount

    // let numerator = Math.log(1 + (loanAmount / monthlyMortgageAmount.value - 1) * monthlyInterestRate);
    // let denominator = Math.log(1 + monthlyInterestRate);
    // let n = Math.ceil(numerator / denominator);

    let n = -Math.log(1 - monthlyInterestRate * loanAmount / monthlyMortgageAmount.value) /
      Math.log(1 + monthlyInterestRate); // number of months to pay off loan

    console.log(n);
    if (n > 420) { // limit number of mortgage years to maximum of 35 years
        let copyOfN = n;
        n = 420;
        let monthlyMortgage = loanAmount * monthlyInterestRate /
          (1 - Math.pow(1 + monthlyInterestRate, -n));
        // @ts-ignore
        minMonthlyAmount.value = Number(monthlyMortgage).toFixed(2);

        console.log({minMonthlyAmount, monthlyMortgageAmount})
        if (Number(minMonthlyAmount.value) > Number(monthlyMortgageAmount.value)) {
            // @ts-ignore
            monthlyMortgageAmount.value = Number(monthlyMortgageAmount.value).toFixed(2);
            // @ts-ignore
            minMonthlyAmount.value = Number(monthlyMortgage).toFixed(2);

            n = copyOfN;
        } else {
            // @ts-ignore
            monthlyMortgageAmount.value = Number(monthlyMortgage).toFixed(2);
        }
    } else {
        // calculate what min should be
        let m = 420;
        minMonthlyAmount.value = loanAmount * monthlyInterestRate /
          (1 - Math.pow(1 + monthlyInterestRate, -m));
    }

    const currentDate = new Date();
    mortgageEndDate.value = addMonths(currentDate, n);
    const timeDifference = mortgageEndDate.value.getTime() - currentDate.getTime();
    const daysRemaining = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
    const totalPayments = Math.ceil(daysRemaining / 30);

    totalMonthlyPayments.value = totalPayments;

    console.log(`Total number of mortgage payments: ${totalPayments}`);
    totalMortgageYears.value = n/12;
    // totalMortgageYears.value = n*12;
    // totalMortgageYears.value = totalPayments/12;
    // const totalPaid = monthlyMortgageAmount.value * totalPayments; // total amount paid over the loan term
    // totalInterestPaid.value = Number((loanAmount - totalPaid).toFixed(2));
    // totalAmountPaidOff.value = loanAmount + totalInterestPaid.value

    const totalPaid = monthlyMortgageAmount.value * totalPayments; // total amount paid over the loan term
    totalAmountPaidOff.value = Number(totalPaid.toFixed(2));
    totalInterestPaid.value = Number((totalPaid - loanAmount).toFixed(2));

    return totalPaid.toFixed(2);
}

function addMonths(date: Date, months:number) {
    const newDate = new Date(date.getTime());

    // Get the current month and year
    let currentMonth = newDate.getMonth();
    let currentYear = newDate.getFullYear();

    // Calculate the new month and year
    let newMonth = currentMonth + months;
    let newYear = currentYear;

    // Adjust the year if the new month exceeds December
    if (newMonth > 11) {
        newYear += Math.floor(newMonth / 12);
        newMonth = newMonth % 12;
    }

    // Set the new month and year
    newDate.setMonth(newMonth);
    newDate.setFullYear(newYear);

    return newDate;
}

let providerStakeResults = ref([]);
let totalStake = ref(0);
let totalAmount = ref(0);
// async function provideMortgageLiquidity() {
//     totalStake.value = 0;
//     providerStakeResults.value = [];
//     totalAmount.value = 0;
//
//     const profitToShare = 24391; // total ETH staked by all liquidity providers // 128370 (100 properties?)
//     const totalETH = 10000; // total amount to be staked
//     const numStakers = 1824; // number of stakers
//     const maxStake = 10; // maximum stake for the first staker
//     const minStake = 1; // minimum stake for the last staker
//     const decrement = (maxStake - minStake) / (numStakers - 1); // amount to decrement for each subsequent staker
//     let currentStake = maxStake; // current stake amount
//     let totalStaked = 0; // total amount staked
//     const providerShares = []; // array to hold the share of each provider
//
//     for (let i = 1; i <= numStakers; i++) {
//         currentStake = Math.max(currentStake - decrement, minStake); // calculate current stake
//         const remainingETH = totalETH - totalStaked; // calculate remaining ETH to be staked
//         const stakedETH = Math.min(currentStake, remainingETH); // stake either current stake or remaining ETH
//         providerShares.push(stakedETH);
//         console.log(`Staker ${i} staked ${stakedETH.toFixed(2)} ETH`);
//         totalStaked += stakedETH; // add staked amount to total
//         totalStake.value += stakedETH;
//     }
//
//     console.log(`Total of ${totalStake}ETH staked by all liquidity providers`);
//
//     for (let i = 0; i < providerShares.length; i++) {
//         const share = providerShares[i] / totalStake.value * 100;
//         totalAmount.value +=  profitToShare / 100 * share;
//         const amount = profitToShare / 100 * share;
//         const result = `Liquidity provider ${i} staked ${providerShares[i]}ETH and has a share of ${share}%. Resulting in $${amount.toFixed(4)} profit.`;
//         providerStakeResults.value.push(result);
//     }
//
// }

function calcMortgage() {
    const mortgageNeeded = (Number(property.value.askingPrice.toString()) + Number(mortgageRequest.value.extraMortgageAmount)) - Number(mortgageRequest.value.ownMoney)
    calculateMortgageTotalAmount(Number(mortgageRequest.value.income), Number(mortgageNeeded));

    // if (minMonthlyAmount.value / 0.35 >= Number(mortgageRequest.value.income)) {
    //     provideMortgageLiquidity();
    // }
}

function clearForm() {
    mortgageRequest.value = {
        name: '',
        income: '',
        ownMoney: '',
        extraMortgageAmount: '',
    }
    monthlyMortgageAmount.value = 0;
    monthlyMortgageAmountSet.value = 0;
    totalMortgageYears.value = 0;
    totalMonthlyPayments.value = 0;
    totalAmountPaidOff.value = 0;
    totalInterestPaid.value = 0;
    mortgageEndDate.value = new Date();
    minMonthlyAmount.value = 0;
    totalStake.value = 0;
    providerStakeResults.value = [];
    totalAmount.value = 0;
}

watch(mortgageRequest, () => {
    if (mortgageRequest.value.income !== '') {
        monthlyMortgageAmount.value = Number(mortgageRequest.value.income) * 0.35; // 35% of income
        monthlyMortgageAmountSet.value = monthlyMortgageAmount.value;
        calcMortgage();
    }

    if (Number(mortgageRequest.value.ownMoney) < 0) {
        mortgageRequest.value.ownMoney = '0';
    }

    isValid.value = mortgageRequest.value.income !== '' && mortgageRequest.value.ownMoney !== '' && mortgageRequest.value.extraMortgageAmount !== '';

    if (monthlyMortgageAmount.value > (Number(mortgageRequest.value.income) * 0.35) || monthlyMortgageAmount.value < Number(minMonthlyAmount)) {
        isValid.value = false;
    }
}, {deep: true});

watch(monthlyMortgageAmount, () => {
    if (monthlyMortgageAmount.value > (Number(mortgageRequest.value.income) * 0.35)) {
        monthlyMortgageAmount.value = Number(mortgageRequest.value.income) * 0.35;
    }
    if (monthlyMortgageAmount.value !== monthlyMortgageAmountSet.value && monthlyMortgageAmount.value > 0) {
        monthlyMortgageAmountSet.value = monthlyMortgageAmount.value;
        calcMortgage();
    }

    if (monthlyMortgageAmount.value > (Number(mortgageRequest.value.income) * 0.35) || monthlyMortgageAmount.value < Number(minMonthlyAmount)) {
        isValid.value = false;
    }
})
</script>
<template>
<div>
    <div id="request-top"  class="bg-gray-900">
      <div v-if="loaded && store.isConnected" class="mx-auto max-w-7xl px-8 py-12">
          <div class="space-y-12">
              <div class="border-b border-white/10 pb-12 text-gray-300">
                  <h2 class="text-base font-semibold leading-7 text-white">Mortgage Request Information</h2>
                  <div class="mt-10 grid grid-cols-1 gap-y-8 gap-x-6 sm:grid-cols-6">
                      <div class="sm:col-span-4">
                          <label for="username" class="block text-sm font-medium leading-6 text-white">
                              Property Asking Price
                              <span class="pl-2">|</span>
                              <span class="pl-2">{{ Number((property.price / 1e6) / ETH_PRICE).toFixed(6) }}ETH</span>
                              <span class="pl-2">|</span>
                              <span class="pl-2">{{formatDollars(`${Number(property.price / 1e6)}`)}}</span>
                          </label>
                          <div class="mt-2">
                              <div class="flex rounded-md bg-white/5 ring-1 ring-inset ring-white/10 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500">
                                  <input type="text" disabled :value="`${Number((property.price / 1e6) / ETH_PRICE).toFixed(6)} ETH`" class="flex-1 cursor-not-allowed border-0 bg-transparent py-1.5 text-white focus:ring-0 sm:text-sm sm:leading-6" placeholder="Price in ETH" />
                              </div>
                          </div>
                      </div>

                      <div class="sm:col-span-4">
                          <label for="username" class="block text-sm font-medium leading-6 text-white">
                              Extra funds needed (max 15% of asking price)
                              <span class="text-xs text-gray-400 block">
                                  Max: {{(Number((property.price / 1e6) / ETH_PRICE) * 0.15)}}ETH
                              </span>
                          </label>
                          <div class="mt-2">
                              <div class="flex rounded-md bg-white/5 ring-1 ring-inset ring-white/10 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500">
                                  <input type="number"
                                         :max="(Number((property.price / 1e6) / ETH_PRICE) * 0.15)"
                                         v-model="mortgageRequest.extraMortgageAmount"
                                         class="flex-1 border-0 bg-transparent py-1.5 text-white focus:ring-0 sm:text-sm sm:leading-6" placeholder="Price in ETH" />
                              </div>
                          </div>
                      </div>

                      <div class="sm:col-span-4">
                          <label for="username" class="block text-sm font-medium leading-6 text-white">
                              Own Money, in ETH

                          </label>
                          <div class="mt-2">
                              <div class="flex rounded-md bg-white/5 ring-1 ring-inset ring-white/10 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500">
                                  <input type="number"
                                         v-model="mortgageRequest.ownMoney"
                                         class="flex-1 border-0 bg-transparent py-1.5 text-white focus:ring-0 sm:text-sm sm:leading-6" placeholder="Price in ETH" />
                              </div>
                          </div>
                      </div>

                      <div class="sm:col-span-4">
                          <label for="username" class="block text-sm font-medium leading-6 text-white">
                              Mortgage Needed

                          </label>
                          <div class="mt-2">
                              <div class="flex rounded-md bg-white/5 ring-1 ring-inset ring-white/10 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500">
                                  <input type="text"
                                         disabled
                                         :value="((Number((property.price / 1e6) / ETH_PRICE) + Number(mortgageRequest.extraMortgageAmount)) - Number(mortgageRequest.ownMoney)).toFixed(6)"
                                         class="flex-1 cursor-not-allowed border-0 bg-transparent py-1.5 text-white focus:ring-0 sm:text-sm sm:leading-6" placeholder="Price in ETH" />
                              </div>
                          </div>
                      </div>

                      <div class="sm:col-span-4">
                          <label for="username" class="block text-sm font-medium leading-6 text-white">
                              Full Name
                          </label>
                          <div class="mt-2">
                              <div class="flex rounded-md bg-white/5 ring-1 ring-inset ring-white/10 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500">
                                  <input type="text"
                                         v-model="mortgageRequest.name"
                                         class="flex-1 border-0 bg-transparent py-1.5 text-white focus:ring-0 sm:text-sm sm:leading-6" />
                              </div>
                          </div>
                      </div>

                      <div class="sm:col-span-4">
                          <label for="username" class="block text-sm font-medium leading-6 text-white">
                              Net Income
                          </label>
                          <div class="mt-2">
                              <div class="flex rounded-md bg-white/5 ring-1 ring-inset ring-white/10 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500">
                                  <input type="number"
                                         v-model="mortgageRequest.income"
                                         class="flex-1 border-0 bg-transparent py-1.5 text-white focus:ring-0 sm:text-sm sm:leading-6" />
                              </div>
                          </div>
                      </div>

                      <div class="sm:col-span-4">
                          <label for="username" class="block text-sm font-medium leading-6 text-white">
                              Preferred Monthly Mortgage Amount
                          </label>
                          <div class="mt-2">
                              <div class="rounded-md flex bg-white/5 ring-1 ring-inset ring-white/10 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500">
                                  <input type="number"
                                         v-model="monthlyMortgageAmount" :max="(Number(mortgageRequest.income) * 0.35)" :min="(Number(mortgageRequest.income) * 0.35) / 1.6"
                                         class="border-0 flex-1 bg-transparent py-1.5 text-white focus:ring-0 sm:text-sm sm:leading-6" />
                              </div>
                              <div v-if="mortgageRequest.income !== ''" class="bg-blue-100 block p-2 mt-4 rounded-lg border border-blue-500 text-blue-500">
                                  Max monthly mortgage amount: ${{Number(mortgageRequest.income) * 0.35}}
                                  <br>
                                  Min monthly mortgage amount:

                                  ${{ Number(minMonthlyAmount).toFixed(2) }}
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
              <div class="mt-10 grid grid-cols-1 gap-y-8 gap-x-6 sm:grid-cols-6">
                  <div class="sm:col-span-4">
                      <div class="bg-blue-100 p-2 mt-2 rounded-lg border border-blue-500 text-blue-500">
                        Information about your mortgage:<br>
                          <code>
                              Interest Rate: {{interestRate}}% <br>
                              Total Payments: {{totalMonthlyPayments}} <br>
                              Total Years: {{totalMortgageYears}} <br>
                              Mortgage End Date : {{mortgageEndDate.toLocaleDateString()}} <br>
                              Total Mortgage amount: {{formatDollars(`${totalMortgage}`)}} <br>
                              Total Interest paid: {{formatDollars(`${totalInterestPaid}`)}} <br>
                              Total amount paid: {{formatDollars(`${totalAmountPaidOff}`)}} <br>
                          </code>
                      </div>
                  </div>
                  <div class="sm:col-span-4">
                      <div class="mt-6 flex items-center justify-end gap-x-6">
                          <button v-on:click="clearForm" class="text-sm font-semibold leading-6 text-white">Cancel</button>


                          <Button
                            :text="'Request Mortgage'"
                            :spinner="'animate-spin mr-1 h-3.5 w-3.5 text-white group-hover:text-gray-200'"
                            :btnDisabled="'opacity-50 cursor-not-allowed flex-none rounded-md border-2 border-indigo-500 px-3 py-2 text-sm font-semibold text-indigo-500 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white'"
                            :btnValid="'flex-none rounded-md border-2 border-indigo-500 px-3 py-2 text-sm font-semibold text-indigo-500 hover:bg-indigo-500 hover:text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white'"
                            :btnSubmitted="'relative w-full inline-flex flex-1 bg-indigo-500 px-3 py-2 text-sm font-semibold text-white items-center justify-center rounded-md'"
                            :isSubmitted="isSubmitted"
                            :isValid="isValid"
                            @onClick="requestMortgage"
                          />
                      </div>
                  </div>
              </div>
<!--                      <div v-if="providerStakeResults.length > 0" class="mt-4 col-span-full">-->
<!--                          <div class="bg-yellow-100 p-2 mt-2 rounded-lg border border-yellow-500 text-yellow-500">-->
<!--                              <h3 class="text-lg font-bold">Provider Stake Results: {{totalStake}}ETH Staked</h3>-->
<!--                              <span v-for="result in providerStakeResults" class="block w-full pb-2">-->
<!--                                  {{result}}-->
<!--                              </span>-->
<!--                              <h3 class="text-lg font-bold">Total Payout: {{totalAmount}}</h3>-->
<!--                          </div>-->
<!--                      </div>-->
<!--                  </div>-->
          </div>
      </div>
    </div>
</div>
</template>
