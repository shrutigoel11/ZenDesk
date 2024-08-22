const hre = require("hardhat");

async function main() {
  await hre.run('compile');

  // Get the signer
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // Check the balance
  const balance = await deployer.getBalance();
  console.log("Account balance:", hre.ethers.utils.formatEther(balance));

  const UserProfile = await hre.ethers.getContractFactory("UserProfile");
  console.log("Deploying UserProfile...");
  const userProfile = await UserProfile.deploy();

  await userProfile.deployed();

  console.log("UserProfile deployed to:", userProfile.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });