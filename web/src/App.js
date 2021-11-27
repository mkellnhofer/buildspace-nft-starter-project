import { useEffect, useState } from "react";
import { ethers } from "ethers";

import "./App.css";

import contractMeta from "./contract_meta.json";

const TWITTER_HANDLE = '_buildspace';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const CONTRACT_ADDRESS = "0xF4Ee9052BA82C66d44f074a0a843E9D33D5bE117";

const VIEW_COLLECTION_URL = "https://testnets.opensea.io/collection/threeflavoricecreamnft-y1nal595gq";

export default function App() {

  const [currentAccount, setCurrentAccount] = useState("");

  const [maxNftCount, setMaxNftCount] = useState(0);
  const [mintedNftCount, setMintedNftCount] = useState(0);

  const [isLoading, setIsLoading] = useState(false);

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
  }

  // This runs our function when the page loads
  useEffect(() => {
    checkIfWalletIsConnected();
  });

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
  }

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
  }

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
      
      // Log Etherscan URL
      const ethScanUrl = `https://rinkeby.etherscan.io/tx/${nftTxn.hash}`;
      console.log("NFT minted, see transaction: ", ethScanUrl);
    } catch (error) {
      console.log(error)
    }
  }

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
  }

  // This runs our function when the page loads
  useEffect(() => {
    registerOnNewNftMintedHandler();
  });

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
    <button className="button connect-wallet-button" onClick={connectWallet}>
      Connect to Wallet
    </button>
  );

  const renderMintNftButton = () => (
    <button
      className="button mint-button"
      disabled={isLoading}
      onClick={mintNft}>
      Mint NFT
    </button>
  );

  const renderViewButton = () => (
    <a
      className="link-button view-button"
      href={VIEW_COLLECTION_URL}
      target="_blank"
      rel="noreferrer">
      🌊 View Collection on OpenSea
    </a>
  )

  return (
    <div className="main-container">
      <div className="header-container">
        <h1 className="gradient-text">My NFT Collection</h1>
        <p>
          Each unique. Each beautiful. Discover your NFT today.
        </p>
        {!currentAccount && (
          <div className="center-container">
            {renderConnectedWalletButton()}
          </div>
        )}
        {currentAccount && (
          <div className="center-container">
            {renderNftCounter()}
            {renderMintNftButton()}
        
            <div className={isLoading ? "loader loader-on" : "loader loader-off"} />

            {renderViewButton()}
          </div>
        )}
      </div>
      <div className="footer-container">
        <img className="twitter-logo" src="twitter-logo.svg" alt="Twitter Logo" />
        <a
          className="twitter-text"
          href={TWITTER_LINK}
          target="_blank"
          rel="noreferrer"
        >{`built on @${TWITTER_HANDLE}`}</a>
      </div>
    </div>
  );
}
