# Commands
```bash
// Compile
npx hardhat compile

// Test
npx hardhat test

// Deploy to local chain
npx hardhat ignition deploy ./ignition/modules/Voting.js

// Deploy to remote network
npx hardhat ignition deploy ./ignition/modules/Voting.js --network sepolia
```

# Remote Chain Sepolia
```
// infura.io
npx hardhat vars set INFURA_API_KEY

// Metamask Account 1 private key
npx hardhat vars set SEPOLIA_PRIVATE_KEY

Bereits deployter contract: 0x375a746A9cF2CC534b8eeA0A6050745D13D79E75
```