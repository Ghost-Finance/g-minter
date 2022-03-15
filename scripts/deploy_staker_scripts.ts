import { artifacts, ethers } from 'hardhat';
import { ContractFactory } from 'ethers';
import * as fs from 'fs';
import * as fse from 'fs-extra';
import { task } from 'hardhat/config';
import { deployContracts, saveFrontendFiles } from './utils';

let updateHouseContractLanelString: string = 'UpdateHouse';
let debtPoolContractLanelString: string = 'DebtPool';

const main = async function() {
  const { MINTER_CONTRACT, GDAI_TOKEN, GSPOT_CONTRACT } = process.env;
  if (!MINTER_CONTRACT || !GDAI_TOKEN || !GSPOT_CONTRACT) return;

  const debtPool = await deployContracts(
    debtPoolContractLanelString,
    GDAI_TOKEN,
    MINTER_CONTRACT
  );
  const updateHouse = await deployContracts(
    updateHouseContractLanelString,
    GDAI_TOKEN,
    GSPOT_CONTRACT,
    debtPool.address
  );

  await updateHouse.setVault();
  await debtPool.addUpdatedHouse(updateHouse.address);

  console.log(`UpdateHouse address: ${updateHouse.address}`);
  console.log(`PositionVault address: ${await updateHouse.getVault()}`);
  console.log(`DebtPool address: ${debtPool.address}`);

  saveFrontendFiles(
    updateHouse.address,
    updateHouseContractLanelString,
    updateHouseContractLanelString
  );

  saveFrontendFiles(
    debtPool.address,
    debtPoolContractLanelString,
    debtPoolContractLanelString
  );
};

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
