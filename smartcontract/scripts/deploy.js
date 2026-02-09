const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  // Deploy IncomeRegistry
  const IncomeRegistry = await ethers.getContractFactory("IncomeRegistry");
  const incomeRegistry = await IncomeRegistry.deploy();
  await incomeRegistry.waitForDeployment();
  console.log("IncomeRegistry deployed to:", await incomeRegistry.getAddress());

  // Deploy CredentialNFT
  const CredentialNFT = await ethers.getContractFactory("CredentialNFT");
  const credentialNFT = await CredentialNFT.deploy();
  await credentialNFT.waitForDeployment();
  console.log("CredentialNFT deployed to:", await credentialNFT.getAddress());

  // Set the deployer as an authorized verifier in IncomeRegistry
  await incomeRegistry.setVerifierStatus(deployer.address, true);
  console.log("Deployer set as authorized verifier in IncomeRegistry");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
