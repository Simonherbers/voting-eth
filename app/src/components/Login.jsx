import React, { useState, useEffect } from 'react';
import MetamaskLogo from "../assets/metamask-logo.svg";
import { connectMetamask, disconnectMetamask, listenForAccountChanges } from '../utility/contractHelper'; // Assuming you have a utility function to handle login

// Simple user icon
const UserIcon = () => (
    <svg width="32" height="32" fill="none" viewBox="0 0 24 24">
        <circle cx="12" cy="8" r="4" fill="#888" />
        <rect x="4" y="16" width="16" height="6" rx="3" fill="#bbb" />
    </svg>
);

const Login = () => {
    const [showPopup, setShowPopup] = useState(false);
    const [account, setAccount] = useState(null);
    useEffect(() => {
        // Listen for account changes and update state
        const unsubscribe = listenForAccountChanges((newAccount) => {
            setAccount(newAccount);
            if (newAccount) {
                console.log("Connected account:", newAccount);
                setShowPopup(true);
                alert(`Connected to account: ${newAccount.slice(0, 6)}...${newAccount.slice(-4)}`);
            } else {
                console.log("Disconnected from MetaMask");
                setShowPopup(false);
            }
        });
        return () => {
            if (typeof unsubscribe === "function") unsubscribe();
        };
    }, []);

    const handleLogin = async () => {
        try {
            const account = await connectMetamask();
            setAccount(account);
            setShowPopup(false);
        } catch (err) {
            // User rejected or error
            console.error("Login failed:", err);
            alert("Login failed. Please check your MetaMask connection.");
            handleLogout();
        }
    };

    const handleLogout = () => {
        setAccount(null);
        disconnectMetamask();
        setShowPopup(false);
    };

    return (
        <div>
            <button
                aria-label="Login"
                onClick={() => setShowPopup((v) => !v)}
            >
                <UserIcon />
            </button>
            {showPopup && (
                <div className="popup">
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                        <img
                            src={MetamaskLogo}
                            alt="MetaMask Logo"
                            style={{ width: 40, height: 40 }}
                        />
                        <span style={{ marginLeft: '0.75rem', fontWeight: 600, fontSize: '1.1rem' }}>
                            MetaMask
                        </span>
                    </div>
                    {!account ? (
                        <button
                            onClick={handleLogin}
                            style={{
                                width: '100%',
                                padding: '0.5rem',
                                background: '#f6851b',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '4px',
                                fontWeight: 600,
                                cursor: 'pointer',
                            }}
                        >
                            Login with MetaMask
                        </button>
                    ) : (
                        <div>
                            <div
                                style={{
                                    marginBottom: '0.5rem',
                                    fontSize: '0.95rem',
                                    wordBreak: 'break-all',
                                }}
                            >
                                <strong>Account:</strong> {account.slice(0, 6)}...{account.slice(-4)}
                            </div>
                            <button
                                onClick={handleLogout}
                                style={{
                                    width: '100%',
                                    padding: '0.5rem',
                                    background: '#444',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '4px',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                }}
                            >
                                Log out
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Login;