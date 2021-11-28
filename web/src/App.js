import { useEffect, useState } from "react";
import { ethers } from "ethers";

import "./App.css";

import contractMeta from "./contract_meta.json";

const CONTRACT_ADDRESS = "0xF4Ee9052BA82C66d44f074a0a843E9D33D5bE117";

const VIEW_COLLECTION_URL = "https://testnets.opensea.io/collection/threeflavoricecreamnft-y1nal595gq";
const VIEW_TX_URL = "https://rinkeby.etherscan.io/tx/";

 const App = () => {
  const [currentAccount, setCurrentAccount] = useState("");

  const [maxNftCount, setMaxNftCount] = useState(0);
  const [mintedNftCount, setMintedNftCount] = useState(0);

  const [isLoading, setIsLoading] = useState(false);
  const [nftTxnHash, setNftTxnHash] = useState("");

  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;

    // Check if we have access to window.ethereum
    if (!ethereum) {
      console.log("Make sure you have MetaMask!");
      return
    }

    // Query NFT counts
    getNftCounts();

    try {
      // Get connected accounts
      const accounts = await ethereum.request({ method: "eth_accounts" });
      
      // Check if there is a connected account
      if (accounts.length === 0) {
        console.log("No authorized account found!");
        return;
      }

      // Get first connected account
      const account = accounts[0];
      console.log("Found an authorized account: ", account);

      // Update state
      setCurrentAccount(account);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const connectWallet = async () => {
    const { ethereum } = window;

    // Check if we have access to window.ethereum
    if (!ethereum) {
      alert("Get MetaMask!");
      return;
    }

    try {
      // Request account access
      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      // Get first connected account
      const account = accounts[0];

      console.log("Connected account: ", account);

      // Update state
      setCurrentAccount(account);

      // Query NFT counts
      getNftCounts();
    } catch (error) {
      console.log(error)
    }
  };

  const getNftCounts = async () => {
    try {
      // Get contract
      const myEpicNftContract = createContract();

      // Get NFT counts from contract
      const maxNftCount = await myEpicNftContract.getMaxEpicNFTCount();
      const mintedNftCount = await myEpicNftContract.getMintedEpicNFTCount();

      console.log("NFTs max: ", Number(maxNftCount));
      console.log("NFTs minted: ", Number(mintedNftCount));

      // Update state
      setMaxNftCount(Number(maxNftCount));
      setMintedNftCount(Number(mintedNftCount));
    } catch (error) {
      console.log(error);
    }
  };

  const mintNft = async () => {
    try {
      // Get contract
      const myEpicNftContract = createContract();

      // Execute the mint on contract
      let nftTxn = await myEpicNftContract.makeAnEpicNFT();

      // Wait for mining of transaction
      console.log("Mining ... ", nftTxn.hash);
      setIsLoading(true);
      await nftTxn.wait();
      setIsLoading(false);
      console.log("Mined ", nftTxn.hash);

      setNftTxnHash(nftTxn.hash);
      
      // Log Etherscan URL
      console.log("NFT minted, see transaction: ", VIEW_TX_URL + nftTxn.hash);
    } catch (error) {
      console.log(error)
    }
  };

  const onNewNftMintedHandler = (from, tokenId) => {
    console.log("New NFT minted.");
    setMintedNftCount(prev => prev + 1);
  };

  const registerOnNewNftMintedHandler = () => {
    const { ethereum } = window;

    // Check if we have access to window.ethereum
    if (!ethereum) {
      return () => {};
    }

    // Get contract
    const myEpicNftContract = createContract();

    // Subscribe event 'NewEpicNFTMinted'
    myEpicNftContract.on("NewEpicNFTMinted", onNewNftMintedHandler);

    return () => {
      // Unsubscribe event 'NewEpicNFTMinted'
      myEpicNftContract.off("NewEpicNFTMinted", onNewNftMintedHandler);
    };
  };

  useEffect(() => {
    registerOnNewNftMintedHandler();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function createContract() {
    // Get Web3 provider/signer
    const { ethereum } = window;
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();

    // Get contract
    return new ethers.Contract(CONTRACT_ADDRESS, contractMeta.abi, signer);
  }

  const renderNftCounter = () => (
    <p className="small-text">Only {maxNftCount-mintedNftCount} / {maxNftCount} available.</p>
  )

  const renderConnectedWalletButton = () => (
    <button className="button" onClick={connectWallet}>
      Connect Wallet
    </button>
  );

  const renderMintNftButton = () => (
    <button
      className="button"
      disabled={isLoading}
      onClick={mintNft}>
      Mint NFT
    </button>
  );

  const renderLoader = () => (
    <div className="loader" />
  );

  const buildEtherscanTxnUrl = () => {
    return VIEW_TX_URL + nftTxnHash;
  }

  return (
    <div className="main-container">
      <img className="logo" src="ice_cream.svg" alt="ice cream" />
      <h1 className="colorized-text">Three Flavor Ice Cream NFTs</h1>
      <p className="large-text">Each unique. Each delicious. Discover your ice cream NFT today.</p>
      <p className="medium-text">Better be quick, they are melting!</p>

      {!currentAccount && (
        <div className="connect-wallet-container">
          {renderConnectedWalletButton()}
        </div>
      )}

      {currentAccount && renderNftCounter()}

      {currentAccount && (
        <div className="mint-container">
          {!isLoading ? renderMintNftButton() : renderLoader()}
        </div>
      )}

      <p>
        <span>Find all Three Flavor Ice Cream NFTs at </span>
        <a
          href={VIEW_COLLECTION_URL}
          target="_blank"
          rel="noreferrer">
            OpenSea
        </a>
        <span>.</span>
      </p>

      {currentAccount && nftTxnHash !== "" && (
        <div>
          <p>Your NFT has been minted. See following transaction at Etherscan.</p>
          <a
            href={buildEtherscanTxnUrl()}
            target="_blank"
            rel="noreferrer">
              {buildEtherscanTxnUrl()}
          </a>
        </div>
      )}

      <div className="about-container">
        <p>
          <span>build with 🦄 </span>
          <a href="https://buildspace.so" className="colorized-text">buildspace</a>
        </p>
      </div>
    </div>
  );
}

export default App;
