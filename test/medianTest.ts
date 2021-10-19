import { ethers } from 'hardhat';
import { expect } from 'chai';
import { BigNumber } from 'ethers';
import { parseEther } from 'ethers/lib/utils';

let medianContractLabel: string = 'MedianSpacex';
let signerContractLabel: string = 'Signature';

describe('#MedianSpacex', async function() {
  let Median,
    Signature,
    median,
    signer,
    owner,
    accountOne,
    accountTwo,
    accountThree,
    accounts,
    others;

  beforeEach(async function() {
    [owner, ...accounts] = await ethers.getSigners();
    [accountOne, accountTwo, accountThree, ...others] = accounts;

    Median = await ethers.getContractFactory(medianContractLabel);
    Signature = await ethers.getContractFactory(signerContractLabel);
    median = await Median.deploy();
    signer = await Signature.deploy();
  });

  it('#recovery', async function() {
    const timestamp = new Date().getTime();
    const accountAddress = await accountOne.address;
    const hash = await ethers.utils.keccak256(
      ethers.utils.defaultAbiCoder.encode(
        ['string', 'string', 'string'],
        ['12', timestamp.toString(), 'SPACEX']
      )
    );
    const signature = await accountOne.signMessage(
      '\x19Ethereum Signed Message:\n32',
      hash,
      accountAddress
    );
    const [v, r, s] = await signer.split(signature);

    // const keccakFirstLevel = ethers.utils.solidityKeccak256(
    //   ['string', 'string', 'string'],
    //   [BigNumber.from(parseEther('120.0')), timestamp, 'SPACEX']
    // );
    // console.log(keccakFirstLevel);
    // const keccakSecondLevel = ethers.utils.solidityKeccak256(
    //   ['string', 'string'],
    //   [
    //     ethers.utils.defaultAbiCoder.encode(
    //       ['string'],
    //       ['\x19Ethereum Signed Message:\n32']
    //     ),
    //     keccakFirstLevel,
    //   ]
    // );
    // console.log(keccakSecondLevel);

    const signatureAccountOne = await median.recover('12', timestamp, v, r, s);
    console.log(signatureAccountOne);
    expect(accountOne.address).to.be.equal(signatureAccountOne);
  });
});
