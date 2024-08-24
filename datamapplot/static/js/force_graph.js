function createForceGraph(data, container) {
    const width = container.clientWidth;
    const height = container.clientHeight;

    function customClusterForce() {
        function force(alpha) {
            for (let i = 0; i < data.nodes.length; i++) {
                for (let j = i + 1; j < data.nodes.length; j++) {
                    let node1 = data.nodes[i];
                    let node2 = data.nodes[j];
                    
                    // If nodes are in the same cluster, no repulsion
                    if (node1.cluster === node2.cluster) continue;
                    
                    let dx = node2.x - node1.x;
                    let dy = node2.y - node1.y;
                    let distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance > 0) {
                        let repulsionStrength = 1 / distance;
                        let fx = dx / distance * repulsionStrength;
                        let fy = dy / distance * repulsionStrength;
                        
                        node1.vx -= fx * alpha;
                        node1.vy -= fy * alpha;
                        node2.vx += fx * alpha;
                        node2.vy += fy * alpha;
                    }
                }
            }
        }
        return force;
    }

    const simulation = d3.forceSimulation(data.nodes)
        .force("link", d3.forceLink(data.links).id(d => d.id))
        .force("charge", d3.forceManyBody().strength(-30))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force("cluster", customClusterForce());

    const svg = d3.select(container).append("svg")
        .attr("width", width)
        .attr("height", height);

    const link = svg.append("g")
        .selectAll("line")
        .data(data.links)
        .join("line")
        .attr("stroke", "#999")
        .attr("stroke-opacity", 0.6);

    const node = svg.append("g")
        .selectAll("circle")
        .data(data.nodes)
        .join("circle")
        .attr("r", 5)
        .attr("fill", "#69b3a2");

    simulation.on("tick", () => {
        link
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);

        node
            .attr("cx", d => d.x)
            .attr("cy", d => d.y);
    });
}