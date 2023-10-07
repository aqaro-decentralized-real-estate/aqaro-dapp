<script setup lang="ts">
const props = defineProps({
    btnDisabled: {
        type: String,
        required: true
    },
    btnValid: {
        type: String,
        required: true
    },
    btnSubmitted: {
        type: String,
        required: true
    },
    spinner: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    isSubmitted: {
        type: Boolean,
        required: true
    },
    isValid: {
        type: Boolean,
        required: true
    }
});

const emit = defineEmits(['onClick']);

function onClick() {
    emit('onClick');
}
</script>
<template>
<div>
    <button
            v-if="!isSubmitted && !isValid"
            disabled
            :class="btnDisabled">
        {{ text }}
    </button>
    <button
            v-if="!isSubmitted && isValid"
            v-on:click="onClick"
            :class="btnValid">
        {{ text }}
    </button>
    <div v-if="isSubmitted && isValid">
      <button
              :class="btnSubmitted">
              <div class="inline-flex justify-center">
                  <span class="flex items-center">
                    <svg :class="spinner" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </span>
              {{ text }}
              </div>
      </button>
    </div>
</div>
</template>

