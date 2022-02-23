import { ethers } from 'hardhat';
import { deployContracts } from './utils';

let ssmContractLabelString: string = 'Ssm';

const main = async () => {
  if (!process.env.MEDIAN_CONTRACT) {
    throw console.error('MEDIAN env not be blank!');
    return;
  }

  try {
    const { MEDIAN_CONTRACT } = process.env;
    const median = await deployContracts(MEDIAN_CONTRACT);
    const ssm = await deployContracts(ssmContractLabelString, median.address);

    console.log(`${MEDIAN_CONTRACT} address: ${median.address}`);
    console.log(`Ssm address: ${ssm.address}`);
  } catch (error) {
    throw console.error(error.message);
  }
};

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
