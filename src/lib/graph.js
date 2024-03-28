export class Graph {
    vertices = [];
    start;
    goal;

    constructor(size, maxCost) {
        this.size = size; 
        this.maxCost = maxCost;

        // Create random vertices with unique name. Ex: A1 | B2
        let letter = 'A';
        let number = 1; 
        for (var i = 0; i < size; i++) {
            this.addVertice(new Vertice(letter+number, Math.floor(Math.random() * maxCost)))

            // Restart letter sequence and increment number
            if (letter == 'Z') {
                letter = 'A';
                number++;
            } else
                letter = String.fromCharCode(letter.charCodeAt(0) + 1); 
        }
        
        // Add random edge to random vertice 
        const maxEdges = size -1
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
    }

    addVertice(Vertice) {
        this.vertices.push(Vertice);
    }

    getVertice(name) {
        return this.vertices.find((v) => {if (v.name === name) return v})
    }
}

export class Vertice {
    name;
    edgeNames = new Set([]);
    edges = [];
    heuristicCost= -1;

    constructor(name, heuristicCost) {
        this.name = name; 
        this.heuristicCost = heuristicCost; 
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