import React from "react";
import "./InfoPopup.css";

function InfoPopup({ onClose,  text}) {
    return (
        <div className="popup-overlay">
            <div className="popup">
                <h3>Infos</h3>
                <p>{text}</p>
                <button onClick={onClose}>Fermer</button>
            </div>
        </div>
    );
}

export default InfoPopup;
