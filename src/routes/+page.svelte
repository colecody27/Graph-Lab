<script>
  import { onMount } from 'svelte';
  import { Graph } from '$lib/graph.js';
  import { Table, tableMapperValues, RangeSlider } from '@skeletonlabs/skeleton';

  let canvas;
  let numberOfVertices = 6;
  let cost = 20;
  let graph = new Graph(numberOfVertices, cost);
  let selectedAlgorithm = '0';

  let scale = 3;
  let heuristicTable; 
  let dfsTable, bfsTable, aStarTable; 
  let traversal = '';
  let maxNumberOfVertices = 50; 

  let maxCost = 50; 
  let startNode = null;
  let goalNode = null;
  let startName = '';
  let goalName = '';

  let graph1;
  let visualize = false;




  
  function drawGraph() {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const NodeRadius = 15;
    const scaleX = canvas.width / 200; 
    const scaleY = canvas.height / 200; 
    const FontSize = 10;


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
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.beginPath();
      ctx.arc(vertex.x * scaleX, vertex.y * scaleY, NodeRadius, 0, 2 * Math.PI);
      ctx.fillStyle = vertex.color || "white";
      ctx.fill();
      ctx.fillStyle = "Black";
      ctx.font = `${FontSize}px Arial`;
      ctx.fillText(vertex.name, vertex.x * scaleX, vertex.y * scaleY + 2);
    });

}



function startVisualization() {
    visualize = true;
}


  $: if (visualize && selectedAlgorithm !== '0') {
    switch (selectedAlgorithm) {
      case '1': executeAStar(); break;
      case '2': executeBFS(); break;
      case '3': executeDFS(); break;
    }
  }

  function updateNodeColor(nodeName, nodeType) {
      let vertex = graph.getVertice(nodeName);
      if (vertex) {
          if (nodeType === 'start') {
              vertex.color = 'darkblue';
              startNode = vertex;
              graph.setStartNode(StartNode);
          } else if (nodeType === 'goal') {
              goalNode = vertex;
              vertex.color = 'yellow';
              graph.setGoalNode(goalNode);
           
          }
          drawGraph();
      } else {
          alert('Node not found. Please enter a valid node name.');
      }
  }


  function executeAStar() {
    let aStarResult = graph.aStar();
    let aStarSteps = aStarResult.steps;
    let aStarPath = aStarResult.path;
    traversal = 'a';
      aStarTable = {
        // A list of heading labels.
        head: ['Visited', 'Frontier'],
        // The data visibly shown in your table body UI.
        body: tableMapperValues(aStarSteps, ['visited', 'frontier']),
        // Optional: The data returned when interactive is enabled and a row is clicked.
        // meta: tableMapperValues(sourceData, ['position', 'name', 'symbol', 'weight']),
      };


    heuristicTable = {
      // A list of heading labels.
      head: ['Vertice', 'Cost'],
      // The data visibly shown in your table body UI.
      body: tableMapperValues(graph.vertices, ['name', 'heuristicCost']),
      // Optional: The data returned when interactive is enabled and a row is clicked.
      // meta: tableMapperValues(sourceData, ['position', 'name', 'symbol', 'weight']),
    }

  }



   function executeBFS()  {
    let bfsSteps = graph.bfs();
    traversal = 'b';

    
    bfsTable = {
      // A list of heading labels.
      head: ['Visited', 'Frontier'],
      // The data visibly shown in your table body UI.
      body: tableMapperValues(bfsSteps, ['visited', 'frontier']),
      // Optional: The data returned when interactive is enabled and a row is clicked.
      // meta: tableMapperValues(sourceData, ['position', 'name', 'symbol', 'weight']),
    };


  }


  function executeDFS() {
    let dfsSteps = graph.dfs();

    dfsTable = {
      // A list of heading labels.
      head: ['Visited', 'Frontier'],
      // The data visibly shown in your table body UI.
      body: tableMapperValues(dfsSteps, ['visited', 'frontier']),
      // Optional: The data returned when interactive is enabled and a row is clicked.
      // meta: tableMapperValues(sourceData, ['position', 'name', 'symbol', 'weight']),
    };

  }



  
  onMount(() => {
  if (visualize && selectedAlgorithm !== '0') {
    switch (selectedAlgorithm) {
      case '1': executeAStar(); break;
      case '2': executeBFS(); break;
      case '3': executeDFS(); break;
    }
  }
  
    drawGraph();




  });


</script>




<!-- Title -->
<header>
  <h1>Graphizer</h1>
</header>

<!-- Graph Parameters -->
<div class='flex justify-center space-x-20'>
  <div class='flex'>
    <select class="select rounded-md" bind:value="{selectedAlgorithm}">
      <option value="0">None</option>
      <option value="1">A*</option>
      <option value="2">BFS</option>
      <option value="3">DFS</option>
    </select>
  </div>

  <div class='flex '>
    <RangeSlider name="range-slider" bind:value={numberOfVertices} max={50} step={1} ticked>
      <div class="flex justify-between items-center">
        <div class="font-bold">Vertices</div>
        <div class="text-xs">{numberOfVertices} / {maxNumberOfVertices}</div>
      </div>
    </RangeSlider>
  </div>

  <div class='flex'>
    <RangeSlider name="range-slider" bind:value={cost} max={50} step={1} ticked>
      <div class="flex justify-between items-center">
        <div class="font-bold">Max Cost</div>
        <div class="text-xs">{cost} / {maxCost}</div>
      </div>
    </RangeSlider>
  </div>
  

</div>

<div class='flex justify-center mt-5 mb-10'>
  <button type="button" class="btn variant-filled-secondary rounded-md">Randomize</button>
</div>

<div  class='flex justify-center mt-5 mb-10'>
  <input type="text" placeholder="Start node ex(A1,b1,C1)" bind:value="{startName}" class="input-text">
   <button type="button" class="btn variant-filled-secondary rounded-md" on:click={updateNodeColor(startName, 'start')}>Enter</button>

</div>

<div  class='flex justify-center mt-5 mb-10'>
  <input type="text" placeholder="Goal node ex(B1,b1,C1)" bind:value="{goalName}" class="input-text">
   <button type="button" class="btn variant-filled-secondary rounded-md" on:click={updateNodeColor(goalName, 'goal')}>Enter</button>
</div>

<div class='flex justify-center mt-5 mb-10'>
  <button type="button" class="btn variant-filled-secondary rounded-md" on:click={startVisualization()}>Visualize</button>
</div>


<!-- Display start and goal node names -->
<div>
  <p>Start Node: {startName || 'None selected'}</p>
  <p>Goal Node: {goalName || 'None selected'}</p>
</div>





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
    {#if aStarTable && visualize === true}
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

.input-text {
  color: black;
  background-color: white;
  font-weight: bold;


}


</style>

