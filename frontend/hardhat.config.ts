import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  networks: {
    localhost: {
      url: "http://localhost:8545", // URL of your local Ethereum node
      gasPrice: 0
    },
  },
  paths: {
    artifacts: './artifacts', // Change this to your desired path
  },
  solidity: "0.8.24",
};

export default config;
