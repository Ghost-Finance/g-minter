require('dotenv').config();

import { HardhatUserConfig } from 'hardhat/types';
import 'hardhat-deploy';
import '@nomiclabs/hardhat-ethers';
import '@nomiclabs/hardhat-etherscan';
import { task } from 'hardhat/config';
import '@nomiclabs/hardhat-waffle';
import 'hardhat-typechain';

const INFURA_PROJECT_ID =
  process.env.INFURA_PROJECT_ID || 'ad00fd516c774c208f606b37cf984a3b';
const MNEMONIC_SEED = process.env.MNEMONIC_SEED || '';
const PRIVATE_KEY = process.env.PRIVATE_KEY || '';
const SECOND_PRIVATE_KEY = process.env.SECOND_PRIVATE_KEY || '';
const ALCHEMY_KEY = process.env.ALCHEMY_KEY || '';

const accounts =
  PRIVATE_KEY.length > 0 ? [PRIVATE_KEY, SECOND_PRIVATE_KEY] : [];

task('accounts', 'Prints the list of accounts', async (args, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(await account.address);
  }
});

const config: HardhatUserConfig = {
  solidity: {
    version: '0.8.0',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },

  mocha: {
    timeout: 150000,
  },

  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },

  networks: {
    rinkeby: {
      url: `https://rinkeby.infura.io/v3/${INFURA_PROJECT_ID}`,
      accounts: accounts,
      live: true,
      saveDeployments: true,
    },
    hardhat: {
      // chainId: 1337,
      // accounts: {
      //   mnemonic: MNEMONIC_SEED,
      // },
    },
    localhost: {
      chainId: 1337,
      url: 'http://127.0.0.1:9545',
      gasPrice: 50000000000,
    },
  },
};

export default config;
