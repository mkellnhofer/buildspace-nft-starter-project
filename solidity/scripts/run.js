async function main() {
  const nftContractFactory = await hre.ethers.getContractFactory("MyEpicNFT");
  const nftContract = await nftContractFactory.deploy();
  await nftContract.deployed();

  let txn1 = await nftContract.makeAnEpicNFT();
  await txn1.wait();

  let txn2 = await nftContract.makeAnEpicNFT();
  await txn2.wait();

  maxNftCount = await nftContract.getMaxEpicNFTCount();
  mintedNftCount = await nftContract.getMintedEpicNFTCount();
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
