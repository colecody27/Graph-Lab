<script>
	import {Graph} from '$lib/graph.js'

	let graph = new Graph(5, 20); 
	let x = 100; 
	let y = graph.vertices[0].y;
	console.log(y)
	// let fg = `${y}px`
</script>

<div class = 'relative bg-white h-screen w-screen' >
	{#each graph.vertices as v}
		<div class = 'h-10 w-10 bg-black absolute bottom-[{y}px] left-[{x}px]'> {v.name}</div>
	{/each}
</div>