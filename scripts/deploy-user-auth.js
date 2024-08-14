const hre = require("hardhat");

async function main() {
  const UserAuth = await hre.ethers.getContractFactory("UserAuth");
  const userAuth = await UserAuth.deploy();

  await userAuth.deployed();

  console.log("UserAuth deployed to:", userAuth.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });