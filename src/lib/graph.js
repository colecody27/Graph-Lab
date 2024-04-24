import {PriorityQueue} from '../lib/priorityQueue.js'


export class Graph {
    vertices = [];
    start;
    goal;

    constructor(size, maxCost) {
        this.size = size; 
        this.maxCost = maxCost;
        this.previousStart = null;
        this.previousGoal = null;

        // Create random vertices with unique name. Ex: A1 | B2 and location 
        let letter = 'A';
        let number = 1; 
        for (let i = 0; i < size; i++) {

            // Find available coordinates
            // let x, y; 
            // do{
            //     x = Math.floor(Math.random() * 200);
            //     y = Math.floor(Math.random() * 200);
            // } while (!this.isLocationClear(x, y))

            this.addVertice(new Vertice(letter+number, 0, 0));

            // Restart letter sequence and increment number
            if (letter == 'Z') {
                letter = 'A';
                number++;
            } else
                letter = String.fromCharCode(letter.charCodeAt(0) + 1); 
        }
        
        // Add random edge to random vertice 
        const maxEdges = size
        for (let i = 0; i < maxEdges; i++) {
            let vertice = this.vertices[i];
        
            let randomIndex = Math.floor(Math.random() * this.vertices.length);
            let randomEdge = this.vertices[randomIndex];
        
            // Check that the selected vertice is not the same and does not already have an edge to the randomEdge
            while (randomEdge === vertice || vertice.edgeNames.has(randomEdge.name)) {
                randomIndex = Math.floor(Math.random() * this.vertices.length);
                randomEdge = this.vertices[randomIndex];
            }
        
            const weight = Math.floor(Math.random() * maxCost);
            const verticeEdge = {name: randomEdge.name, weight: weight};
            vertice.addEdge(verticeEdge);
        
            // If the graph is undirected, add an edge back from randomEdge to vertice
            const edgeEdge = {name: vertice.name, weight: weight};
            randomEdge.addEdge(edgeEdge);
        }
        


        // Set start node and goal node
        let randomIndx1;
        let randomIndx2;
        do {
            randomIndx1 = Math.floor(Math.random() * this.vertices.length);
            randomIndx2 = Math.floor(Math.random() * this.vertices.length);
        } while (randomIndx1 === randomIndx2);
        this.start = this.vertices[randomIndx1];
        this.goal = this.vertices[randomIndx2];

        this.vertices[randomIndx2].heuristicCost = 0; 
    

        // // For each node, calculate euclidean distance from the goal node 
        // for (var i = 0; i < this.vertices.length; i++) {
        //     let v = this.vertices[i]; 
        //     if (v.name == this.goal.name)
        //         continue;
        //     v.heuristicCost = Number(Math.sqrt(( (Math.abs(v.x - this.goal.x))**2 + (Math.abs(v.y - this.goal.y)**2))).toFixed(2));
        // }
        

    }
    
    setStartNode(vertex) {
        this.start = vertex;
        console.log(`Start node set to: ${vertex.name}`);
    }

    setGoalNode(vertex) {
        this.previousGoal = vertex;
        this.goal = vertex;
        console.log(`Goal node set to: ${vertex.name}`);
    }
    addVertice(vertice) {
        // Check if a vertex with the same name already exists in the array
        if (this.vertices.some(v => v.name === vertice.name)) {
            console.error("Vertex with name already exists:", vertice.name);
            return;
        }
        this.vertices.push(vertice);
    }
    

    getVertice(name) {
        // Use find to retrieve the vertex by name
        const vertex = this.vertices.find(v => v.name === name);
        if (!vertex) {
            console.error("Vertex not found for name:", name);
            return null;
        }
        return vertex;
    }
    

    updateParent(childName, parentName) {
        if (childName === parentName) {
            console.error("Attempted to set self as parent for node:", childName);
            return; // Prevent self-referencing which can lead to cycles
        }
    
        let current = parentName;
        while (current) {
            let currentNode = this.getVertice(current);
            if (currentNode.name === childName) {
                console.error("Cycle detected: cannot set", parentName, "as parent of", childName);
                return; // Prevent cycle by not updating the parent
            }
            current = currentNode.parent; // Move to the next parent
        }
    
        let childVertex = this.getVertice(childName);
        if (childVertex) {
            childVertex.parent = parentName;
            console.log(`Updated parent of ${childName} to ${parentName}`);
        } else {
            console.error("Vertex not found for name:", childName);
        }
    }
    resetVertices() {
        this.vertices.forEach(vertex => {
            vertex.parent = undefined;  
            vertex.visited = false;     
        });
    }
        
    
    

    isLocationClear(x, y) {
        return !this.vertices.some(v => Math.sqrt((v.x - x) ** 2 + (v.y - y) ** 2) < 5);
    }
    

    aStar() {
        this.resetVertices(); 
        let pQueue = new PriorityQueue();
        pQueue.enqueue(this.start.name, 0);
    
        let visited = new Set();
        let path = [];
        let steps = [];
        steps.push({visited: [], frontier: [`${this.start.name}(${this.start.heuristicCost}) `]});
    
        // While queue isn't empty, process nodes
        while (!pQueue.isEmpty()) {
            let curr = pQueue.dequeue(); 
            visited.add(curr.name); 
    
            // Check if the goal node has been found
            if (curr.name == this.goal.name) {
                let pathNode = this.getVertice(curr.name);
                const visitedPathNodes = new Set(); // To detect cycles in path reconstruction
                
                while (pathNode) {
                    if (visitedPathNodes.has(pathNode.name)) {
                        console.error("Detected a cycle in the path at node:", pathNode.name);
                        break; 
                    }
                    visitedPathNodes.add(pathNode.name);
                    path.push(pathNode.name);
                    
                    if (!pathNode.parent) break; // Properly end if no parent is defined
                    pathNode = this.getVertice(pathNode.parent);
                }
                path.reverse();  
                break;  
            }
    
            let currentVertice = this.getVertice(curr.name);
            currentVertice.edges.forEach(edge => {
                let neighbor = this.getVertice(edge.name);
                let totalWeight = edge.weight + curr.weight + neighbor.heuristicCost - (curr.name === this.start.name ? 0 : currentVertice.heuristicCost);

                // Node hasn't been visited or found a cheaper path to an already queued node
                let prevElement = pQueue.getElement(edge.name);
                if (!visited.has(neighbor.name)) {
                    if (prevElement && prevElement.weight > totalWeight) {
                        // Found a cheaper path to a node already in the queue
                        prevElement.weight = totalWeight;
                        prevElement.parent = curr.name;  // Update parent since a better path is found
                    } else if (!prevElement) {
                        // Node is not in the queue, enqueue it
                        pQueue.enqueue(neighbor.name, totalWeight);
                        this.updateParent(neighbor.name, curr.name);  
                    }
                }
            });


    
            // Record the current state of visited nodes and frontier
            let visitedCopy = Array.from(visited);
            let frontierCopy = pQueue.items.map(item => `${item.name}(${item.weight.toFixed(2)})`);
            steps.push({visited: visitedCopy, frontier: frontierCopy}); 
        }
    
        return {steps: steps, path: path};
    }
    
    



    bfs() {
        let queue = [this.start]; // Initialize with start node
        let visited = new Set();
        let steps = [];
        let path = [];
    
        steps.push({visited: [], frontier: [this.start.name]});
    
        while (queue.length > 0) {
            let curr = queue.shift(); // Dequeue the first element
            if (!visited.has(curr.name)) { // Check if it has not been visited
                visited.add(curr.name); // Mark it as visited
                path.push(curr.name);
    
                curr.edges.forEach((edge) => {
                    let neighbor = this.vertices.find(v => v.name === edge.name);
                    if (neighbor && !visited.has(neighbor.name) && !queue.some(v => v.name === neighbor.name)) {
                        queue.push(neighbor);
                    }
                });
    
                // Copy values into step
                let visitedCopy = Array.from(visited);
                let frontierCopy = queue.map((item) => item.name);
                steps.push({visited: visitedCopy, frontier: frontierCopy});
            }
        }
    
        return {steps: steps, path: path};
    }
    

dfs() {
    let stack = [this.start];
    let visited = new Set();
    let steps = [{visited: [], frontier: [this.start.name]}];
    let path = [];

    while (stack.length > 0) {
        let curr = stack.pop();
        if (visited.has(curr.name)) continue;

        visited.add(curr.name);
        path.push(curr.name);
        curr.edges.forEach(edge => {
            let neighbor = this.vertices.find(v => v.name === edge.name);
            if (neighbor && !visited.has(neighbor.name) && !stack.includes(neighbor)) {
                stack.push(neighbor);
            }
        });

        let visitedCopy = Array.from(visited);
        let frontierCopy = stack.map(item => item.name);
        steps.push({visited: visitedCopy, frontier: frontierCopy});
    }
    return {steps: steps, path: path};
}

}

export class Vertice {
    name;
    edgeNames = new Set([]);
    edges = [];


    constructor(name, x, y) {
        this.name = name; 
        this.heuristicCost = 0.0; 
        this.parent = undefined;
        this.x = x;
        this.y = y; 
    }

    addEdge(edge) {
        this.edges.push(edge);
        this.edgeNames.add(edge.name);
    }

    getEdgeNames() {
        let edgeNames = new Set([]); 
        for (var i = 0; i < edges.length; i++) {
            edgeNames.add(edges[i].name); 
        }
        return edgeNames; 
    }
}



// Driver
let graph = new Graph(6, 20);
for (var i = 0; i < graph.vertices.length; i++) {
    console.log(graph.vertices[i]);
}
console.log("Start: " + graph.start.name)
console.log("Goal: " + graph.goal.name)

// A*
// let result = graph.aStar(); 
// console.log("Steps: "); 
// for (var i = 0; i < result.steps.length; i++) {
//     console.log(result.steps[i]);
// }
// console.log("Path: " + result.path); 

// BFS 
// let steps = graph.bfs(); 
// console.log("Steps: "); 
// for (var i = 0; i < steps.length; i++) {
//     console.log(steps[i]);
// }

// DFS 
let steps = graph.dfs(); 
console.log("Steps: "); 
for (var i = 0; i < steps.length; i++) {
    console.log(steps[i]);
}