import {Graph} from '../lib/graph.js'

let graph = new Graph(7, 20);
let queue = [];
let visited = new Set();
let steps = []; 

// Start BFS at start vertice
queue.push(graph.start); 
steps.push({visited: [], frontier: [graph.start]}); 
while(queue.length > 0) {
    let curr = queue.shift();
    visited.add(curr.name);

    curr.edgeNames.forEach((edgeName) => {
        if (!queue.includes((v) => {v.name === edgeName}) && !visited.has(edgeName)) {
            queue.push(graph.vertices.find((v) => {if (v.name === edgeName) return v}));
        }
    })
    
    // Copy visited and frontier into steps
    let visitedCopy = [];
    let frontierCopy = []; 

    visited.forEach((node) => {
        visitedCopy.push(node);
    })
    for (var i = 0; i < queue.length; i++) {
        frontierCopy.push(queue[i]);
    }
    steps.push({visited: visitedCopy, frontier: frontierCopy}); 
}

for (var i = 0; i < graph.vertices.length; i++) {
    console.log(graph.vertices[i]);
}

console.log("Start: " + graph.start.name); 
console.log("Goal: " + graph.goal.name);

console.log("Steps: "); 
for (var i = 0; i < steps.length; i++) {
    console.log(steps[i]);
}
