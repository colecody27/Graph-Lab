<script>
	import cytoscape from 'cytoscape';
	import { writable } from 'svelte/store';
	import { onMount } from 'svelte';
	import { Graph, Vertice } from '$lib/graph.js';
	import { Table, tableMapperValues, RangeSlider } from '@skeletonlabs/skeleton';

	let selectedAlgorithm = '1';
	let heuristicTable;
	let dfsTable, bfsTable, aStarTable;
	let traversal = '';
  	let loaded = false;

	let numberOfVertices = 20;
	let cost = 40;
	let maxCost = 50;
	let maxNumberOfVertices = 50;

	let startName = '';
	let goalName = '';

	let visualize = false;
	let cy;
	$: graph = new Graph(numberOfVertices, cost);
	let shortestPath = writable('');

	function handleKeyDown(event, action) {
		if (event.key === 'Enter') {
			action();
		}
	}

	function submitStartNode() {
		updateNodeColor(startName, 'start');
	}

	function submitGoalNode() {
		updateNodeColor(goalName, 'goal');
	}

	function startVisualization() {
		clearHighlights();
		visualize = true;

		selectedAlgorithm !== '0' && executeSelectedAlgorithm();
	}

	function calculateHeuristics() {
		var goalPos = { x: graph.goal.x, y: graph.goal.y };
		for (var i = 0; i < graph.vertices.length; i++) {
			let v = graph.vertices[i];
			if (v.name == graph.goal.name) continue;
			v.heuristicCost = Number(
				Math.sqrt(Math.abs(v.x - goalPos['x']) ** 2 + Math.abs(v.y - goalPos['y']) ** 2).toFixed(2)
			);
		}
	}

	function setLocations() {
		// Iterate through visual and update locations for each vertice
		for (var i = 0; i < graph.vertices.length; i++) {
			var vertice = graph.vertices[i];
			var location = cy.$id(vertice.name).position();
			vertice.x = location['x'];
			vertice.y = location['y'];
		}
	}

	function executeSelectedAlgorithm() {
		switch (selectedAlgorithm) {
			case '1':
				executeAStar();
				break;
			case '2':
				executeBFS();
				break;
			case '3':
				executeDFS();
				break;
		}
	}

	function updateNodeColor(nodeName, nodeType) {
		let vertex = graph.getVertice(nodeName.toUpperCase());
		if (!vertex) {
			alert('Node not found. Please enter a valid node name.');
			return; // Stop the function if no vertex is found
		}
		const nodeColor = nodeType === 'start' ? 'green' : 'red';
		vertex.color = nodeColor;
		const node = cy.getElementById(vertex.name);
		if (nodeType === 'start') {
			node.addClass('start'); 
			node.removeClass('goal');
			if (graph.previousStart) {
				updateGraphVisuals(graph.previousStart.name, '#666');
			}
			graph.previousStart = vertex;
			graph.setStartNode(vertex);
		} else if (nodeType === 'goal') {
			node.addClass('goal');
			node.removeClass('start'); 
			if (graph.previousGoal) {
				updateGraphVisuals(graph.previousGoal.name, '#666');
			}
			graph.previousGoal = vertex;
			graph.setGoalNode(vertex);
		}
		updateGraphVisuals(vertex.name, nodeColor);
	}

	function updateGraphVisuals(nodeId, color) {
		let node = cy.getElementById(nodeId);
		if (node) {
			node.style({ 'background-color': color });
		}
	}

  function randomize() {
    numberOfVertices = Math.floor(Math.random() * maxNumberOfVertices)
    cost = Math.floor(Math.random() * maxCost)
    graph = new Graph(numberOfVertices, cost);
    updateCy()
  }

	function executeAStar() {
		let aStarResult = graph.aStar();
		let aStarSteps = aStarResult.steps;
		let aStarPath = aStarResult.path.join(' -> ');
		traversal = 'a';

		aStarTable = {
			head: ['Visited', 'Frontier'],
			body: tableMapperValues(aStarSteps, ['visited', 'frontier'])
		};
		heuristicTable = {
			head: ['Vertice', 'Cost'],
			body: tableMapperValues(graph.vertices, ['name', 'heuristicCost'])
		};
		let finalVisitedNodes = [...new Set(aStarSteps.flatMap((step) => step.visited))];
		highlightVisitedNodes(finalVisitedNodes);
		shortestPath.set(aStarPath);

	}

	function executeBFS() {
		let bfsResult = graph.bfs();
		let bfsSteps = bfsResult.steps;
		let bfsPath = bfsResult.path.join(' -> ');
		traversal = 'b';

		bfsTable = {
			head: ['Visited', 'Frontier'],
			body: tableMapperValues(bfsSteps, ['visited', 'frontier'])
		};

		let finalVisitedNodes = [...new Set(bfsSteps.flatMap((step) => step.visited))];
		highlightVisitedNodes(finalVisitedNodes, () => {
			shortestPath.set(bfsPath); 
		});

	}

	function executeDFS() {
		let dfsResult = graph.dfs();
		let dfsSteps = dfsResult.steps;
		let dfsPath = dfsResult.path.join(' -> ');
		traversal = 'd';

		dfsTable = {
			head: ['Visited', 'Frontier'],
			body: tableMapperValues(dfsSteps, ['visited', 'frontier'])
		};

		let finalVisitedNodes = [...new Set(dfsSteps.flatMap((step) => step.visited))];
		highlightVisitedNodes(finalVisitedNodes, () => {
			shortestPath.set(dfsPath);
		});
	}

	function clearHighlights() {
		cy.elements().removeClass('highlighted').animate({
			style: {
				'background-color': '#666', 
				'line-color': '#ccc',  
			},
		});
	}


	function highlightVisitedNodes(visitedNodes) {
    	visitedNodes.forEach((nodeName, index) => {
        	setTimeout(() => {
            	const node = cy.$id(nodeName);
            	if (node.length === 0) {
                	console.error('Node not found:', nodeName);
                	return;
            	}
            	node.animate({
                	style: {'background-color': 'yellow'},
                	duration: 700, 
                	easing: 'ease-in-out',
					'transition-duration': '200ms' 

            	});
            	node.connectedEdges().animate({
                	style: {'line-color': 'yellow', 'width': 7}, 
                	duration: 700,
                	easing: 'ease-in-out',
					'transition-duration': '200ms'
           		});
				 
				updateNodeColor(graph.start.name, 'start');
				updateNodeColor(graph.goal.name, 'goal');
       		}, index * 1000);
   		 });
	}



	//elements for the graph nodes and edges
	function prepareElements(graph) {
		let elements = [];
		let edgeSet = new Set(); // Use a set to track unique edges

		graph.vertices.forEach((vertex) => {
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

			vertex.edges.forEach((edge) => {
				let edgeId = `${vertex.name}-${edge.name}`;
				if (!edgeSet.has(edgeId) && vertex.name !== edge.name) {
					// Prevent self-loops and duplicate edges
					elements.push({
						data: {
							id: edgeId,
							source: vertex.name,
							target: edge.name,
							label: `${edge.weight}`
						}
					});
					edgeSet.add(edgeId);
					edgeSet.add(`${edge.name}-${vertex.name}`); // Add reverse direction for undirected graphs
				}
			});
		});

		/*on:keydown={(event) => handleKeyDown(event, submitStartNode )}*/
		return elements;
	}

  onMount(() => {updateCy()})

  function updateCy() {
    let elements = prepareElements(graph);
    cy = cytoscape({
			container: document.getElementById('cy'),
			elements: elements,
			style: [
				{
					selector: 'node',
					style: {
						'background-color': '#666',
						label: 'data(label)',
						'text-valign': 'center',
						color: 'white',
						'text-outline-width': 2,
						'text-outline-color': '#888'
					}
				},
				{
					selector: 'edge',
					style: {
						width: 5,
						'line-color': '#ccc',
						'text-outline-width': 2,
						'text-outline-color': '#fff',
						'curve-style': 'bezier',
						'font-size': 14,
						label: 'data(label)'
						
					}
				}
			],
			layout: {
				name: 'cose', //cose, circle, grid, random
				idealEdgeLength: 100,
				nodeOverlap: 80,
				animate: false,
				padding: 20,
				fit: true,
				randomize: false,
				/*boundingBox: {x1: 200, y1:100, x2: 800, y2: 500}*/
				
				
			},
			minZoom: 0.5
			
		});
    setLocations();
	calculateHeuristics();
	updateNodeColor(graph.start.name, 'start');
	updateNodeColor(graph.goal.name, 'goal');
	cy.center();


  }
  

</script>


<div class="main-container">
	<div class="graph-box">
		<header>
			<h1>Graphizer</h1>
		</header>
		<div id="cy" ></div>
	</div>

	<div class="control-panel">
		<!-- Algorithm Selection -->
		<div class="control-item">
			<div class="font-bold">Choose an Algorithm</div>
			<select id="algorithm-select" class="select rounded-md" bind:value={selectedAlgorithm}>
				<option value="1">A*</option>
				<option value="2">BFS</option>
				<option value="3">DFS</option>
			</select>
		</div>

		<!-- Node Range Slider -->
		<div class="control-item">
			<RangeSlider name="vertex-slider" on:change={() => updateCy()} bind:value={numberOfVertices} max={50} min={5} step={1} ticked>
				<div class="flex justify-between items-center">
					<div class="font-bold">Vertices</div>
					<div class="text-xs">{numberOfVertices} / {maxNumberOfVertices}</div>
				</div>
			</RangeSlider>
		</div>
	
		<!-- Cost Range Slider -->
		<div class="control-item">
			<RangeSlider name="cost-slider" on:change={() => updateCy()} bind:value={cost} max={50} step={1} ticked>
				<div class="flex justify-between items-center">
					<div class="font-bold">Max Cost</div>
					<div class="text-xs">{cost} / {maxCost}</div>
				</div>
			</RangeSlider>
		</div>
	
		<!-- Randomize -->
		<div class="control-item" >
			<button  type="button" on:click={()=>randomize()} class="btn variant-filled-secondary rounded-md">Randomize</button>
		</div>
		<!-- Node Configuration for Start Node -->
		<div class="control-item">
			<div class="font-bold">Enter Start Node</div>
			<div class="input-group">
				<input
					type="text"
					placeholder="Start node ex(A1, B1, C1)"
					bind:value={startName}
					class="input-text"
					on:keydown={(event) => handleKeyDown(event, submitStartNode)}
				/>
				<button
					type="button"
					class="btn variant-filled-secondary rounded-md"
					on:click={() => updateNodeColor(startName, 'start')}>Enter
				</button>
			</div>
		</div>
	
		<!-- Node Configuration for Goal Node -->
		<div class="control-item">
			<div class="font-bold">Enter Goal Node</div>
			<div class="input-group">
				<input
					type="text"
					placeholder="Goal node ex(B1,b1,C1)"
					bind:value={goalName}
					class="input-text"
					on:keydown={(event) => handleKeyDown(event, submitGoalNode)}
				/>
				<button
					type="button"
					class="btn variant-filled-secondary rounded-md"
					on:click={updateNodeColor(goalName, 'goal')}>Enter</button
				>
			</div>
		</div>
	
		<!-- Visualization Control Buttons -->
		<div class= "control-item">
			<button
				type="button"
				class="btn variant-filled-secondary rounded-md"
				on:click={startVisualization}>Start Visualization
			</button>
		</div>
		
	</div>
	<div class = "container-2">
		<!-- Display Shortest Path -->
		<div class= "info-bar">Start Node: {graph.start.name}</div>
		<div class= "info-bar">Goal Node:  {graph.goal.name}</div>
		<div class="info-bar">
			{#if selectedAlgorithm === '1'}
				Optimal Path: {$shortestPath}
			{/if}
		</div>


		
		<div class = "tables"> 
				<div class="grid grid-cols-2 gap-5 m-5">
					<!-- Heuristic Table -->
					{#if heuristicTable && traversal === 'a'}
						<div>
							<h2 class="h2 text-center">Heuristic Costs</h2>
							<Table class="rounded-xl" source={heuristicTable} />
						</div>
					{/if}
			
					<!-- Work Shown Table -->
					{#if aStarTable || bfsTable || dfsTable}
						<div>
							{#if traversal === 'a'}
								<div >
									<h2 class="h2 text-center">Iterations</h2>
									<Table class="rounded-xl " source={aStarTable} />
								</div>
							{:else if traversal === 'b'}
								<h2 class="h2 text-center">Iterations</h2>
								<Table class="rounded-xl " source={bfsTable} />
							{:else}
								<h2 class="h2 text-center">Iterations</h2>
								<Table class="rounded-xl" source={dfsTable} />
							{/if}
						</div>
					{/if}
				</div>
		
		</div>
			
	
	</div>
</div>

		





    

	





<style>
.main-container {
	display: flex;
	justify-content: space-between;
	flex-wrap: wrap;
	width:100%;
	padding: 20px;
	
}

#cy {
	border: 2px solid #ccc;
	min-width: 1100px; 
	min-height: 530px;
}

.control-panel {
	display: flex;
	flex-direction: column;
	min-width:300px;
	height: 100vh;
	justify-content: space-around;
	flex-shrink: 0;

}

.container-2 {
	display: flex;
	justify-content: space-between;
	justify-content: space-around;
	flex-direction: column;
	flex-wrap: wrap;
	align-content: space-between;
	
}
.tables {
	display: flex;
	width:100%;
}
.info-bar {
	font-weight: bold;
	font-size: large;
	
}

.input-group {
	display: flex;
	align-items: center;
	margin-top: 5px;
	gap: 5px;
	border-radius: 5px 0 0 5px;
}

.input-text {
	flex-grow: 1;
	padding: 10px;
	border: 1px solid #ccc;
	border-radius: 5px;
	margin-right: -1px; /* Adjust or remove if causing layout issues */
}

.btn {
	padding: 10px 20px;
	background-color: #007bff; /* Primary interaction color */
	color: white;
	border-radius: 4px;
	cursor: pointer;
}

select {
	width: 100%;
	padding: 10px;
	border: 1px solid #ccc;
	border-radius: 5px;
	background-color: white;
	box-shadow: none;
	appearance: none; /* Removes default styling */
}

header {
	text-align: center;
	padding: 2rem;
	margin-bottom: 1rem;
	font-size: 2em;
}

</style>