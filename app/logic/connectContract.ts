import { ethers } from "ethers";
import Lock from "../../artifacts/contracts/lock.sol/Lock.json";

const URL_DES_TESTNETZWERKS = "http://0.0.0.0:8545/"
const SMART_CONTRACT_ADRESSE = "0x5fbdb2315678afecb367f032d93f642f64180aa3"

async function connectToEthereum() {
    const provider = new ethers.providers.JsonRpcProvider(URL_DES_TESTNETZWERKS);
    // Stelle sicher, dass du die richtige URL für das Testnetzwerk verwendest
    return provider;
}

async function connectToContract() {
    const provider = await connectToEthereum();
    const signer = provider.getSigner();
    const contract = new ethers.Contract(
      SMART_CONTRACT_ADRESSE,
      Lock.abi,
      signer
    );
    return contract;
}

export async function callSmartContractFunction() {
    const contract = await connectToContract();
    //const result = await contract.withdraw();
    await contract.withdraw();
    return "done"
    //console.log(result);
  }