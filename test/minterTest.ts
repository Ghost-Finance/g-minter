import { ethers } from 'hardhat';
import { expect } from 'chai';
import { BigNumber } from 'ethers';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/dist/src/signer-with-address';
import { parseEther } from 'ethers/lib/utils';
import { checkCreateSynthEvent, checkDepositEvent } from './util/CheckEvent';

// contract label name Minter.
let minterContractLabelString: string = 'Minter';
let tokenContractLabelString: string = 'Token';
let feedContractLabelString: string = 'Feed';
let auctionHouseContractLabelString: string = 'AuctionHouse';

// account that signs deploy txs
let contractCreatorOwner: SignerWithAddress;
let contractAccounts: SignerWithAddress[];

const amount = BigNumber.from(parseEther('10'));

describe('Minter', async function() {
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

  describe('Create a Synths', async function() {
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

      await minter.createSynth(
        'Test coin',
        'COIN',
        200,
        300,
        feedSynth.address
      );

      expect(
        await checkCreateSynthEvent(
          minter,
          'Test coin',
          'COIN',
          feedSynth.address
        )
      ).to.be.true;
      expect(await feedSynth.name()).to.equal('Feed GDAI');
      expect(await minter.getSynth(0)).to.exist;
    });
  });

  describe('Deposit Collateral', async function() {
    let amountToDeposit;

    beforeEach(async function() {
      amountToDeposit = BigNumber.from(parseEther('5'));
      const feedSynth = await Feed.deploy(amount, 'Feed Coin');
      await minter.createSynth(
        'Test coin',
        'COIN',
        200,
        300,
        feedSynth.address
      );
    });

    it('Should return error to deposit collateral if account has not collateral token to deposit', async function() {
      const account = contractAccounts[0];

      try {
        await minter
          .connect(account)
          .depositCollateral(token.address, amountToDeposit);
      } catch (error) {
        console.log(error.message);
        expect(error.message).to.be.equal(
          'VM Exception while processing transaction: revert '
        );
      }
    });

    it('Should return success when deposit the collateral', async function() {
      await minter.depositCollateral(token.address, amountToDeposit);

      expect(
        await checkDepositEvent(
          minter,
          contractCreatorOwner.address,
          token.address,
          amountToDeposit
        )
      ).to.be.true;
    });
  });
});
