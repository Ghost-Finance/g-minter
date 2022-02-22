import { artifacts, ethers } from 'hardhat';
import { ContractFactory } from 'ethers';
import * as fs from 'fs';
import * as fse from 'fs-extra';
import { task } from 'hardhat/config';
import { deployContracts, saveFrontendFiles } from './utils';

let gSpotContractLanelString: string = 'GSpot';

const main = async function() {
  const gSpot = await deployContracts(gSpotContractLanelString);
  console.log(`GSpot address: ${gSpot.address}`);

  saveFrontendFiles(
    gSpot.address,
    gSpotContractLanelString,
    gSpotContractLanelString
  );
};

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
