<script>
	import '../app.css';
	import { page } from '$app/stores';
	
	let { children } = $props();
</script>



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
