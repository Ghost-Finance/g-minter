import { ethers } from 'hardhat';
import { expect } from 'chai';
import { BigNumber } from 'ethers';
import { parseEther } from 'ethers/lib/utils';

let medianContractLabel: string = 'Median';
let signerContractLabel: string = 'Signature';

describe('#Median', async function() {
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
    const publicKey = ethers.utils.recoverPrivateKey(hash, signature);
    console.log(publicKey);
    const [r, s, v] = await signer.extractRSV(publicKey);
    console.log(r);
    console.log(s);
    console.log(v);

    const timestamp = new Date().getTime();
    const expectedSignatureHash = ethers.utils.solidityKeccak256(
      ['string', 'string', 'string'],
      [BigNumber.from(parseEther('120.0')), timestamp, 'spacex']
    );

    const signatureAccountOne = await median
      .connect(accountOne)
      .recover(BigNumber.from(parseEther('120.0')), timestamp, v, r, s);

    console.log(signatureAccountOne);
  });
});
