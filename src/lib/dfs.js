import {Graph} from '../lib/graph.js'

let graph = new Graph(7, 20)
let stack = []
let visited = new Set()

for (var i = 0; i < graph.vertices.length; i++) {
    console.log(graph.vertices[i]);
}

console.log("Start: " + graph.start.name)
console.log("Goal: " + graph.goal.name)

stack.push(graph.start)

while (stack.length > 0) {
    let curr = stack.pop()
    visited.add(curr.name)
    console.log('Visiting:' + curr.name)

    curr.edgeNames.forEach((edgeName) => {
        let vertex = graph.vertices.find((v) => v.name === edgeName)
        if ( vertex && !stack.some((v) => v.name === edgeName) && !visited.has(edgeName)) {
            stack.push(vertex);
        }
    })

}






