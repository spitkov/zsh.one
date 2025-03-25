<script lang="ts">
  import { marked } from 'marked';
  import xss from 'xss';
  import { browser } from '$app/environment';
  
  export let data;
  
  let renderedContent = '';
  let description = '';
  
  function getDescription(content: string): string {
    const plainText = content
      .replace(/<[^>]*>/g, '')
      .replace(/[#*_`~\[\]]/g, '')
      .replace(/\n+/g, ' ')
      .trim();
    
    return plainText.length > 100 
      ? plainText.substring(0, 100) + '...'
      : plainText;
  }
  
  async function renderContent() {
    if (data.post.content) {
      const markedContent = await marked(data.post.content);
      renderedContent = xss(markedContent, {
        whiteList: {
          p: [],
          h1: [], h2: [], h3: [], h4: [], h5: [], h6: [],
          ul: [], ol: [], li: [],
          a: ['href', 'title'],
          code: [],
          pre: [],
          blockquote: [],
          strong: [], em: [], del: [], ins: [],
          img: ['src', 'alt', 'title'],
          table: [], thead: [], tbody: [], tr: [], th: [], td: []
        }
      });
      description = getDescription(data.post.content);
    }
  }
  
  $: if (data.post.content) {
    renderContent();
  }
</script>

<svelte:head>
  <title>{data.post.title} - zsh.one</title>
  <meta name="description" content={description} />
  <meta property="og:title" content={data.post.title} />
  <meta property="og:description" content={description} />
  <meta property="og:type" content="article" />
  <meta property="og:url" content={`https://zsh.one/${data.post.slug}`} />
  <meta property="og:site_name" content="zsh.one" />
  <meta name="twitter:card" content="summary" />
  <meta name="twitter:title" content={data.post.title} />
  <meta name="twitter:description" content={description} />
</svelte:head>

<div class="max-w-4xl mx-auto p-4">
  <article class="bg-[#131313] border border-[#70A5B9]/20 p-8">
    <header class="mb-8">
      <h1 class="text-4xl font-bold mb-4">{data.post.title}</h1>
      <time class="text-[#70A5B9]/80" datetime={data.post.created_at}>
        {new Date(data.post.created_at).toLocaleDateString()}
      </time>
    </header>
    
    <div class="prose prose-invert max-w-none prose-pre:bg-[#70A5B9]/10 prose-pre:font-mono">
      {@html renderedContent}
    </div>
  </article>
</div> 