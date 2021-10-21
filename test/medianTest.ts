import { ethers } from 'hardhat';
import { expect } from 'chai';
import { set, reset } from 'mockdate';
import { BigNumber } from 'ethers';
import { checkLogMedianPriceEvent } from './util/CheckEvent';
import { parseEther } from 'ethers/lib/utils';
import { signerMessage } from './util/FeedSigners';

let medianContractLabel: string = 'MedianSpacex';
let signerContractLabel: string = 'Signature';

describe('#MedianSpacex', async function() {
  let Median,
    Signature,
    median,
    mnemonic,
    signer,
    owner,
    accountOne,
    accountTwo,
    accountThree,
    accounts,
    others,
    wallet;

  const date = new Date('2020-10-19T09:00:11.451Z');

  beforeEach(async function() {
    set(date);
    [owner, ...accounts] = await ethers.getSigners();
    [accountOne, accountTwo, accountThree, ...others] = accounts;

    Median = await ethers.getContractFactory(medianContractLabel);
    Signature = await ethers.getContractFactory(signerContractLabel);
    median = await Median.deploy();
    signer = await Signature.deploy();

    mnemonic =
      'radar blur cabbage chef fix engine embark joy scheme fiction master release';
    wallet = ethers.Wallet.fromMnemonic(mnemonic);
  });

  afterEach(async function() {
    reset();
  });

  it('#addOracle validate only owner can add a new oracle', async function() {
    try {
      await median.connect(accountOne).addOracle(wallet.address);
    } catch (error) {
      expect(error.message).to.match(/caller is not the owner/);
    }
  });

  it('#addOracle should return success add a new new oracle', async function() {
    await median.addOracle(wallet.address);

    expect(await median.oracle(wallet.address)).to.be.equal(1);
  });

  // it.only('#poke validates feed', async function() {});

  it.only('#poke should return ', async function() {
    [accountOne.address, accountTwo.address, accountThree.address].map(
      async address => await median.addOracle(address)
    );
    const timestamp = date.getTime();
    const sigOne = await signerMessage(accountOne, {
      value: BigNumber.from(parseEther('11')),
      timestamp: timestamp,
      type: 'SPACEX',
    });
    const sigTwo = await signerMessage(accountTwo, {
      value: BigNumber.from(parseEther('12')),
      timestamp: timestamp,
      type: 'SPACEX',
    });
    const sigThree = await signerMessage(accountThree, {
      value: BigNumber.from(parseEther('13')),
      timestamp: timestamp,
      type: 'SPACEX',
    });
    const feedData = [
      {
        value: BigNumber.from(parseEther('11')),
        timestamp: timestamp.toString(),
        v: sigOne.v,
        r: sigOne.r,
        s: sigOne.s,
      },
      {
        value: BigNumber.from(parseEther('12')),
        timestamp: timestamp.toString(),
        v: sigTwo.v,
        r: sigTwo.r,
        s: sigTwo.s,
      },
      {
        value: BigNumber.from(parseEther('13')),
        timestamp: timestamp.toString(),
        v: sigThree.v,
        r: sigThree.r,
        s: sigThree.s,
      },
    ];

    let tx = await median.poke(feedData);
    let receipt = await tx.wait();

    // Check event
    const block = await median.provider.getBlock(receipt.blockHash);
    expect(feedData[1].value.toString()).to.be.equal(
      receipt.events[0].args.val.toString()
    );
    expect(block.timestamp).to.be.equal(receipt.events[0].args.age.toNumber());
  });

  it('#recovery Should return signer addreess', async function() {
    const timestamp = date.getTime();
    const hash = ethers.utils.keccak256(
      ethers.utils.defaultAbiCoder.encode(
        ['uint256', 'uint256', 'bytes32'],
        [
          BigNumber.from(parseEther('12')),
          timestamp.toString(),
          ethers.utils.formatBytes32String('SPACEX'),
        ]
      )
    );
    const signature = await wallet.signMessage(ethers.utils.arrayify(hash));
    const sig = ethers.utils.splitSignature(signature);
    console.log(sig.v, sig.r, sig.s);

    const signatureAccountOne = await median.recover(
      BigNumber.from(parseEther('12')),
      timestamp.toString(),
      sig.v,
      sig.r,
      sig.s
    );

    expect(wallet.address).to.be.equal(signatureAccountOne);
  });
});
