import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import VizContainer from "./Components/VizContainer";
import Hairball from "./Components/Hairball";
import Hive from "./Components/Hive";
import Tree from "./Components/Tree";
import About from "./Pages/About";
import "./App.css";

const GroupsHairball = [
  "Art", "Business Studies", "Citizenship", "Countries", 
  "Design & Technology", "Geography", "IT", "Language & literature", 
  "Mathematics", "Music", "Religion", "People", "Everyday life", 
  "Science", "History"
];

const GroupsHive = [
  "Art", "Business_Studies", "Citizenship", 
  "Design_and_Technology", "Geography", "IT", "Language_and_literature", 
  "Music", "Religion", "People", "Everyday_life", 
  "Science", "History"
];

const HairballText = "The hairball plot is a network visualization technique that is particularly useful for large networks.Nodes from the same category attract each other. Nodes from different categories repel each other. Nodes that are linked together have an attractive force between them.";
const HiveText = "Nodes represent sub-groups (one level of hierarchy) and are placed on the axis corresponding to their parent group. Links connect two sub-groups when an article from one sub-group contains a hyperlink to an article from another sub-group. The width of the link is proportional to the number of hyperlinks between sub-groups. Intra sub-group links are not displayed to keep the visualization clearer."
const TreeText = "A Tree Plot is used to visualize the hierarchy of groups and sub-groups. This helps to better understand the structure of the dataset and how different categories relate to one another.The Tree plot's construction is animated."

const App = () => {
  return (
    <div className="App">
    <Router>
      <header className="header">
        <nav>
          <NavLink to="/" end>Vizualisation</NavLink>
          <NavLink to="/about">About the plots</NavLink>
        </nav>
      </header>

      <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      </Routes>
    </Router>
    </div>
    );
  };

function Home() {
  return(
    <div className="App">
      <div className="top-container">
      <div className="logo-container">
        <img src="./Wikipedia_logo.png" alt="WikipediaLogo" width="100"/>
      </div>
      <div className="title-container">
        <h1 className="page-title">Wikipedia Network Visualization</h1>
      </div>
    </div>

    <div className="upper-viz">
      <div className="left-viz">
        <VizContainer viz={Hairball} title={"Hairball Plot"} groups={GroupsHairball} text={HairballText}/>
      </div>
      <div className="right-viz">
        <VizContainer viz={Hive} title={"Hive Plot"} groups={GroupsHive} text={HiveText}/>
      </div>  
    </div>
    <div className="lower-viz">
      <div className="center-viz">
        <VizContainer viz={Tree} title={"Tree Plot"} groups={GroupsHairball} text={TreeText}/>
      </div>
    </div>
  </div>
);
}

export default App;
