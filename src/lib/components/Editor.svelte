<script lang="ts">
  import { onMount } from 'svelte';
  import { Editor } from '@tiptap/core';
  import StarterKit from '@tiptap/starter-kit';
  import Link from '@tiptap/extension-link';
  import Image from '@tiptap/extension-image';
  import Placeholder from '@tiptap/extension-placeholder';

  export let content = '';
  export let onChange = (newContent: string) => {};

  let editor: Editor;
  let editorElement: HTMLElement;
  let showHeaderDropdown = false;

  const isUrl = (text: string) => {
    try {
      new URL(text);
      return true;
    } catch {
      return false;
    }
  };

  onMount(() => {
    if (!editorElement) return;

    editor = new Editor({
      element: editorElement,
      extensions: [
        StarterKit,
        Link.configure({
          openOnClick: false,
          HTMLAttributes: {
            rel: 'noopener noreferrer',
            class: 'text-blue-500 hover:text-blue-600 underline',
          },
        }),
        Image.configure({
          HTMLAttributes: {
            class: 'rounded-lg max-w-full',
          },
        }),
        Placeholder.configure({
          placeholder: 'Start writing your content...',
        }),
      ],
      content,
      onUpdate: ({ editor }) => {
        onChange(editor.getHTML());
      },
      editorProps: {
        handlePaste: (view, event) => {
          const text = event.clipboardData?.getData('text/plain');
          if (!text) return false;

          if (isUrl(text)) {
            event.preventDefault();
            const { state, dispatch } = view;
            const { tr } = state;
            const link = document.createElement('a');
            link.href = text;
            link.textContent = text;
            link.rel = 'noopener noreferrer';
            link.className = 'text-blue-500 hover:text-blue-600 underline';
            
            const node = view.state.schema.text(text, [
              view.state.schema.marks.link.create({ href: text })
            ]);
            
            tr.replaceSelectionWith(node);
            dispatch(tr);
            return true;
          }

          return false;
        },
      },
    });

    return () => {
      editor.destroy();
    };
  });
</script>

<div class="border border-[#70A5B9]/20">
  <div class="border-b border-[#70A5B9]/20 p-2 flex flex-wrap gap-2">
    <button
      class="p-2 hover:bg-[#70A5B9]/10 text-[#70A5B9] hover:text-[#70A5B9]/90 transition-colors flex flex-col items-center font-mono"
      on:click={() => editor?.chain().focus().toggleBold().run()}
      class:active={editor?.isActive('bold')}
    >
      <span class="font-bold text-lg">B</span>
      <span class="text-xs mt-1">Bold</span>
    </button>
    <button
      class="p-2 hover:bg-[#70A5B9]/10 text-[#70A5B9] hover:text-[#70A5B9]/90 transition-colors flex flex-col items-center font-mono"
      on:click={() => editor?.chain().focus().toggleItalic().run()}
      class:active={editor?.isActive('italic')}
    >
      <span class="italic text-lg">I</span>
      <span class="text-xs mt-1">Italic</span>
    </button>
    <button
      class="p-2 hover:bg-[#70A5B9]/10 text-[#70A5B9] hover:text-[#70A5B9]/90 transition-colors flex flex-col items-center font-mono"
      on:click={() => editor?.chain().focus().toggleStrike().run()}
      class:active={editor?.isActive('strike')}
    >
      <span class="line-through text-lg">S</span>
      <span class="text-xs mt-1">Strike</span>
    </button>
    <div class="w-px h-12 bg-[#70A5B9]/20 mx-2" />
    
    <div class="relative">
      <button
        class="p-2 hover:bg-[#70A5B9]/10 text-[#70A5B9] hover:text-[#70A5B9]/90 transition-colors flex flex-col items-center font-mono"
        on:click={() => showHeaderDropdown = !showHeaderDropdown}
      >
        <span class="text-lg">H</span>
        <span class="text-xs mt-1">Heading</span>
      </button>
      {#if showHeaderDropdown}
        <div class="absolute top-full left-0 mt-1 bg-[#131313] border border-[#70A5B9]/20 shadow-lg z-10">
          <button
            class="w-full px-4 py-2 text-left text-sm hover:bg-[#70A5B9]/10 text-[#70A5B9] hover:text-[#70A5B9]/90 font-mono"
            on:click={() => {
              editor?.chain().focus().toggleHeading({ level: 1 }).run();
              showHeaderDropdown = false;
            }}
          >
            Heading 1
          </button>
          <button
            class="w-full px-4 py-2 text-left text-sm hover:bg-[#70A5B9]/10 text-[#70A5B9] hover:text-[#70A5B9]/90 font-mono"
            on:click={() => {
              editor?.chain().focus().toggleHeading({ level: 2 }).run();
              showHeaderDropdown = false;
            }}
          >
            Heading 2
          </button>
          <button
            class="w-full px-4 py-2 text-left text-sm hover:bg-[#70A5B9]/10 text-[#70A5B9] hover:text-[#70A5B9]/90 font-mono"
            on:click={() => {
              editor?.chain().focus().toggleHeading({ level: 3 }).run();
              showHeaderDropdown = false;
            }}
          >
            Heading 3
          </button>
        </div>
      {/if}
    </div>

    <div class="w-px h-12 bg-[#70A5B9]/20 mx-2" />
    
    <button
      class="p-2 hover:bg-[#70A5B9]/10 text-[#70A5B9] hover:text-[#70A5B9]/90 transition-colors flex flex-col items-center font-mono"
      on:click={() => editor?.chain().focus().toggleBulletList().run()}
      class:active={editor?.isActive('bulletList')}
    >
      <span class="text-lg">•</span>
      <span class="text-xs mt-1">Bullet List</span>
    </button>
    <button
      class="p-2 hover:bg-[#70A5B9]/10 text-[#70A5B9] hover:text-[#70A5B9]/90 transition-colors flex flex-col items-center font-mono"
      on:click={() => editor?.chain().focus().toggleOrderedList().run()}
      class:active={editor?.isActive('orderedList')}
    >
      <span class="text-lg">1.</span>
      <span class="text-xs mt-1">Numbered List</span>
    </button>
    <div class="w-px h-12 bg-[#70A5B9]/20 mx-2" />
    
    <button
      class="p-2 hover:bg-[#70A5B9]/10 text-[#70A5B9] hover:text-[#70A5B9]/90 transition-colors flex flex-col items-center font-mono"
      on:click={() => editor?.chain().focus().toggleCodeBlock().run()}
      class:active={editor?.isActive('codeBlock')}
    >
      <span class="text-lg">{'<>'}</span>
      <span class="text-xs mt-1">Code Block</span>
    </button>
    <button
      class="p-2 hover:bg-[#70A5B9]/10 text-[#70A5B9] hover:text-[#70A5B9]/90 transition-colors flex flex-col items-center font-mono"
      on:click={() => editor?.chain().focus().toggleBlockquote().run()}
      class:active={editor?.isActive('blockquote')}
    >
      <span class="text-lg">"</span>
      <span class="text-xs mt-1">Quote</span>
    </button>
    <div class="w-px h-12 bg-[#70A5B9]/20 mx-2" />
    
    <button
      class="p-2 hover:bg-[#70A5B9]/10 text-[#70A5B9] hover:text-[#70A5B9]/90 transition-colors flex flex-col items-center font-mono"
      on:click={() => {
        const url = window.prompt('Enter the URL');
        if (url) {
          editor?.chain().focus().setLink({ href: url }).run();
        }
      }}
      class:active={editor?.isActive('link')}
    >
      <span class="text-lg">🔗</span>
      <span class="text-xs mt-1">Link</span>
    </button>
    <button
      class="p-2 hover:bg-[#70A5B9]/10 text-[#70A5B9] hover:text-[#70A5B9]/90 transition-colors flex flex-col items-center font-mono"
      on:click={() => {
        const url = window.prompt('Enter the image URL');
        if (url) {
          editor?.chain().focus().setImage({ src: url }).run();
        }
      }}
    >
      <span class="text-lg">🖼️</span>
      <span class="text-xs mt-1">Image</span>
    </button>
  </div>
  <div bind:this={editorElement} class="prose prose-invert max-w-none p-4 min-h-[calc(100vh-16rem)] font-mono" />
</div>

<style>
  :global(.ProseMirror) {
    outline: none;
  }
  :global(.ProseMirror p.is-editor-empty:first-child::before) {
    color: #70A5B9;
    content: attr(data-placeholder);
    float: left;
    height: 0;
    pointer-events: none;
  }
  :global(.ProseMirror a) {
    color: #70A5B9;
    text-decoration: underline;
  }
  :global(.ProseMirror a:hover) {
    color: #70A5B9/90;
  }
  :global(.ProseMirror code) {
    background-color: #70A5B9/10;
    padding: 0.2em 0.4em;
    font-family: monospace;
  }
  :global(.ProseMirror pre) {
    background-color: #70A5B9/10;
    padding: 1em;
    font-family: monospace;
  }
  :global(.ProseMirror blockquote) {
    border-left: 2px solid #70A5B9;
    padding-left: 1em;
    color: #70A5B9/90;
  }
</style> 