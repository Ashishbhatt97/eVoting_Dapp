import hre from "hardhat";

(async () => {
  try {
    const contract = await hre.ethers.getContractFactory("eVoting");
    const eVotingContractInstance = await contract.deploy();

    console.log(await eVotingContractInstance.getAddress());
  } catch (error) {
    console.log(error);
    process.exitCode = 1;
  }
})();
