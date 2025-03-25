<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { browser } from '$app/environment';
  import Editor from '$lib/components/Editor.svelte';
  
  let title = '';
  let content = '';
  let isPublishing = false;
  let error = '';
  let wordCount = 0;
  let charCount = 0;
  
  const toolbarActions = [
    { 
      icon: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"></path></svg>`,
      label: 'Heading',
      action: '# '
    },
    { 
      icon: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>`,
      label: 'Bold',
      action: '**'
    },
    { 
      icon: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7"></path></svg>`,
      label: 'Italic',
      action: '_'
    },
    { 
      icon: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>`,
      label: 'Code',
      action: '`'
    },
    { 
      icon: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>`,
      label: 'Code Block',
      action: '```'
    },
    { 
      icon: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>`,
      label: 'Quote',
      action: '> '
    },
    { 
      icon: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path></svg>`,
      label: 'List',
      action: '- '
    },
    { 
      icon: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"></path></svg>`,
      label: 'Numbered List',
      action: '1. '
    },
    { 
      icon: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>`,
      label: 'Link',
      action: '[]():'
    },
    { 
      icon: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>`,
      label: 'Image',
      action: '![]()'
    }
  ];

  const insertMarkdown = (action: string) => {
    const textarea = document.querySelector('textarea');
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);

    let insertion = '';
    switch (action) {
      case '# ':
        insertion = '# ' + selectedText;
        break;
      case '**':
        insertion = `**${selectedText || 'bold text'}**`;
        break;
      case '_':
        insertion = `_${selectedText || 'italic text'}_`;
        break;
      case '`':
        insertion = `\`${selectedText || 'code'}\``;
        break;
      case '```':
        insertion = `\`\`\`\n${selectedText || 'code block'}\n\`\`\``;
        break;
      case '> ':
        insertion = '> ' + selectedText;
        break;
      case '- ':
        insertion = '- ' + selectedText;
        break;
      case '1. ':
        insertion = '1. ' + selectedText;
        break;
      case '[]()':
        insertion = selectedText ? `[${selectedText}]()` : '[link text](url)';
        break;
      case '![]()':
        insertion = '![alt text](image url)';
        break;
      default:
        insertion = selectedText;
    }

    content = content.substring(0, start) + insertion + content.substring(end);
    updateCounts();
  };

  const updateCounts = () => {
    const plainText = content.replace(/<[^>]*>/g, '');
    charCount = plainText.length;
    
    wordCount = plainText
      .trim()
      .split(/\s+/)
      .filter(word => word.length > 0)
      .length;
  };
  
  const publish = async () => {
    if (!title.trim() || !content.trim()) return;
    
    isPublishing = true;
    error = '';
    
    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        body: JSON.stringify({ title, content }),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to publish');
      }
      
      localStorage.removeItem('draft-title');
      localStorage.removeItem('draft-content');
      title = '';
      content = '';
      goto(`/${result.slug}`);
    } catch (e: any) {
      error = e.message;
      console.error('Failed to publish:', e);
    } finally {
      isPublishing = false;
    }
  };
  
  onMount(() => {
    if (browser) {
      title = localStorage.getItem('draft-title') || '';
      content = localStorage.getItem('draft-content') || '';
      updateCounts();
      
      const saveInterval = setInterval(() => {
        if (title || content) {
          localStorage.setItem('draft-title', title);
          localStorage.setItem('draft-content', content);
        }
      }, 1000);

      return () => clearInterval(saveInterval);
    }
  });

  $: content && updateCounts();
</script>

<svelte:head>
	<title>zsh.one - Simple Text Sharing</title>
	<meta name="description" content="A minimalist text sharing platform" />
	<meta property="og:title" content="zsh.one" />
	<meta property="og:description" content="A minimalist text sharing platform" />
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://zsh.one" />
	<meta property="og:site_name" content="zsh.one" />
	<meta name="twitter:card" content="summary" />
	<meta name="twitter:title" content="zsh.one - Simple Text Sharing" />
	<meta name="twitter:description" content="A minimalist text sharing platform" />
</svelte:head>

<div class="max-w-4xl mx-auto p-4">
  {#if error}
    <div class="mb-4 border border-red-500 p-4 text-red-500 font-mono">
      {error}
    </div>
  {/if}
  
  <div class="flex items-center justify-between mb-4">
    <div class="text-sm text-[#70A5B9]/80 font-mono">
      {wordCount} words | {charCount} characters
    </div>
    <button
      class="bg-[#70A5B9] hover:bg-[#70A5B9]/90 text-[#131313] px-6 py-2 font-mono font-bold disabled:opacity-50"
      on:click={publish}
      disabled={isPublishing || !content.trim() || !title.trim()}
    >
      {isPublishing ? 'Publishing...' : '[ Publish ]'}
    </button>
  </div>

  <input
    type="text"
    bind:value={title}
    class="w-full mb-4 bg-[#131313] text-[#70A5B9] p-4 border border-[#70A5B9]/20 focus:outline-none focus:border-[#70A5B9] text-2xl font-bold font-mono"
    placeholder="Enter your title..."
  />
  
  <Editor {content} onChange={(newContent) => content = newContent} />
</div>

<style>
  .tooltip {
    position: relative;
  }

  .tooltip-text {
    visibility: hidden;
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    background-color: #131313;
    color: #70A5B9;
    text-align: center;
    padding: 4px 8px;
    font-size: 12px;
    white-space: nowrap;
    opacity: 0;
    transition: opacity 0.2s;
    margin-bottom: 4px;
    border: 1px solid #70A5B9;
    font-family: monospace;
  }

  .tooltip:hover .tooltip-text {
    visibility: visible;
    opacity: 1;
  }
</style>
