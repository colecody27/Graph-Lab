class Graph {
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
        const maxEdges = size*((size-1)/2) 
        for (var i = 0; i < maxEdges; i++) {
            // Select random vertice from list of vertices
            let randomIndx1 = Math.floor(Math.random() * this.vertices.length)
            let randomIndx2 = Math.floor(Math.random() * this.vertices.length)
            let randomVertice = this.vertices[randomIndx1]
            let randomEdge = this.vertices[randomIndx2]

            // Verify different indexes are selected
            while (randomIndx1 == randomIndx2 || randomVertice.edgeNames.has(randomEdge.name)) {
                randomIndx2 = Math.floor(Math.random() * this.vertices.length)
                randomEdge = this.vertices[randomIndx2]
            }

            // Add edge to vertice
            const edge = {name: randomEdge.name, weight: Math.floor(Math.random() * maxCost)}
            randomVertice.addEdge(edge)
        }

        // Set start node and goal node
        let randomIndx1 
        let randomIndx2
        do {
            randomIndx1 = Math.floor(Math.random() * this.vertices.length)
            randomIndx2 = Math.floor(Math.random() * this.vertices.length)
            this.start = this.vertices[randomIndx1]
            this.goal = this.vertices[randomIndx2]
        } while (randomIndx1 == randomIndx2)
    }

    addVertice(Vertice) {
        this.vertices.push(Vertice)
    }
}

class Vertice {
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
        this.edgeNames.add(edge.name)
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
let graph = new Graph(5, 20);
for (var i = 0; i < graph.vertices.length; i++) {
    console.log(graph.vertices[i])
}