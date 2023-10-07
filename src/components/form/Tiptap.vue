<script setup lang="ts">
import {useEditor, EditorContent, Editor} from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import {onBeforeUnmount, ref, watch} from "vue";
import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import Strike from '@tiptap/extension-strike'
import TiptapContent from "@/components/form/TiptapContent.vue";

const emits = defineEmits(['update:content']);

const props = defineProps({
    content: {
        type: String,
        required: true,
    },
});
let editor = useEditor({
    extensions: [
        StarterKit,
        Strike,
        // Document,
        // Paragraph,
        // Text,
    ],
    editorProps: {
        attributes: {
            class: 'border-0 min-h-min px-5 py-6 rounded-md outline-none focus:outline-none ring-1 ring-inset focus:ring-2 focus:ring-inset focus:ring-indigo-500 ring-gray-500',
            placeholder: 'Enter some text...'
        },
    },

    content: '',

    onUpdate: () => {
        emits('update:content', editor.value?.getHTML());
    },
})

watch(() => props.content, (value: any) => {
    const isSame = editor.value?.getHTML() === value;

    if (isSame) {
        return;
    }
    editor.value?.commands.setContent(value, false);
});


onBeforeUnmount(() => {
    editor.value?.destroy();
});
</script>
<template>
    <div v-if="editor" class="pt-2  px-4 pb-4 rounded-md ring-1 ring-gray-500">
        <button @click="editor.chain().focus().toggleBold().run()" :disabled="!editor.can().chain().focus().toggleBold().run()" class="border mt-2 border-gray-500 hover:bg-indigo-800 py-1 px-3 rounded-md mr-2" :class="{ 'is-active bg-indigo-500 text-white': editor.isActive('bold') }">
            bold
        </button>
        <button @click="editor.chain().focus().toggleItalic().run()" :disabled="!editor.can().chain().focus().toggleItalic().run()" class="border mt-2 border-gray-500 py-1 px-3 hover:bg-indigo-800 rounded-md mr-2" :class="{ 'is-active bg-indigo-500 text-white': editor.isActive('italic') }">
            italic
        </button>
        <button @click="editor.chain().focus().toggleStrike().run()" :disabled="!editor.can().chain().focus().toggleStrike().run()" class="border mt-2 border-gray-500 hover:bg-indigo-800 py-1 px-3 rounded-md mr-2" :class="{ 'is-active': editor.isActive('strike') }">
            strike
        </button>
        <button @click="editor.chain().focus().toggleCode().run()" :disabled="!editor.can().chain().focus().toggleCode().run()" class="border mt-2 border-gray-500 hover:bg-indigo-800 py-1 px-3 rounded-md mr-2" :class="{ 'is-active': editor.isActive('code') }">
            code
        </button>
        <button class="border border-gray-500 hover:bg-indigo-800 mt-2 py-1 px-3 rounded-md mr-2" @click="editor.chain().focus().unsetAllMarks().run()">
            clear marks
        </button>
        <button class="border border-gray-500 hover:bg-indigo-800 mt-2 py-1 px-3 rounded-md mr-2" @click="editor.chain().focus().clearNodes().run()">
            clear nodes
        </button>
        <button class="border border-gray-500 hover:bg-indigo-800 mt-2 py-1 px-3 rounded-md mr-2" @click="editor.chain().focus().setParagraph().run()" :class="{ 'is-active bg-indigo-500 text-white': editor.isActive('paragraph') }">
            paragraph
        </button>
        <button class="border border-gray-500 hover:bg-indigo-800 mt-2 py-1 px-3 rounded-md mr-2" @click="editor.chain().focus().toggleHeading({ level: 1 }).run()" :class="{ 'is-active bg-indigo-500 text-white': editor.isActive('heading', { level: 1 }) }">
            h1
        </button>
        <button class="border border-gray-500 hover:bg-indigo-800 mt-2 py-1 px-3 rounded-md mr-2" @click="editor.chain().focus().toggleHeading({ level: 2 }).run()" :class="{ 'is-active bg-indigo-500 text-white': editor.isActive('heading', { level: 2 }) }">
            h2
        </button>
        <button class="border border-gray-500 hover:bg-indigo-800 mt-2 py-1 px-3 rounded-md mr-2" @click="editor.chain().focus().toggleHeading({ level: 3 }).run()" :class="{ 'is-active bg-indigo-500 text-white': editor.isActive('heading', { level: 3 }) }">
            h3
        </button>
        <button class="border border-gray-500 hover:bg-indigo-800 mt-2 py-1 px-3 rounded-md mr-2" @click="editor.chain().focus().toggleHeading({ level: 4 }).run()" :class="{ 'is-active bg-indigo-500 text-white': editor.isActive('heading', { level: 4 }) }">
            h4
        </button>
        <button class="border border-gray-500 hover:bg-indigo-800 mt-2 py-1 px-3 rounded-md mr-2" @click="editor.chain().focus().toggleHeading({ level: 5 }).run()" :class="{ 'is-active bg-indigo-500 text-white': editor.isActive('heading', { level: 5 }) }">
            h5
        </button>
        <button class="border border-gray-500 hover:bg-indigo-800 mt-2 py-1 px-3 rounded-md mr-2" @click="editor.chain().focus().toggleHeading({ level: 6 }).run()" :class="{ 'is-active bg-indigo-500 text-white': editor.isActive('heading', { level: 6 }) }">
            h6
        </button>
        <button class="border border-gray-500 hover:bg-indigo-800 mt-2 py-1 px-3 rounded-md mr-2" @click="editor.chain().focus().toggleBulletList().run()" :class="{ 'is-active bg-indigo-500 text-white': editor.isActive('bulletList') }">
            bullet list
        </button>
        <button class="border border-gray-500 hover:bg-indigo-800 mt-2 py-1 px-3 rounded-md mr-2" @click="editor.chain().focus().toggleOrderedList().run()" :class="{ 'is-active bg-indigo-500 text-white': editor.isActive('orderedList') }">
            ordered list
        </button>
        <button class="border border-gray-500 hover:bg-indigo-800 mt-2 py-1 px-3 rounded-md mr-2" @click="editor.chain().focus().toggleCodeBlock().run()" :class="{ 'is-active bg-indigo-500 text-white': editor.isActive('codeBlock') }">
            code block
        </button>
        <button class="border border-gray-500 hover:bg-indigo-800 mt-2 py-1 px-3 rounded-md mr-2" @click="editor.chain().focus().toggleBlockquote().run()" :class="{ 'is-active bg-indigo-500 text-white': editor.isActive('blockquote') }">
            blockquote
        </button>
        <button class="border border-gray-500 hover:bg-indigo-800 mt-2 py-1 px-3 rounded-md mr-2" @click="editor.chain().focus().setHorizontalRule().run()">
            horizontal rule
        </button>
        <button class="border border-gray-500 hover:bg-indigo-800 mt-2 py-1 px-3 rounded-md mr-2" @click="editor.chain().focus().setHardBreak().run()">
            hard break
        </button>
        <button class="border border-gray-500 hover:bg-indigo-800 mt-2 py-1 px-3 rounded-md mr-2" @click="editor.chain().focus().undo().run()" :disabled="!editor.can().chain().focus().undo().run()">
            undo
        </button>
        <button class="border border-gray-500 hover:bg-indigo-800 mt-2 py-1 px-3 rounded-md mr-2" @click="editor.chain().focus().redo().run()" :disabled="!editor.can().chain().focus().redo().run()">
            redo
        </button>
    </div>
    <div class="editor mt-4">
        <EditorContent :editor="editor" />
<!--        <div class="grid grid-cols-2 gap-4">-->
<!--            <div>-->
<!--                -->
<!--            </div>-->
<!--            <div>-->
<!--                -->
<!--            </div>-->
<!--        </div>-->
    </div>
</template>
