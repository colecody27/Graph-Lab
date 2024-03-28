import {Graph} from '../lib/graph.js'
import {Vertice} from '../lib/graph.js'

let graph = new Graph(5, 20)
let queue = []
let visited = new Set()

for (var i = 0; i < graph.vertices.length; i++) {
    console.log(graph.vertices[i]);
}
console.log("Start: " + graph.start.name)
console.log("Goal: " + graph.goal.name)

// Start BFS
queue.push(graph.start)
while(queue.length > 0) {
    let curr = queue.shift()
    visited.add(curr.name)
    console.log('Visiting:' + curr.name)

    curr.edgeNames.forEach((edgeName) => {
        if (!queue.includes((v) => {v.name === edgeName}) && !visited.has(edgeName)) {
            queue.push(graph.vertices.find((v) => {if (v.name === edgeName) return v}))
        }
    })
}