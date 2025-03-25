<script>
	import '../app.css';
	import { page } from '$app/stores';
	
	let { children } = $props();
</script>

<svelte:head>
	<title>zsh.one - Simple Text Sharing</title>
	<meta name="description" content="A minimalist, terminal-style text sharing platform" />
	<meta property="og:title" content="zsh.one - Simple Text Sharing" />
	<meta property="og:description" content="A minimalist, terminal-style text sharing platform" />
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://zsh.one" />
	<meta property="og:site_name" content="zsh.one" />
	<meta name="twitter:card" content="summary" />
	<meta name="twitter:title" content="zsh.one - Simple Text Sharing" />
	<meta name="twitter:description" content="A minimalist, terminal-style text sharing platform" />
</svelte:head>

<div class="min-h-screen bg-[#131313] text-[#70A5B9] font-mono">
	<nav class="border-b border-[#70A5B9]/20">
		<div class="max-w-4xl mx-auto px-4 py-3">
			<a href="/" class="text-xl font-bold hover:text-[#70A5B9]/80 transition-colors">
				zsh.one
			</a>
		</div>
	</nav>
	<slot />
</div>
