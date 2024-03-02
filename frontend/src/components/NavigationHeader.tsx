// NavigationHeader.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './NavigationHeader.css'; // Import CSS file for styling

const NavigationHeader = () => {
  return (
    <header className="navigation-header">
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/configuration">Votings</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default NavigationHeader;
