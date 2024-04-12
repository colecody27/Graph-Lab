<script>
  import cytoscape from 'cytoscape';
  import { onMount } from 'svelte';
  import { Graph, Vertice } from '$lib/graph.js'; 
  import { Table, tableMapperValues, RangeSlider } from '@skeletonlabs/skeleton';

  let numberOfVertices = 20;
  let cost = 20;
  
  let selectedAlgorithm = '0';


  let heuristicTable; 
  let dfsTable, bfsTable, aStarTable; 
  let traversal = '';
  let maxNumberOfVertices = 50; 

  let maxCost = 50; 
  let startNode = null;
  let goalNode = null;
  let startName = '';
  let goalName = '';

  let visualize = false;
  let cy;
  let graph = new Graph(numberOfVertices, cost); // Adjust the size and maxCost as needed

  function startVisualization() {
    visualize = true;
}



function updateNodeColor(nodeName, nodeType) {
    let vertex = graph.getVertice(nodeName.toUpperCase());
    if (vertex) {
        const nodeColor = nodeType === 'start' ? 'darkblue' : 'yellow';
        vertex.color = nodeColor; 

        if (nodeType === 'start') {
            startNode = vertex;
            graph.setStartNode(startNode);
        } else if (nodeType === 'goal') {
            goalNode = vertex;
            graph.setGoalNode(goalNode);
        }
        updateGraphVisuals(vertex.name, nodeColor); // Update graph visuals for just the changed node
    } else {
        alert('Node not found. Please enter a valid node name.');
    }
}

function updateGraphVisuals(nodeId, color) {
    let node = cy.getElementById(nodeId);
    if (node) {
        node.style({'background-color': color});
    }
}

  function prepareElements(graph) {
    let elements = [];
    let edgeSet = new Set();  // Use a set to track unique edges

    graph.vertices.forEach(vertex => {
        elements.push({
            data: {
                id: vertex.name,
                label: vertex.name
            },
            position: {
                x: vertex.x,
                y: vertex.y
            }
        });

        vertex.edges.forEach(edge => {
            let edgeId = `${vertex.name}-${edge.name}`;
            if (!edgeSet.has(edgeId) && vertex.name !== edge.name) {  // Prevent self-loops and duplicate edges
                elements.push({
                    data: {
                        id: edgeId,
                        source: vertex.name,
                        target: edge.name,
                        label: `${edge.weight}`
                    }
                });
                edgeSet.add(edgeId);
                edgeSet.add(`${edge.name}-${vertex.name}`);  // Add reverse direction for undirected graphs
            }
        });
    });

    return elements;
}



  $: if (selectedAlgorithm !== '0') {
      switch (selectedAlgorithm) {
        case '1': executeAStar(); break;
        case '2': executeBFS(); break;
        case '3': executeDFS(); break;
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
      const elements = prepareElements(graph);
      cy = cytoscape({
          container: document.getElementById('cy'),
          elements: elements,
          style: [
              {
                  selector: 'node',
                  style: {
                      'background-color': '#666',
                      'label': 'data(label)',
                      'text-valign': 'center',
                      'color': 'white',
                      'text-outline-width': 2,
                      'text-outline-color': '#888'
                  }
              },
              {
                  selector: 'edge',
                  style: {
                      'width': 3,
                      'line-color': '#ccc',
                      'curve-style': 'bezier',
                      'label': 'data(label)'
                  }
              }
          ],
          layout: {
              name: 'cose', // Automatic layout for evenly spacing nodes
              idealEdgeLength: 100,
              nodeOverlap: 10,
              animate: true,
              padding: 10,  

          }
      });
  });
</script>

<!-- Title and Header -->
<header>
  <h1>Graphizer</h1>
</header>

<!-- Control Panel for Graph Configuration -->
<div class='flex justify-center space-x-20'>
  <div class='flex'>
    <!-- Algorithm Selection -->
    <select class="select rounded-md" bind:value="{selectedAlgorithm}">
      <option value="0">None</option>
      <option value="1">A*</option>
      <option value="2">BFS</option>
      <option value="3">DFS</option>
    </select>
  </div>

  <div class='flex'>
    <!-- Vertex Count Slider -->
    <RangeSlider name="vertex-slider" bind:value={numberOfVertices} max={50} step={1} ticked>
      <div class="flex justify-between items-center">
        <div class="font-bold">Vertices</div>
        <div class="text-xs">{numberOfVertices} / {maxNumberOfVertices}</div>
      </div>
    </RangeSlider>
  </div>

  <div class='flex'>
    <!-- Cost Range Slider -->
    <RangeSlider name="cost-slider" bind:value={cost} max={50} step={1} ticked>
      <div class="flex justify-between items-center">
        <div class="font-bold">Max Cost</div>
        <div class="text-xs">{cost} / {maxCost}</div>
      </div>
    </RangeSlider>
  </div>
</div>

<!-- Randomize Button -->
<div class='flex justify-center mt-5 mb-10'>
  <button type="button" class="btn variant-filled-secondary rounded-md">Randomize</button>
</div>

<div class='flex justify-center mt-5 mb-10'>
  <input type="text" placeholder="Start node ex(A1, B1, C1)" bind:value={startName} class="input-text">
  <button type="button" class="btn variant-filled-secondary rounded-md" on:click={() => updateNodeColor(startName, 'start')}>Enter</button>
</div>

<div class='flex justify-center mt-5 mb-10'>
  <input type="text" placeholder="Goal node ex(B1, B2, C1)" bind:value={goalName} class="input-text">
  <button type="button" class="btn variant-filled-secondary rounded-md" on:click={() => updateNodeColor(goalName, 'goal')}>Enter</button>
</div>

<div class='flex justify-center mt-5 mb-10'>
  <button type="button" class="btn variant-filled-secondary rounded-md" on:click={startVisualization()}>Visualize</button>
</div>

<!-- Graph Container -->
<div class="graph-container">
  <div id="cy"></div>
</div>

<div class='grid grid-cols-2 gap-5 m-5'>
  <!-- Heuristic Table -->
  {#if heuristicTable && traversal === 'a'}
      <div class=''>
        <h2 class='h2 text-center '>Heuristic Costs</h2>
        <Table class='rounded-xl ' source={heuristicTable} />  
      </div>
  {/if}
  <!-- Work shown table -->
  <div>
    
    {#if aStarTable && visualize == true}
    <h2 class='h2 text-center '>Iterations</h2>
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
    font-size: 2em;
}

.graph-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: hwb(219 32% 17%);
}

#cy {
    width: 800px;
    height: 600px;
    border: 5px solid #190202;
    background-color: hsla(17, 85%, 38%, 0.244);
    margin-left: 100px;
}


.input-text {
  color: black;
  background-color: white;
  font-weight: bold;
}
</style>
