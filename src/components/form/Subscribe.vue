<script setup lang="ts">
import {ref, watch} from "vue";
import {useSubscriptionStore} from "@/stores/subscription.store";
import Button from "@/components/form/button/Button.vue";
const store = useSubscriptionStore();

enum subscribeType {
    Launch = 'Launch',
    Newsletter = 'Newsletter'
}

const props = defineProps({
    subType: {
        type: String,
        required: true
    },
    buttonText: {
        type: String,
        required: false,
        default: 'Notify me'
    }
})

const email = ref('');
const success = ref(false);
const error = ref({
    status: false,
    msg: ''
});

const isSubmitted = ref(false);
const isValid = ref(false);

async function subscribe() {
    isSubmitted.value = true;
    const sType = props.subType as subscribeType;

    const dto = {
        email: email.value,
        type: sType
    }

    await store.subscribe(dto)
        .then((result: any) => {
            isSubmitted.value = false;
            email.value = '';
            success.value = true;
            error.value = {
                status: false,
                msg: ''
            }
        }).catch((e: any) => {
            isSubmitted.value = false;
            email.value = '';
            success.value = false;
            error.value = {
                status: true,
                msg: e.response.data.message
            }
        });
}
function closeNotification() {
    email.value = '';
    success.value = false;
    error.value = {
        status: false,
        msg: ''
    }
}

watch(email, (val: string) => {
    // verify email
    const re = /\S+@\S+\.\S+/;
    isValid.value = re.test(val);
})
</script>
<template>
    <div class="block">
        <div class="flex w-full">
            <div class="flex-1">
                <label for="email-address" class="sr-only">Email address</label>
                <input type="email" v-model="email" id="email-address" autocomplete="email" class="w-full appearance-none rounded-md border-0 bg-white/5 px-3 py-1.5 text-base text-white shadow-sm ring-1 ring-inset ring-white/10 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:w-56 sm:text-sm sm:leading-6" placeholder="Enter your email" />
            </div>
            <div class="pl-4">
                <Button
                  :text="`${buttonText}`"
                  :spinner="'animate-spin mr-1 h-3.5 w-3.5 text-gray-400 group-hover:text-gray-200'"
                  :btnDisabled="'opacity-50 cursor-not-allowed flex-none rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white'"
                  :btnValid="'flex-none rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white'"
                  :btnSubmitted="'relative w-full inline-flex flex-1 bg-white px-3 py-2 text-sm font-semibold text-gray-900 items-center justify-center rounded-lg'"
                  :isSubmitted="isSubmitted"
                  :isValid="isValid"
                  @onClick="subscribe"
                />
            </div>
        </div>
    </div>
    <div class="block mt-2">
        <div v-if="success" class="bg-green-100 max-w-md text-green-500 rounded px-2 py-1">
            <div class="flex">
                <div class="flex-1">
                    <p class="text-sm font-semibold leading-6">Thank you for subscribing!</p>
                </div>
                <div v-on:click="closeNotification" class="hover:cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </div>
            </div>
        </div>
        <div v-if="error.status" class="bg-red-100 max-w-md text-red-500 rounded px-2 py-1">
            <div class="flex">
                <div class="flex-1">
                    <p class="text-sm font-semibold leading-6">{{error.msg}}</p>
                </div>
                <div v-on:click="closeNotification" class="hover:cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </div>
            </div>
        </div>
    </div>
</template>
