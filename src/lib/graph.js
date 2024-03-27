class Graph {
    vertices = []

    constructor(nodes, maxCost) {
        this.nodes = nodes; 
        this.maxCost = maxCost;

        // Create random vertices with unique name. Ex: A1 | B2

        // Add edge from vertice to random vertice
        
        // 
    }



    addVertice(Vertice) {
        vertices.push(Vertice)
    }
}

class Vertice {
    edges = []
    heuristicCost= -1

    constructor(name) {
        this.name = name; 
    }

    addEdge(name, weight) {
        edges.push({name, weight})
    }

    getEdges() {

    }

}