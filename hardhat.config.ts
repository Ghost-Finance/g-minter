require('dotenv').config();

import 'hardhat-deploy';
import '@nomiclabs/hardhat-ethers';
import '@nomiclabs/hardhat-etherscan';
import '@nomiclabs/hardhat-waffle';
import 'hardhat-typechain';
import 'solidity-coverage';
import { HardhatUserConfig } from 'hardhat/types';
import { task } from 'hardhat/config';
import { formatEther } from '@ethersproject/units';

const {
  ALCHEMY_KEY,
  INFURA_PROJECT_ID,
  MNEMONIC_SEED,
  PRIVATE_KEY = '',
  SECOND_PRIVATE_KEY,
  ETHERSCAN_API_KEY,
} = process.env;

const accounts =
  PRIVATE_KEY.length > 0 ? [PRIVATE_KEY, SECOND_PRIVATE_KEY] : [];

task('accounts', 'Prints the list of accounts', async (args, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(await account.address);
  }
});

task('string:bytes32', 'Convert string to bytes32', async (args: any, hre) => {
  if (!args?.value) return;

  console.log(hre.ethers.utils.formatBytes32String(args?.value));
});

task('addSsm', 'Add new ssm to oracle module').setAction(async (args, hre) => {
  const [owner] = await hre.ethers.getSigners();
  console.log(`Owner ${owner.address}`);

  const { spot, ssm, key } = args;
  if (!spot || !ssm || !key) return;
  console.log(spot);
  console.log(ssm);
  console.log(key);

  // const GSpot = await hre.ethers.getContractFactory('GSpot');

  // const gSpot = GSpot.attach(spot);
  // await gSpot.connect(owner).addSsm(key, ssm);

  // console.log(`Fetch price: ${formatEther(await gSpot.read())}`);
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
    apiKey: ETHERSCAN_API_KEY,
  },

  networks: {
    rinkeby: {
      url: `https://rinkeby.infura.io/v3/${INFURA_PROJECT_ID}`,
      // url:
      //   'https://eth-rinkeby.alchemyapi.io/v2/I3n9-yYF98CHuv4s36G0rjfJeW6rwfDI',
      accounts: accounts,
      live: true,
      saveDeployments: true,
      gas: 12500000,
      gasPrice: 1000000012,
    },
    hardhat: {
      chainId: 1337,
      accounts: {
        mnemonic: MNEMONIC_SEED,
      },
    },
    localhost: {
      chainId: 1337,
      url: 'http://127.0.0.1:7545',
      gasPrice: 5000000000000,
    },
  },
};

export default config;
