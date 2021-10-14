import { ethers } from 'hardhat';
import { expect } from 'chai';
import { BigNumber } from 'ethers';
import { parseEther } from 'ethers/lib/utils';

let medianContractLabel: string = 'Median';

describe('#Median', async function() {
  let Median, median;

  beforeEach(async function() {
    const [owner, ...accounts] = await ethers.getSigners();
    const [accountOne, accountTwo, accountThree, ...others] = accounts;

    Median = await ethers.getContractFactory(medianContractLabel);
    median = await Median.deploy();
  });

  it('recovery', async function() {
    const timestamp = new Date().getTime();
    let messageHash = ethers.utils.solidityKeccak256([
      BigNumber.from(parseEther('120.0')),
      timestamp,
      'spacex',
    ]);
    console.log(messageHash);
  });
});
