import React, { useState } from "react";

import "./AccountSelector.css";

interface AccountInfo {
  address: string;
  balance: string;
}

const MetaMaskAccountSelector: React.FC = () => {
  const [accounts, setAccounts] = useState<AccountInfo[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<string>(() => {
    // Retrieve selected account from localStorage if available
    return localStorage.getItem("selectedAccount") || "";
  });
  const [showPopup, setShowPopup] = useState<boolean>(false);

  const handleAccountSelection = (address: string) => {
    setSelectedAccount(address);
    // Save selected account to localStorage
    localStorage.setItem("selectedAccount", address);
  };

  const fetchAccounts = async () => {
    
    let w = window as any;
    if (typeof window !== "undefined" && w.ethereum) {
      try {
        const accounts = await w.ethereum.request({
          method: "eth_requestAccounts",
        });
        const accountInfo: AccountInfo[] = await Promise.all(
          accounts.map(async (address: string) => {
            const balance = await w.ethereum.request({
              method: "eth_getBalance",
              params: [address, "latest"],
            });
            return { address, balance };
          })
        );
        setAccounts(accountInfo);
        setShowPopup(true); // Show popup after fetching accounts
      } catch (error) {
        console.error("Error fetching accounts:", error);
      }
    } else {
      console.error("MetaMask extension not installed or not enabled.");
    }
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  return (
    <div>
      <button onClick={fetchAccounts}>Connect Metamask</button>
      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <span className="close" onClick={handleClosePopup}>
              &times;
            </span>
            <h2>MetaMask Accounts</h2>
            <ul>
              {accounts.map((account) => (
                <li key={account.address}>
                  <label>
                    <input
                      type="radio"
                      name="account"
                      value={account.address}
                      checked={selectedAccount === account.address}
                      onChange={() => handleAccountSelection(account.address)}
                    />
                    {`${account.address} - Balance: ${account.balance}`}
                  </label>
                </li>
              ))}
            </ul>
            {selectedAccount && <p>Selected Account: {selectedAccount}</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default MetaMaskAccountSelector;
