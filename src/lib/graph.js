import {PriorityQueue} from '../lib/priorityQueue.js'


export class Graph {
    vertices = [];
    start;
    goal;

    constructor(size, maxCost) {
        this.size = size; 
        this.maxCost = maxCost;

        // Create random vertices with unique name. Ex: A1 | B2 and location 
        let letter = 'A';
        let number = 1; 
        for (let i = 0; i < size; i++) {

            // Find available coordinates
            let x, y; 
            do{
                x = Math.floor(Math.random() * 200);
                y = Math.floor(Math.random() * 200);
            } while (!this.isLocationClear(x, y))

            this.addVertice(new Vertice(letter+number, x, y));

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
            this.start = this.vertices[randomIndx1];
            this.goal = this.vertices[randomIndx2];
        } while (randomIndx1 == randomIndx2)
        this.vertices[randomIndx2].heuristicCost = 0; 
    

        // For each node, calculate euclidean distance from the goal node 
        for (var i = 0; i < this.vertices.length; i++) {
            let v = this.vertices[i]; 
            if (v.name == this.goal.name)
                continue;
            v.heuristicCost = Number(Math.sqrt(( (Math.abs(v.x - this.goal.x))**2 + (Math.abs(v.y - this.goal.y)**2))).toFixed(2));
        }
        

    }
    
    setStartNode(nodeName) {
        let startVertex = this.getVertice(nodeName);
        if (startVertex) {
            this.start = startVertex;
            console.log(`Start node set to: ${nodeName}`);
        } 
    }

    setGoalNode(nodeName) {
        let goalVertex = this.getVertice(nodeName);
        if (goalVertex) {
            this.goal = goalVertex;
            console.log(`Start node set to: ${nodeName}`);
        } 
    }

    addVertice(Vertice) {
        this.vertices.push(Vertice);
    }

    getVertice(name) {
        return this.vertices.find((v) => {if (v.name === name) return v})
    }

    updateParent(name, parent) {
        for (var i = 0; i < this.vertices.length; i++) {
            let v = this.vertices[i]; 
            if (v.name == name)
                v.parent = parent;
        }
    }

    isLocationClear(x, y) {
        return !this.vertices.some(v => Math.sqrt((v.x - x) ** 2 + (v.y - y) ** 2) < 5);
    }
    

    aStar() {
        // Create queue with starter node
        let pQueue = new PriorityQueue();
        pQueue.enqueue(this.start.name, 0);

        // Create list of visited nodes 
        let visited = new Set();
        let path = [];
        let steps = [];
        steps.push({visited: [], frontier: [`${this.start.name}(${this.start.heuristicCost}) `]});

        // While queue isn't empty, visit node, add children to queue with weight of (parent + theirs )
        while (!pQueue.isEmpty()) {
            // Visit node and update visited
            let curr = pQueue.dequeue(); 
            visited.add(curr.name); 

            // Goal node has been found. Get path. 
            if (curr.name == this.goal.name) {
                curr = this.getVertice(curr.name); 
                path.push(curr.name);
                while (curr.parent != undefined) {
                    path.push(curr.parent);
                    curr = this.getVertice(curr.parent);
                }
                break;
            }

            let vertice = this.getVertice(curr.name);

            // Add children
            for (var i = 0; i < vertice.edges.length; i++) {
                let edge = vertice.edges[i]; 
                let totalWeight; 
                if (curr.name == this.start.name)
                    totalWeight = edge.weight + curr.weight + this.getVertice(edge.name).heuristicCost; 
                else
                    totalWeight = edge.weight + curr.weight + this.getVertice(edge.name).heuristicCost - this.getVertice(curr.name).heuristicCost;

                // Node hasn't been visited
                if (!visited.has(edge.name)) {
                    // Update weight if found 
                    let prevElement = pQueue.getElement(edge.name)
                    if (prevElement){
                        if (prevElement.weight > totalWeight) 
                            prevElement.parent = curr.name; 
                    } else
                    pQueue.enqueue(edge.name, totalWeight); 
                    this.updateParent(edge.name, curr.name); 
                }
            }
            // Copy visited and frontier into steps
            let visitedCopy = [];
            let frontierCopy = pQueue.items.map((item) => ` ${item.name}(${(item.weight).toFixed(2)})`); 

            visited.forEach((node) => {
                visitedCopy.push(node);
            })
            steps.push({visited: visitedCopy, frontier: frontierCopy}); 
        }
            // Copy visited and frontier into steps
            let visitedCopy = [];
            let frontierCopy = pQueue.items.map((item) => ` ${item.name}(${(item.weight).toFixed(2)})`); 

            visited.forEach((node) => {
                visitedCopy.push(node);
            })
            steps.push({visited: visitedCopy, frontier: frontierCopy}); 
        return {steps: steps, path: path};
    }

    bfs() {
        let queue = [];
        let visited = new Set();
        let steps = []; 

        // Start BFS at start vertice
        queue.push(this.start); 
        steps.push({visited: [], frontier: [this.start.name]}); 
        while(queue.length > 0) {
            let curr = queue.shift();
            visited.add(curr.name);

            curr.edgeNames.forEach((edgeName) => {
                if (!queue.includes((v) => {v.name === edgeName}) && !visited.has(edgeName)) {
                    queue.push(this.vertices.find((v) => {if (v.name === edgeName) return v}));
                }
            })
            
            // Copy values into step
            let visitedCopy = [];
            let frontierCopy = queue.map((item) => ` ${item.name}`); 
            visited.forEach((node) => {
                visitedCopy.push(` ${node}`);
            })
            steps.push({visited: visitedCopy, frontier: frontierCopy}); 
        }
        return steps;
    }

    dfs() {
        let stack = []; 
        let visited = new Set(); 
        let steps = []; 

        stack.push(this.start)
        steps.push({visited: [], frontier: [this.start.name]}); 
        while (stack.length > 0) {
            let curr = stack.pop()
            visited.add(curr.name)

            curr.edgeNames.forEach((edgeName) => {
                let vertex = graph.vertices.find((v) => v.name === edgeName)
                if ( vertex && !stack.some((v) => v.name === edgeName) && !visited.has(edgeName)) {
                    stack.push(vertex);
                }
            })

            // Copy values into step
            let visitedCopy = [];
            let frontierCopy = stack.map((item) => ` ${item.name}`); 

            visited.forEach((node) => {
                visitedCopy.push(` ${node}`);
            })
            steps.push({visited: visitedCopy, frontier: frontierCopy}); 
        }
        return steps; 
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