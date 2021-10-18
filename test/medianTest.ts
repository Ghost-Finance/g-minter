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
    mnemonic,
    mnemonicWallet,
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

    mnemonic =
      'radar blur cabbage chef fix engine embark joy scheme fiction master release';
    mnemonicWallet = ethers.Wallet.fromMnemonic(mnemonic);
  });

  it.only('#recovery', async function() {
    const accountAddress = await accountOne.address;
    const hash = await ethers.utils.keccak256(accountAddress);
    const signature = await accountOne.signMessage(ethers.utils.arrayify(hash));
    const [v, r, s] = await signer.split(signature);

    const timestamp = new Date().getTime();
    const expectedSignatureHash = ethers.utils.solidityKeccak256(
      ['string', 'string', 'string'],
      [BigNumber.from(parseEther('120.0')), timestamp, 'SPACEX']
    );

    const signatureAccountOne = await median.recover(
      BigNumber.from(parseEther('120.0')),
      timestamp,
      v,
      r,
      s
    );

    console.log(signatureAccountOne);
  });
});
