<script>
  import { onMount } from 'svelte';
  import { Graph } from '$lib/graph.js';

  let canvas;
  let graph;
  let scale = 3;



  onMount(() => {
    graph = new Graph(5, 1);
    drawGraph();
  });

  function drawGraph() {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

	const scaleX = canvas.width / 200; 
    const scaleY = canvas.height / 200; 

    graph.vertices.forEach(vertex => {
      vertex.edges.forEach(edge => {
        let target = graph.getVertice(edge.name);
        if (target) {
          ctx.beginPath();
          ctx.moveTo(vertex.x * scaleX, vertex.y * scaleY);
          ctx.lineTo(target.x * scaleX, target.y * scaleY);
          ctx.stroke();
        }
      });
    });


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
  <h1>Algorithm Visualizer</h1>
</header>



  <div class="canvas-container">
  	<canvas bind:this={canvas} width="800" height="400"></canvas>
  </div>



<div class="table">
  <div class="row header">
    <div class="cell">Visited</div>
	<div class="cell">-</div>
  </div>
  <div class="row">
    <div class="cell">Frontier</div>
	<div class="cell">-</div>
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
  height: 100vh; 
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

