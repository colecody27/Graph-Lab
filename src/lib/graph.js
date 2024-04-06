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
        for (var i = 0; i < size; i++) {

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
        for (var i = 0; i < maxEdges; i++) {
            // Select vertice
            let vertice = this.vertices[i];

            // Select random edge from list of vertices
            let randomIndx = Math.floor(Math.random() * this.vertices.length);
            let randomEdge = this.vertices[randomIndx];

            // Verify different indexes are selected
            while (randomEdge.name === vertice.name || vertice.edgeNames.has(randomEdge.name)) {
                randomIndx = Math.floor(Math.random() * this.vertices.length);
                randomEdge = this.vertices[randomIndx];
            }

            // Add edge to vertice
            const weight = Math.floor(Math.random() * maxCost); 
            const verticeEdge = {name: randomEdge.name, weight: weight};
            vertice.addEdge(verticeEdge);

            // Add edge to edge
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
            v.heuristicCost = Math.sqrt(( (Math.abs(v.x - this.goal.x))^2 + (Math.abs(v.y - this.goal.y)^2)));
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
        for (var i = 0; i < this.vertices.length; i++) {
            let v = this.vertices[i]; 
            let euclideanDist = Math.sqrt((v.x - x)^2 + (v.y - y)^2);
            if (euclideanDist < 10)
                return false;
        }
        return true;
    }

    aStar() {
        // Create queue with starter node
        let pQueue = new PriorityQueue();
        pQueue.enqueue(this.start.name, 0);

        // Create list of visited nodes 
        let visited = new Set();
        let path = [];

        // While queue isn't empty, visit node, add children to queue with weight of (parent + theirs )
        while (!pQueue.isEmpty()) {
            // Visit node and update visited
            let curr = pQueue.dequeue(); 
            visited.add(curr.name); 

            // Goal node has been found. Get path. 
            if (curr.name == this.goal.name) {
                curr = this.getVertice(curr.name); 
                path.push(curr.name);
                console.log("Goal found: " + curr.name); 
                while (curr.parent != undefined) {
                    path.push(curr.parent);
                    curr = this.getVertice(curr.parent);
                }
                break;
            }

            let vertice = this.getVertice(curr.name);
            console.log(vertice);

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
        }
        return path;
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
// let graph = new Graph(5, 20);
// for (var i = 0; i < graph.vertices.length; i++) {
//     console.log(graph.vertices[i]);
// }
// console.log("Start: " + graph.start.name)
// console.log("Goal: " + graph.goal.name)

// let path = graph.aStar();
// console.log("Path: " + path); 