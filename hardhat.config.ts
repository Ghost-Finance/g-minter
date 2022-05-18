require('dotenv').config();

import 'hardhat-deploy';
import '@nomiclabs/hardhat-ethers';
import '@nomiclabs/hardhat-etherscan';
import '@nomiclabs/hardhat-waffle';
import '@primitivefi/hardhat-dodoc';
import 'hardhat-typechain';
import 'solidity-coverage';
import { HardhatUserConfig, NetworkUserConfig } from 'hardhat/types';
import { task } from 'hardhat/config';

const {
  ALCHEMY_KEY,
  INFURA_PROJECT_URL,
  MNEMONIC_SEED,
  PRIVATE_KEY = '',
  SECOND_PRIVATE_KEY,
  ETHERSCAN_API_KEY,
  CHAIN_ID,
  GAS_PRICE,
  GAS_LIMIT,
} = process.env;

const accounts =
  PRIVATE_KEY.length > 0 ? [PRIVATE_KEY, SECOND_PRIVATE_KEY] : [];

const getNetworkConfig = (chainId: number) => {
  if (!INFURA_PROJECT_URL || !PRIVATE_KEY || !GAS_LIMIT || !GAS_PRICE) {
    return {
      url: 'please update .env file',
    } as NetworkUserConfig;
  }

  return {
    chainId,
    url: INFURA_PROJECT_URL,
    accounts: [PRIVATE_KEY, SECOND_PRIVATE_KEY],
    gas: Number(GAS_LIMIT),
    gasPrice: Number(GAS_PRICE) * 1000000000, // gwei unit
    timeout: 600 * 1000, // milliseconds
    live: true,
    saveDeployments: true,
    throwOnCallFailures: true,
    throwOnTransactionFailures: true,
    loggingEnabled: true,
  } as NetworkUserConfig;
};

task('accounts', 'Prints the list of accounts', async (args, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(await account.address);
  }
});

task('string:bytes32', 'Convert string to bytes32')
  .addParam('value', 'The string to be convertdd')
  .setAction(async (args: any, hre) => {
    if (!args?.value) return;

    console.log(hre.ethers.utils.formatBytes32String(args?.value));
  });

task('addSsm', 'Add new ssm to oracle module')
  .addParam('spot', 'Spot address')
  .addParam('ssm', 'Ssm address')
  .addParam('key', 'Bytes32 address')
  .setAction(async (args, hre) => {
    const [owner] = await hre.ethers.getSigners();
    console.log(`Owner ${owner.address}`);

    const { spot, ssm, key } = args;
    if (!spot || !ssm || !key) return;

    const GSpot = await hre.ethers.getContractFactory('GSpot');
    const Ssm = await hre.ethers.getContractFactory('Ssm');

    const gSpotContract = GSpot.attach(spot);
    const ssmContract = Ssm.attach(ssm);

    const readerRole = await ssmContract.READER_ROLE();
    await ssmContract
      .connect(owner)
      .grantRole(readerRole, gSpotContract.address);
    await gSpotContract.connect(owner).addSsm(key, ssmContract.address);

    console.log(`Add new ssm feed price for synths`);
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
    rinkeby: getNetworkConfig(Number(CHAIN_ID)),
    hardhat: {
      chainId: 1337,
      accounts: {
        mnemonic: MNEMONIC_SEED,
      },
    } as NetworkUserConfig,
    localhost: {
      chainId: 1337,
      url: 'http://127.0.0.1:7545',
      gasPrice: 5000000000000,
    } as NetworkUserConfig,
  },
} as HardhatUserConfig;

export default config;
