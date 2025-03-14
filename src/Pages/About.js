import React from "react";
import "./About.css";

function About() {
  return (
    <div className="about">
        <h1>About the dataset</h1>
        <p>
            <ul>
                <li>
                (1) Robert West and Jure Leskovec: Human Wayfinding in Information Networks.
                21st International World Wide Web Conference (WWW), 2012. 
                </li>
                <li>
                (2) Robert West, Joelle Pineau, and Doina Precup:  Wikispeedia: An Online Game for Inferring Semantic Distances between Concepts.
                21st International Joint Conference on Artificial Intelligence (IJCAI), 2009.
                </li>
            </ul>
        </p>
        <footer className="footer">
            <p>© Jean ACKER - 2025 - Wikipedia Network Visualization</p>
        </footer>
    </div>
    );
}

export default About;
