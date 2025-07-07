import { ethers } from "ethers";
import contractArtifact from "../../../artifacts/contracts/Voting.sol/Voting.json";

//let deployedContract = null;
//let owner = null;
//let otherAccount = null;

const STORAGE_ADDRESS = "address";
const ACCOUNT = "account";
const CHAIN = "sepolia"; // Change to your desired chain



async function getProvider() {
    if (!window.ethereum) {
        throw new Error("MetaMask is not installed");
    }
    await window.ethereum.request({ method: "eth_requestAccounts" });
    return new ethers.BrowserProvider(window.ethereum, CHAIN);
}

async function deployContract(movieList) {
    try {
        if (localStorage.getItem(STORAGE_ADDRESS) !== "") {
            return;
        }
        // Split movie names input into an array
        // const movies = await fetchMovies();
        const movieNamesArray = movieList.map((obj) => obj.title);

        // Prompt user to connect their MetaMask wallet
        const provider = await getProvider();
        const signer = await provider.getSigner();

        // Load contract factory
        const contractFactory = new ethers.ContractFactory(
            contractArtifact.abi,
            contractArtifact.bytecode,
            signer
        );

        // Deploy contract
        let contract = await contractFactory.deploy(movieNamesArray);

        // Wait for deployment transaction to be mined
        await contract.waitForDeployment();

        // Set deployed contract address
        const address = await contract.getAddress();
        localStorage.setItem(STORAGE_ADDRESS, address);
        console.log("contractAddress: " + address);

        /*
        [owner, otherAccount] = await ethers.getSigners();
        const MovieVoting = await ethers.getContractFactory("MovieVoting");
        contract = await MovieVoting.deploy(["Movie 1", "Movie 2", "Movie 3"]);
        await contract.waitForDeployment();
        localStorage.setItem("address", contract.getAddress());
        */
        //localStorage.setItem("owner", owner);
        //localStorage.setItem("otherAccount", otherAccount);
        //return {contract, owner, otherAccount};
    } catch (error) {
        console.error("Error deploying contract:", error);
    }
}

export async function reDeploy(movieList) {
    localStorage.setItem(STORAGE_ADDRESS, "");
    await deployContract(movieList);
}

export async function connectMetamask(){
  if (window.ethereum) {
      try {
          const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
          const first_account = accounts[0]; // Always return the first account
          localStorage.setItem(ACCOUNT, first_account);
          return first_account;
      } catch (err) {
          localStorage.setItem(ACCOUNT, null);
          throw new Error("User rejected the request or an error occurred while connecting to MetaMask.\n" + err.message);
      }
  } else {
      window.open('https://metamask.io/download/', '_blank');
  }
}

export function disconnectMetamask(){
    localStorage.setItem(ACCOUNT, null);
}

export function listenForAccountChanges(callback) {
    if (window.ethereum) {
        const handleAccountsChanged = (accounts) => {
            if (accounts.length > 0) {
                const account = accounts[0];
                localStorage.setItem(ACCOUNT, account);
                callback(account);
            } else {
                localStorage.setItem(ACCOUNT, null);
                callback(null);
            }
        };

        window.ethereum.on("accountsChanged", handleAccountsChanged);

        // Return a cleanup function to remove the listener
        return () => {
            window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
        };
    }
}


export async function voteForMovie(movie_id){
  if (!window.ethereum) {
    alert("Please install MetaMask to vote.");
    return;
  }

  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    const address = localStorage.getItem(STORAGE_ADDRESS);
    if (!address) {
      alert("No contract deployed. Please deploy the contract first.");
      return;
    }
    const contract = new ethers.Contract(address, contractArtifact.abi, signer);

    const tx = await contract.vote(movie_id); // movie.id comes from useParams fetch
    await tx.wait();

    alert("Vote submitted successfully!");
  } catch (err) {
    console.error("Error voting:", err);
    alert("Failed to vote. Check console for details.");
  }
};