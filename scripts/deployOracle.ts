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

const { GSPACEX_KEY } = process.env;

const medianDeployer: DeployFunction = async () => {
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

medianDeployer.tags = [medianSpacexContractLabelString];

const gSpotDeployer: DeployFunction = async function({ deployments }) {
  const Ssm = await deployments.get(ssmContractLabelString);
  const GSpot = await ethers.getContractFactory(gSpotContractLanelString);
  const gSpot = await deployContracts(GSpot);

  if (Ssm?.address === undefined) {
    throw console.error('Ssm not found!');
  }

  await gSpot.addSsm(GSPACEX_KEY, Ssm.address);
  console.log(`Gspot address contract: ${gSpot.address}`);
  console.log(`Read price gSpot`);
};

gSpotDeployer.tags = [gSpotContractLanelString];
gSpotDeployer.dependencies = [ssmContractLabelString];

export default gSpotDeployer;
