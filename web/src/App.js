import { useEffect, useState } from "react";
import { ethers } from "ethers";

import "./App.css";

import contractMeta from "./contract_meta.json";

const TWITTER_HANDLE = '_buildspace';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const CONTRACT_ADDRESS = "0x0d6F479CADd728B87FD60E9748d049ebE0EAC14D";

export default function App() {

  const [currentAccount, setCurrentAccount] = useState("");

  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;

    // Check if we have access to window.ethereum
    if (!ethereum) {
      console.log("Make sure you have MetaMask!");
      return
    }

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
    } catch (error) {
      console.log(error)
    }
  }

  const askContractToMintNft = async () => {
    try {
      // Get contract
      const myEpicNftContract = createContract();

      // Execute the mint on contract
      let nftTxn = await myEpicNftContract.makeAnEpicNFT();

      // Wait for mining of transaction
      console.log("Mining ... please wait.")
      await nftTxn.wait();
      
      // Log Etherscan URL
      const ethScanUrl = `https://rinkeby.etherscan.io/tx/${nftTxn.hash}`;
      console.log("NFT minted, see transaction: ", ethScanUrl);
    } catch (error) {
      console.log(error)
    }
  }

  function createContract() {
    // Get Web3 provider/signer
    const { ethereum } = window;
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();

    // Get contract
    return new ethers.Contract(CONTRACT_ADDRESS, contractMeta.abi, signer);
  }

  const renderConnectedWalletContainer = () => (
    <button onClick={connectWallet} className="connect-wallet-button">
      Connect to Wallet
    </button>
  );

  const renderMintContainer = () => (
    <button onClick={askContractToMintNft} className="mint-button">
      Mint NFT
    </button>
  );

  return (
    <div className="main-container">
      <div className="header-container">
        <h1 className="gradient-text">My NFT Collection</h1>
        <p>
          Each unique. Each beautiful. Discover your NFT today.
        </p>
        {currentAccount === "" ? renderConnectedWalletContainer() : renderMintContainer()}
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
