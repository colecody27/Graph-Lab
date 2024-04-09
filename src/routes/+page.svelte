<script>
  import { onMount } from 'svelte';
  import { Graph } from '$lib/graph.js';
  import { Table, tableMapperValues } from '@skeletonlabs/skeleton';

  let canvas;
  let graph;
  let scale = 3;
  let heuristicTable; 
  let dfsTable, bfsTable, aStarTable; 
  let traversal = 'b';
  
  onMount(() => {
    graph = new Graph(5, 20);

    // Log vertices 
    console.log("Start: " + graph.start.name)
    console.log("Goal: " + graph.goal.name)
    for (var i = 0; i < graph.vertices.length; i++) {
      console.log(graph.vertices[i]);
    }

    // Get steps from algorithms
    let dfsSteps = graph.dfs();
    let bfsSteps = graph.bfs();
    let aStarResult = graph.aStar();
    let aStarSteps = aStarResult.steps;
    let aStarPath = aStarResult.path;

    drawGraph();

    heuristicTable = {
      // A list of heading labels.
      head: ['Vertice', 'Cost'],
      // The data visibly shown in your table body UI.
      body: tableMapperValues(graph.vertices, ['name', 'heuristicCost']),
      // Optional: The data returned when interactive is enabled and a row is clicked.
      // meta: tableMapperValues(sourceData, ['position', 'name', 'symbol', 'weight']),
    };

    dfsTable = {
      // A list of heading labels.
      head: ['Visited', 'Frontier'],
      // The data visibly shown in your table body UI.
      body: tableMapperValues(dfsSteps, ['visited', 'frontier']),
      // Optional: The data returned when interactive is enabled and a row is clicked.
      // meta: tableMapperValues(sourceData, ['position', 'name', 'symbol', 'weight']),
    };

    bfsTable = {
      // A list of heading labels.
      head: ['Visited', 'Frontier'],
      // The data visibly shown in your table body UI.
      body: tableMapperValues(bfsSteps, ['visited', 'frontier']),
      // Optional: The data returned when interactive is enabled and a row is clicked.
      // meta: tableMapperValues(sourceData, ['position', 'name', 'symbol', 'weight']),
    };

    aStarTable = {
      // A list of heading labels.
      head: ['Visited', 'Frontier'],
      // The data visibly shown in your table body UI.
      body: tableMapperValues(aStarSteps, ['visited', 'frontier']),
      // Optional: The data returned when interactive is enabled and a row is clicked.
      // meta: tableMapperValues(sourceData, ['position', 'name', 'symbol', 'weight']),
    };
  });

  function drawGraph() {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const scaleX = canvas.width / 200; 
    const scaleY = canvas.height / 200; 

    // Draw edges
    graph.vertices.forEach(vertex => {
      vertex.edges.forEach(edge => {
        let target = graph.getVertice(edge.name);
        if (target) {
          ctx.beginPath();
          ctx.moveTo(vertex.x * scaleX, vertex.y * scaleY);
          ctx.lineTo(target.x * scaleX, target.y * scaleY);
          ctx.strokeStyle = "white";
          ctx.fillStyle = "white";
          ctx.stroke();
        }
      });
    });

    // Draw vertices  
    graph.vertices.forEach(vertex => {
      ctx.beginPath();
      ctx.arc(vertex.x * scaleX, vertex.y * scaleY, 5, 0, 2 * Math.PI);
      ctx.fill();
      // Optionally adjust text positioning and scaling
      ctx.fillText(vertex.name, vertex.x * scaleX, (vertex.y * scaleY) - 10);
    });

}
</script>

<header>
  <h1>Graphizer</h1>
</header>


<!-- Canvas -->
<!-- <div class='grid grid-cols-3' >
  <div class="col-span-2 " id='cc'>
    <canvas class='h-full w-full' bind:this={canvas} ></canvas>
  </div>


  {#if heuristicTable && traversal === 'a'}
    <div class=''>
      <Table class='rounded-xl ' source={heuristicTable} />  
    </div>
  {/if}
</div> -->


<!-- Canvas -->
<div class='canvas-container' id="container">
  <canvas class='mb-10' width="800" height="400" bind:this={canvas} ></canvas>
</div>


<div class='grid grid-cols-2 gap-8 m-5'>
  <!-- Heuristic Table -->
  {#if heuristicTable && traversal === 'a'}
      <div class=''>
        <h2 class='h2 text-center '>Heuristic Costs</h2>
        <Table class='rounded-xl ' source={heuristicTable} />  
      </div>
  {/if}

  <!-- Work shown table -->
  <div>
    <h2 class='h2 text-center '>Iterations</h2>
    {#if aStarTable}
      {#if traversal === 'a'}
        <Table class='rounded-xl ' source={aStarTable} />  
      {:else if traversal === 'b'}
        <Table class='rounded-xl ' source={bfsTable} />  
      {:else}
        <Table class='rounded-xl ' source={dfsTable} />  
    {/if}
  {/if}
  </div>

</div>




<style>
  header {
    text-align: center;
    padding: 1rem;
    background-color: #0000;
    margin-bottom: 2rem;
	font-size: 2em
  }

.canvas-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: auto;
}

canvas {
  border: 2px solid #ccc; 
  
}


  .table {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    width: 30%; 
    margin: auto; 
  }

  .row.header {
    background-color: #0000;
  }

  .cell {
    border: 1px solid black;
    padding: 4px;
    font-size: 12px; 
  }

  .row:not(:last-child) .cell {
    border-bottom: none;
  }

</style>

