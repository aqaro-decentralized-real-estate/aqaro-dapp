<script setup lang="ts">
import {ref} from "vue";
import {TrashIcon} from '@heroicons/vue/20/solid'

const emits = defineEmits(['upload:drop', 'upload:clear']);

const props = defineProps({
    fileArray: {
        type: Array,
        required: true,
    },
});

let dropActive = ref(false);
let showFiles = ref(false);

function dropFiles(e: any) {
    if (e.dataTransfer.files.length > 0)
        emits('upload:drop', e.dataTransfer.files)

    dropActive.value = false;
}

async function selectFile(event: any) {
    const files = event.target.files;
    if (files.length > 0)
        emits('upload:drop', files)
}

function clearFiles() {
    emits('upload:clear', [])
}
</script>
<template>
    <div class="w-full bg-gray-800">
        <div :class="[dropActive ? 'border-2 border-indigo-500 focus:ring-2 focus:ring-inset focus:ring-indigo-500' : 'border-0', 'block w-full rounded-md bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 sm:text-sm sm:leading-6']">
            <div class="w-full text-center sm:mt-0">
                <div>
                    <div
                            :data-active="dropActive"
                            @dragenter.prevent="dropActive = true"
                            @dragleave.prevent="dropActive = false"
                            @dragover.prevent="dropActive = true"
                            @drop.prevent="dropFiles"
                            class="flex justify-center px-6 pt-5 pb-6">
                        <div class="space-y-1 text-center">
                            <div v-if="fileArray.length > 0">
                                <span class="text-sm text-gray-300 block">{{fileArray.length}} Selected Files</span>
                                <div v-on:click="showFiles = !showFiles" class="text-sm mt-2 text-gray-300 block cursor-pointer">
                                    <span v-if="!showFiles">Show</span>
                                    <span v-if="showFiles">Hide</span>
                                </div>

                                <div v-if="showFiles" class="mt-2 cursor-pointer" v-on:click="showFiles = false">
                                    <span v-for="file in fileArray" :key="file.name" class="text-sm text-gray-300 block">{{ file.name }}</span>
                                </div>
                            </div>
                            <svg v-if="fileArray.length === 0" class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                            <div v-if="dropActive">
                                <p class="text-xs text-gray-500">Drop to upload files</p>
                            </div>
                            <div v-else>
                                <div class="space-y-1 text-center text-sm text-gray-600">
                                    <label for="file-upload" class="relative mt-6 block text-center cursor-pointer rounded-md bg-indigo-500 font-medium text-white focus-within:outline-none focus-within:ring-2 focus-within:ring-secondary-blue focus-within:ring-offset-2 hover:text-secondary-blue">
                                        <span>Upload files</span>
                                        <input v-on:change="selectFile" id="file-upload" name="file-upload" multiple type="file" class="sr-only" />
                                    </label>
                                </div>
                                <p class="text-xs text-gray-500">PNG, JPG, GIF up to 2MB</p>
                            </div>
                        </div>
                    </div>
                    <div v-if="fileArray.length > 0" class="w-full mt-4 pb-2">
                        <TrashIcon class="h-6 w-6 mx-auto text-gray-400 hover:text-red-500 cursor-pointer" v-on:click="clearFiles" aria-hidden="true" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
