import {Graph} from '../lib/graph.js'
import {PriorityQueue} from '../lib/priorityQueue.js'

// Create graph 
let graph = new Graph(5, 20);
console.log(graph.vertices);
console.log("Start: " + graph.start.name)
console.log("Goal: " + graph.goal.name)

// Create queue with starter node
let pQueue = new PriorityQueue();
pQueue.enqueue(graph.start.name, 0);

// Create list of visited nodes 
let visited = new Set();

// While queue isn't empty, visit node, add children to queue with weight of (parent + theirs )
while (!pQueue.isEmpty()) {
    // Visit node and update visited
    let curr = pQueue.dequeue(); 
    visited.add(curr.name); 

    // Goal node has been found
    if (curr.name == graph.goal.name) {
        console.log("Goal found: " + curr.name); 
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
            totalWeight = edge.weight + curr.weight + graph.getVertice(edge.name).heuristicCost - graph.getVertice(curr.name).heuristicCost;

        if (!visited.has(edge.name)) {
            // Update weight if found and current weight is less than previous
            let prevElement = pQueue.getElement(edge.name)
            if (prevElement){
                if (prevElement.weight > totalWeight)
                    pQueue.updateWeight(edge.name, totalWeight); 
            } else
                pQueue.enqueue(edge.name, totalWeight); 
        }
    }
    console.log(pQueue)
}
