import React, { useState } from "react";
import "./VizContainer.css";
import InfoPopup from "./InfoPopup";
import SidePanel from "./SidePanel";

function VizContainer({ viz:Viz, title, groups, text }) {
    const [isPanelOpen, setIsPanelOpen] = useState(true);
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const [selectedGroups, setSelectedGroups] = useState(new Set(["People", "Citizenship", "Art"]));

    function onToggleGroup(group) {
        setSelectedGroups((prev) => {
          const newSet = new Set(prev);
          newSet.has(group) ? newSet.delete(group) : newSet.add(group);
          return newSet;
        });
      }

    return (
        <div className="card">
            <div className="card-title">{title}</div>
            <div className={`side-panel ${isPanelOpen ? "open" : ""}`}>
                <button className="toggle-panel" onClick={() => setIsPanelOpen(!isPanelOpen)}>
                    {isPanelOpen ? "←" : "→"}
                </button>
                <SidePanel selectedGroups={selectedGroups} onToggleGroup={onToggleGroup} groups={groups} />
            </div>
            <div className="card-content">
                <Viz selectedGroups={selectedGroups} />
            </div>

            <button className="info-button" onClick={() => setIsPopupOpen(true)}>
                ℹ️
            </button>

            {isPopupOpen && <InfoPopup onClose={() => setIsPopupOpen(false)} text={text}/>}
        </div>
    );
}

export default VizContainer;
