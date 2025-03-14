import React, { useEffect, useState,useRef } from "react";
import * as d3 from "d3";
import data from "../assets/Hairball.json";
import "./Hairball.css";

function Hairball({selectedGroups}) {
  if (!data) return <p>Loading viz...</p>;

  return <GraphVisualization data={data} selectedGroups={selectedGroups}/>;
}

function GraphVisualization({ data, selectedGroups }) {
  const [nbIntraLink, setNbIntraLink] = useState(0.02); // Valeur initiale du slider
  const [nbInterLink, setNbInterLink] = useState(0.2); // Valeur initiale du slider
  useEffect(() => {
    const width = 928 * 2;
    const height = 680 * 2;
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    d3.select("#graph-container").select("svg").remove();

    const svg = d3.select("#graph-container")
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [-width / 2, -height / 2, width, height])
      .style("max-width", "100%")
      .style("height", "auto")
      .style("border", "1px solid #333533")
      .style("border-radius", "8px");

      const zoom = d3.zoom()
      .scaleExtent([0.5, 5]) // Zoom entre 50% et 500%
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });

    svg.call(zoom);

    const g = svg.append("g"); // Conteneur pour les éléments zoomables

    const links = data.links.map(d => ({ ...d }));
    const nodes = data.nodes.map(d => ({ ...d }));

    const filteredNodes = nodes.filter(node =>
      node.group.some(group => selectedGroups.has(group))
    );

    
    let filteredLinks = links.filter(link =>
      link.source_group.some(group => selectedGroups.has(group)) &&
      link.target_group.some(group => selectedGroups.has(group))
    );
    
    filteredLinks = filteredLinks.filter(link => {
        const differentCluster = link.source_group[0] !== link.target_group[0];
        return differentCluster || Math.random() < nbIntraLink; // Garde 20% des liens inter-cluster
      });

    filteredLinks = filteredLinks.filter(link => {
        const differentCluster = link.source_group[0] == link.target_group[0];
        return differentCluster || Math.random() < nbInterLink; // Garde 20% des liens inter-cluster
      });

    const simulation = d3.forceSimulation(filteredNodes)
      .force("link", d3.forceLink(filteredLinks).id(d => d.id))
      .force("charge", d3.forceManyBody())
      .force("x", d3.forceX())
      .force("y", d3.forceY())

      

    const link = g.append("g")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(filteredLinks)
      .join("line")
      .attr("stroke-width", d => Math.sqrt(d.value));

    const node = g.append("g")
      //.attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
      .selectAll("circle")
      .data(filteredNodes)
      .join("circle")
      .attr("r", 5)
      .attr("fill", d => color(d.group[0]))
      .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));

      const legend = svg.append("g")
      .attr("transform", `translate(${width / 2 - 100}, ${height / 2 - 600})`);
      
      const uniqueGroups = Array.from(new Set(nodes.flatMap(node => node.group)));
      uniqueGroups.forEach((group, i) => {
        const legendRow = legend.append("g")
          .attr("transform", `translate(${-150}, ${i*70 - 600})`);
      
        legendRow.append("rect")
          .attr("width", 30)
          .attr("height", 30)
          .attr("fill", color(group));
      
        legendRow.append("text")
          .attr("x", -20)
          .attr("y", -10)
          .attr("text-anchor", "start")
          .attr("font-size", "24px")
          .attr("fill", "#E8EDDF")
          .text(group);
      });

    const groupCenters = new Map();

    // Définition des positions centrales des groupes
    uniqueGroups.forEach((group, i) => {
      groupCenters.set(group, { x: (i % 3) * 200 - width / 4, y: Math.floor(i / 3) * 200 - height / 4 });
    });

    // Ajout d'une force qui attire chaque groupe vers son centre
    simulation.force("grouping", d3.forceManyBody().strength(-15)) // Répulsion entre tous les noeuds
  .force("groupCenter", d3.forceX().x(d => {
    const group = d.group[0]; // Prend le premier groupe pour l'attraction
    return groupCenters.has(group) ? groupCenters.get(group).x : 0;
  }).strength(0.1))
  .force("groupY", d3.forceY().y(d => {
    const group = d.group[0];
    return groupCenters.has(group) ? groupCenters.get(group).y : 0;
  }).strength(0.1));
      
        
    //node.append("title").text(d => d.id);
    const tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("position", "absolute")
    .style("background", "#333")
    .style("color", "white")
    .style("padding", "5px 10px")
    .style("border-radius", "5px")
    .style("display", "none")
    .style("pointer-events", "none");
  
    node.on("mouseover", function (event, d) {
        d3.select(this).transition().duration(200).attr("r", d.radius * 1.5); // Augmente la taille du nœud
        tooltip.style("display", "block")
            .style("left", `${event.pageX + 10}px`)
            .style("top", `${event.pageY - 10}px`)
            .text(d.id);
    });
    
    node.on("mouseout", function () {
        d3.select(this)
        .transition()
        .duration(200)
        .attr("r", d => d.radius); 
        tooltip.style("display", "none");
    });
      

    simulation.on("tick", () => {
      link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

      node
        .attr("cx", d => d.x)
        .attr("r", d => d.radius)
        .attr("cy", d => d.y);
    });

    function dragstarted(event) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }


    return () => simulation.stop(); // Nettoyage du simulation
  }, [data, selectedGroups, nbInterLink, nbIntraLink]);

  return (
  <div id="graph-container">
    <div className="slider-container">
      <div className="slider-intra">
        <input
          type="range"
          id="intra_link"
          name="intra link"
          min="0"
          max="0.5"
          value={nbIntraLink}
          onChange={(e) => setNbIntraLink(Number(e.target.value))}
          step="0.02" />
        <label htmlFor="intra_link">intra link: {nbIntraLink*100}%</label>
      </div>
      <div className="slider-inter">
        <input
          type="range"
          id="inter_link"
          name="inter link"
          min="0"
          max="0.8"
          value={nbInterLink}
          onChange={(e) => setNbInterLink(Number(e.target.value))}
          step="0.05" />
          <label htmlFor="inter_link">inter link: {nbInterLink*100}%</label>
      </div>
    </div>
  </div>)
  
  ; 
}

export default Hairball;



