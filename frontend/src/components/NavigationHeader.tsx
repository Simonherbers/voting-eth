// NavigationHeader.jsx
import { Link } from "react-router-dom";
import "./NavigationHeader.css"; // Import CSS file for styling
import MetaMaskAccountSelector from "./AccountSelector";
import { reDeploy } from "../utility/ContractService";

const NavigationHeader = () => {
  
  const handleClick = async () => {
    await reDeploy()
  }

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
          <button onClick={handleClick}>Re-Deploy</button>
        </div>
        <div className="right">
          <MetaMaskAccountSelector />
        </div>
      </nav>
    </header>
  );
};

export default NavigationHeader;
