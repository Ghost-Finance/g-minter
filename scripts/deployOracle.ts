import { artifacts, ethers } from 'hardhat';
import { ContractFactory } from 'ethers';
import * as fs from 'fs';
import * as fse from 'fs-extra';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { formatEther } from 'ethers/lib/utils';
import { deployContracts } from './utils';

let medianSpacexContractLabelString: string = 'MedianSpacex';
let ssmContractLabelString: string = 'Ssm';
let gSpotContractLanelString: string = 'gSpot';

const { GSPACEX_KEY, SSM_ADDRESS } = process.env;

const main = async () => {
  const [deployer, testUser] = await ethers.getSigners();

  console.log('Account 0 Deployer Address:', deployer.address);
  console.log(
    'Account 0 Deployer balance:',
    formatEther(await deployer.getBalance())
  );

  console.log('Account 1 user address:', testUser.address);

  // Deploy contracts
  const Median = await ethers.getContractFactory(
    medianSpacexContractLabelString
  );
  const Ssm = await ethers.getContractFactory(ssmContractLabelString);
  const GSpot = await ethers.getContractFactory(gSpotContractLanelString);

  const median = await deployContracts(Median);
  const ssm = await deployContracts(Ssm, median.address);
  const gSpot = await deployContracts(GSpot);

  await gSpot.addSsm(GSPACEX_KEY, ssm.address);

  console.log(`MedianSpaceX address contract: ${median.address}`);
  console.log(`Feed 2 address contract: ${ssm.address}`);
  console.log(`Token address contract: ${gSpot.address}`);
};

const gSpotDeployer: DeployFunction = async function() {
  const GSpot = await ethers.getContractFactory(gSpotContractLanelString);
  const gSpot = await deployContracts(GSpot);

  await gSpot.addSsm(GSPACEX_KEY, SSM_ADDRESS);
  console.log(`Token address contract: ${gSpot.address}`);
};

export default gSpotDeployer;
gSpotDeployer.tags = ['GSpot'];

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
