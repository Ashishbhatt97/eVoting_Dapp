import fs from "fs";
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const privateKey = fs.readFileSync(".privateKey").toString().trim();
const url = fs.readFileSync(".alchemyUrl").toString().trim();
const etherscan = fs.readFileSync(".etherscan").toString().trim();

const config: HardhatUserConfig = {
  solidity: "0.8.24",
  networks: {
    sepolia: {
      url,
      accounts: [`${privateKey}`],
    },
  },
  etherscan: {
    apiKey: etherscan,
  },
  sourcify: {
    enabled: true,
  },
};

export default config;
