const hre = require("hardhat");

async function main() {
  console.log("Deploying HerbTrace contract...");

  // Get the contract factory
  const HerbTrace = await hre.ethers.getContractFactory("HerbTrace");

  // Deploy the contract
  const herbTrace = await HerbTrace.deploy();

  // Wait for deployment to complete
  await herbTrace.waitForDeployment();

  const contractAddress = await herbTrace.getAddress();
  
  console.log("HerbTrace contract deployed to:", contractAddress);
  console.log("Network:", hre.network.name);
  
  // Save deployment info
  const fs = require('fs');
  const deploymentInfo = {
    contractAddress: contractAddress,
    network: hre.network.name,
    deployedAt: new Date().toISOString(),
    abi: HerbTrace.interface.format('json')
  };
  
  fs.writeFileSync(
    './deployment-info.json', 
    JSON.stringify(deploymentInfo, null, 2)
  );
  
  console.log("Deployment info saved to deployment-info.json");
  console.log("\nTo use this contract in your web app:");
  console.log(`1. Add this to your .env.local file:`);
  console.log(`   NEXT_PUBLIC_CONTRACT_ADDRESS=${contractAddress}`);
  console.log(`2. Make sure Ganache is running on http://127.0.0.1:7545`);
  console.log(`3. Import one of the Ganache accounts into MetaMask`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });