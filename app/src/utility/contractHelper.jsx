import { ethers } from "ethers";
import contractArtifact from "../../../artifacts/contracts/Voting.sol/Voting.json";

const CONTRACT_ADDRESS = "address";
const ACCOUNT = "account";
const CHAIN = "sepolia";


export async function getProvider() {
    if (!window.ethereum) {
        throw new Error("MetaMask is not installed");
    }
    const account = localStorage.getItem(ACCOUNT);
    if (!account) {
        throw new Error("No account found in local storage. Please connect your MetaMask wallet.");
    }
    return new ethers.BrowserProvider(window.ethereum, CHAIN);
}

export async function getSigner() {
    const provider = await getProvider();
    return await provider.getSigner();
}

export async function getContract() {
    const signer = await getSigner();
    const address = localStorage.getItem(CONTRACT_ADDRESS);
    if (!address) throw new Error("Contract not deployed or address missing.");
    return new ethers.Contract(address, contractArtifact.abi, signer);
}

async function deployContract(ids, titles) {
    try {
        const existingAddress = localStorage.getItem(CONTRACT_ADDRESS);
        if (existingAddress && existingAddress !== "undefined") {
            console.log("Contract already deployed at:", existingAddress);
            return;
        }

        // Prompt user to connect their MetaMask wallet
        const signer = await getSigner();

        // Load contract factory
        const contractFactory = new ethers.ContractFactory(
            contractArtifact.abi,
            contractArtifact.bytecode,
            signer
        );

        // Deploy contract
        let contract = await contractFactory.deploy(ids, titles);

        // Wait for deployment transaction to be mined
        await contract.waitForDeployment();

        // Set deployed contract address
        const address = await contract.getAddress();
        localStorage.setItem(CONTRACT_ADDRESS, address);
        console.log("contractAddress: " + address);

    } catch (error) {
        console.error("Error deploying contract:", error);
    }
}

export async function reDeploy(movieList) {
    localStorage.removeItem(CONTRACT_ADDRESS);
    const ids = movieList.map((obj) => obj.id);
    const titles = movieList.map((obj) => obj.title);
    await deployContract(ids, titles);
}

export async function connectMetamask(){
  if (!window.ethereum) {
      window.open('https://metamask.io/download/', '_blank');
      return;
  }
  try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const first_account = accounts?.[0] ?? null;
      if (first_account) {
          localStorage.setItem(ACCOUNT, first_account);
      } else {
          localStorage.removeItem(ACCOUNT);
      }
      return first_account;
  } catch (err) {
      localStorage.removeItem(ACCOUNT);
      throw new Error("User rejected the request or an error occurred while connecting to MetaMask.\n" + err.message);
  }
}

export function disconnectMetamask(){
    localStorage.removeItem(ACCOUNT);
}

export function listenForAccountChanges(callback) {
    if (window.ethereum) {
        const handleAccountsChanged = (accounts) => {
            if (accounts.length > 0) {
                const account = accounts[0];
                localStorage.setItem(ACCOUNT, account);
                callback(account);
            } else {
                localStorage.removeItem(ACCOUNT);
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


export async function voteForMovie(movie_id, movie_title){
  if (!window.ethereum) {
    alert("Please install MetaMask to vote.");
    return;
  }

  try {
    const address = localStorage.getItem(CONTRACT_ADDRESS);
    if (!address) {
      alert("No contract deployed. Please deploy the contract first.");
      return;
    }
    const contract = await getContract();

    const title = await contract.getMovieById(movie_id)
    if (title === "") {
        await contract.addMovie(movie_id, movie_title);
        console.log(`Movie with ID ${movie_id} and Title '${movie_title}' added successfully.`);
    }

    const tx = await contract.vote(movie_id);
    await tx.wait();

    console.log(`Vote for movie ID ${movie_id} submitted successfully.`);
    alert("Vote submitted successfully!");
  } catch (err) {
    console.error("Error voting:", err);
    alert("Failed to vote. Check console for details.");
  }
};


export async function getTop5Movies() {
    const contract = await getContract();
    const topMovies = await contract.getTop5Movies();
    const voting = await Promise.all(
        topMovies.map(async (movieId) => {
            const voteCount = await contract.getVoteCountByMovieId(movieId);
            return { id: movieId, votes: voteCount };
        })
    );
    return voting;
}

export async function getVoteCountById(movieId) {
    try{
        const contract = await getContract();
        const voteCount = await contract.getVoteCountByMovieId(movieId);
        return voteCount;
    } catch (error) {
        console.error("Error fetching vote count:", error);
        throw new Error("Failed to fetch vote count. Please try again later.");
    }
}


// async function signAddMovie(signer, movieId, movieName, nonce) {
//     const domain = {
//         name: "VotingNFT",
//         version: "1",
//         chainId: 11155111, // Sepolia testnet chain ID
//         verifyingContract: localStorage.getItem(CONTRACT_ADDRESS),
//     };
// 
//     const types = {
//         AddMovie: [
//         { name: "movie_id", type: "uint256" },
//         { name: "name", type: "string" },
//         { name: "nonce", type: "uint256" },
//         { name: "user", type: "address" },
//         ],
//     };
// 
//   const userAddress = await signer.getAddress();
// 
//   const value = {
//     movie_id: movieId,
//     name: movieName,
//     nonce: nonce,
//     user: userAddress,
//   };
// 
//   const signature = await signer._signTypedData(domain, types, value);
//   return { signature, userAddress };
// }
// 
// async function relayAddMovie(
//   relayerSigner,  // Backend wallet (ethers.Wallet)
//   contract,       // ethers.Contract instance of Voting
//   movieId,
//   movieName,
//   userAddress,
//   nonce,
//   signature
// ) {
//   const tx = await contract.connect(relayerSigner).relayAddMovie(
//     movieId,
//     movieName,
//     userAddress,
//     nonce,
//     signature,
//     {
//       gasLimit: 300000, // adjust as needed
//     }
//   );
//   await tx.wait();
//   console.log(`Transaction sent: ${tx.hash}`);
// }
// 
// export async function addMovie(movieId, movieName) {
//     const provider = await getProvider();
// 
//     // Frontend user (MetaMask)
//     const userSigner = new ethers.providers.Web3Provider(window.ethereum).getSigner();
// 
//     // Backend relayer wallet
//     const relayer = new ethers.Wallet("RELAYER_PRIVATE_KEY", provider);
// 
//     const contractAddress = localStorage.getItem(CONTRACT_ADDRESS);
//     const contract = new ethers.Contract(contractAddress, contractArtifact.abi, provider);
// 
//     // 1. Get nonce
//     const userAddress = await userSigner.getAddress();
//     const nonce = await contract.nonces(userAddress);
// 
//     // 2. User signs
//     const { signature } = await signAddMovie(userSigner, movieId, movieName, nonce);
// 
//     // 3. Relayer sends tx
//     await relayAddMovie(relayer, contract, movieId, movieName, userAddress, nonce, signature);
// 
// }