import React, { useEffect, useState, useRef } from "react";
import * as d3 from "d3";
import data from "../assets/tree.json";


function Tree({selectedGroups}) {
    if (!data) return <p>Chargement du graphe...</p>;
    // Simulation D3 et rendu
    return <TreeVisualization data={data} selectedGroups={selectedGroups}/>;
}

function TreeVisualization({data, selectedGroups}) {
    const containerRef = useRef();

    useEffect(() => {
      if (!data || !data.children) return;
  
      // Nettoyage avant rendu
      d3.select(containerRef.current).select("svg").remove();
  
      // Dimensions
      const width = 1400;
      const height = 600;
      const margin = { top: 50, right: 150, bottom: 50, left: 150 };

      // Création du SVG
      const svg = d3
        .select(containerRef.current)
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .style("max-width", "100%")
        .style("border", "1px solid #333")
        .style("border-radius", "8px");
  
      const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

      const initialScale = 0.3;
      const initialTranslate = [width / 2, height / 2];

      svg.call(
        d3.zoom()
          .scaleExtent([0.25, 2])
          .on("zoom", (event) => g.attr("transform", event.transform))
      );


      const root = d3.hierarchy(data);
  

  
      const treeLayout = d3
        .tree()
        .size([height*3 - margin.top - margin.bottom, width - margin.left - margin.right]);
  
      treeLayout(root);
  
      const linkGenerator = d3
        .linkHorizontal()
        .x(d => d.x)
        .y(d => d.y);

      g.selectAll(".link")
        .data(root.links())
        .enter()
        .append("path")
        .attr("class", "link")
        .attr("d", linkGenerator)
        .style("fill", "none")
        .style("stroke", "#999")
        .style("stroke-width", 2)
        .attr("stroke-dasharray", function() {
            return this.getTotalLength(); 
          })
          .attr("stroke-dashoffset", function() {
            return this.getTotalLength();
          })
        .transition()
        .duration(1200)
        .delay((d, i) => 3000 + Math.random() * 1000)
        .ease(d3.easeCubic)
        .attr("stroke-dashoffset", 0);
  
      const nodes = g.selectAll(".node")
        .data(root.descendants())
        .enter()
        .append("g")
        .attr("class", "node")
        .attr("transform", d => `translate(${d.x},${d.y})`);
  
      nodes.append("circle")
        .attr("r", 6)
        .style("fill", "#69b3a2")
        .style("stroke", "#333")
        .style("stroke-width", 1.5);
  
      nodes.append("text")
        .attr("dy", 4)
        .attr("x", d => (d.children ? -10 : 10))
        .attr("text-anchor", d => (d.children ? "end" : "start"))
        .style("font-size", "14px")
        .attr("transform", "rotate(90)")
        .style("fill", "#fff")
        .text(d => d.data.name)
        .style("opacity", 0)
        .transition()
        .delay(3000 + 2000)
        .duration(1000)
        .style("opacity", 1);
  
    }, [data, selectedGroups]);
  
    return <div ref={containerRef}></div>;
  }

export default Tree;
