// NavigationHeader.jsx
import React from "react";
import { Link } from "react-router-dom";
import "./NavigationHeader.css"; // Import CSS file for styling
import MetaMaskAccountSelector from "./AccountSelector";

const NavigationHeader = () => {
  return (
    <header className="navigation-header">
      <nav className="align">
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/configuration">Votings</Link>
          </li>
        </ul>
        <div className="right">
          <MetaMaskAccountSelector />
        </div>
      </nav>
    </header>
  );
};

export default NavigationHeader;
