import { Graph } from '../lib/graph.js';
import { PriorityQueue } from '../lib/priorityQueue.js';

// Create graph
let graph = new Graph(5, 20);
console.log(graph.vertices);
console.log('Start: ' + graph.start.name);
console.log('Goal: ' + graph.goal.name);

// Create queue with starter node
let pQueue = new PriorityQueue();
pQueue.enqueue(graph.start.name, 0);

// Create list of visited nodes
let visited = new Set();
let path = [];
let steps = [];
steps.push({ visited: [], frontier: { name: graph.start.name, weight: graph.start.name } });

// While queue isn't empty, visit node, add children to queue with weight of (parent + theirs )
while (!pQueue.isEmpty()) {
	// Visit node and update visited
	let curr = pQueue.dequeue();
	visited.add(curr.name);

	// Goal node has been found. Get path.
	if (curr.name == graph.goal.name) {
		curr = graph.getVertice(curr.name);
		path.push(curr.name);
		console.log('Goal found: ' + curr.name);
		while (curr.parent != undefined) {
			path.push(curr.parent);
			curr = graph.getVertice(curr.parent);
		}
		break;
	}

	let vertice = graph.getVertice(curr.name);
	console.log(vertice);

	// Add children
	for (var i = 0; i < vertice.edges.length; i++) {
		let edge = vertice.edges[i];
		let totalWeight;
		if (curr.name == graph.start.name)
			totalWeight = edge.weight + curr.weight + graph.getVertice(edge.name).heuristicCost;
		else
			totalWeight =
				edge.weight +
				curr.weight +
				graph.getVertice(edge.name).heuristicCost -
				graph.getVertice(curr.name).heuristicCost;

		// Node hasn't been visited
		if (!visited.has(edge.name)) {
			// Update weight if found
			let prevElement = pQueue.getElement(edge.name);
			if (prevElement) {
				if (prevElement.weight > totalWeight) prevElement.parent = curr.name;
			} else pQueue.enqueue(edge.name, totalWeight);
			graph.updateParent(edge.name, curr.name);
		}
	}

	// Copy visited and frontier into steps
	let visitedCopy = [];
	let frontierCopy = [];

	visited.forEach((node) => {
		visitedCopy.push(node);
	});
	for (var i = 0; i < pQueue.items.length; i++) {
		frontierCopy.push(pQueue.items[i]);
	}
	steps.push({ visited: visitedCopy, frontier: frontierCopy });
}

console.log('Graph after: ');
console.log(graph.vertices);
console.log('Path: ' + path);
console.log('Start: ' + graph.start.name);
console.log('Goal: ' + graph.goal.name);

console.log('Steps: ');
for (var i = 0; i < steps.length; i++) {
	console.log(steps[i]);
}
