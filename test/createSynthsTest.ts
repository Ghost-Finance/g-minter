import { ethers } from 'hardhat';
import { expect } from 'chai';
import { BigNumber } from 'ethers';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/dist/src/signer-with-address';
import { parseEther } from 'ethers/lib/utils';
import { deployContract, isValidContract } from './util/DeployContract';

// contract label name Minter.
let minterContractLabelString: string = 'Minter';
let tokenContractLabelString: string = 'Token';
let feedContractLabelString: string = 'Feed';
let auctionHouseContractLabelString: string = 'AuctionHouse';

// account that signs deploy txs
let contractCreatorOwner: SignerWithAddress;
let contractAccounts: SignerWithAddress[];

const amount = BigNumber.from(parseEther('10'));

describe.only('Minter create a synths', async function() {
  let owners,
    accounts,
    Token,
    Feed,
    Minter,
    AuctionHouse,
    minter,
    token,
    feed,
    auctionHouse;

  beforeEach(async () => {
    [owners, ...accounts] = await ethers.getSigners();
    contractCreatorOwner = owners;
    contractAccounts = accounts;

    // Declare contracts
    Token = await ethers.getContractFactory(tokenContractLabelString);
    Feed = await ethers.getContractFactory(feedContractLabelString);
    AuctionHouse = await ethers.getContractFactory(
      auctionHouseContractLabelString
    );
    Minter = await ethers.getContractFactory(minterContractLabelString);

    // Deploy contracts
    token = await Token.deploy('erc20 coin', 'Token');
    feed = await Feed.deploy(parseEther('10'), 'Feed Token');
    auctionHouse = await AuctionHouse.deploy();
    minter = await Minter.deploy(
      token.address,
      feed.address,
      auctionHouse.address
    );

    await token.approve(minter.address, amount);
    await token.mint(contractCreatorOwner.address, amount);
  });

  it('Should return error to create a synth if is not a owner', async function() {
    const feedSynth = await Feed.deploy(amount, 'Feed Coin');
    const account = contractAccounts[0];

    try {
      await minter
        .connect(account)
        .createSynth('Test coin', 'COIN', 100, 200, feedSynth.address);
    } catch (error) {
      expect(error.message).to.be.equal(
        'VM Exception while processing transaction: revert unauthorized'
      );
    }
  });

  it('Should return error if cRatioPassive is less or equal a cRatioActive', async function() {
    const feedSynth = await Feed.deploy(amount, 'Feed Coin');

    try {
      await minter.createSynth(
        'Test coin',
        'COIN',
        300,
        200,
        feedSynth.address
      );
    } catch (error) {
      expect(error.message).to.be.equal(
        'VM Exception while processing transaction: revert Invalid cRatioActive'
      );
    }
  });

  it('Success on create a new Synth', async function() {
    const feedSynth = await Feed.deploy(amount, 'Feed GDAI');

    await minter.createSynth('Test coin', 'COIN', 200, 300, feedSynth.address);

    expect(await feedSynth.name()).to.equal('Feed GDAI');
    expect(await minter.getSynth(0)).to.exist;
  });
});
