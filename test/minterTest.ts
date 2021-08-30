import { ethers } from 'hardhat';
import { expect } from 'chai';
import { BigNumber } from 'ethers';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/dist/src/signer-with-address';
import { parseEther } from 'ethers/lib/utils';
import {
  checkCreateSynthEvent,
  checkDepositEvent,
  checkMintEvent,
} from './util/CheckEvent';

// contract label name Minter.
let minterContractLabelString: string = 'Minter';
let tokenContractLabelString: string = 'GTokenERC20';
let feedContractLabelString: string = 'Feed';
let auctionHouseContractLabelString: string = 'AuctionHouse';

// account that signs deploy txs
let contractCreatorOwner: SignerWithAddress;
let contractAccounts: SignerWithAddress[];

const amount = BigNumber.from(parseEther('10'));

describe('Minter', async function() {
  let owners,
    accounts,
    TokenERC20,
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
    TokenERC20 = await ethers.getContractFactory(tokenContractLabelString);
    Feed = await ethers.getContractFactory(feedContractLabelString);
    AuctionHouse = await ethers.getContractFactory(
      auctionHouseContractLabelString
    );
    Minter = await ethers.getContractFactory(minterContractLabelString);

    // Deploy contracts
    token = await TokenERC20.deploy('erc20 coin', 'Token', amount);
    feed = await Feed.deploy(parseEther('10'), 'Feed Token');
    auctionHouse = await AuctionHouse.deploy();
    minter = await Minter.deploy(
      token.address,
      feed.address,
      auctionHouse.address
    );

    await token.approve(minter.address, amount);
  });

  describe('Create a Synths', async function() {
    it('Should return error to create a synth if is not a owner', async function() {
      const feedSynth = await Feed.deploy(amount, 'Feed Coin');
      const account = contractAccounts[0];

      try {
        await minter
          .connect(account)
          .createSynth(
            'Test coin',
            'COIN',
            amount,
            100,
            200,
            feedSynth.address
          );
      } catch (error) {
        expect(error.message).to.match(/unauthorized/);
      }
    });

    it('Should return error if cRatioPassive is less or equal a cRatioActive', async function() {
      const feedSynth = await Feed.deploy(amount, 'Feed Coin');

      try {
        await minter.createSynth(
          'Test coin',
          'COIN',
          amount,
          300,
          200,
          feedSynth.address
        );
      } catch (error) {
        expect(error.message).to.match(/Invalid cRatioActive/);
      }
    });

    it('Success on create a new Synth', async function() {
      const feedSynth = await Feed.deploy(amount, 'Feed GDAI');

      await minter.createSynth(
        'Test coin',
        'COIN',
        amount,
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
    let tokenSynth, amountToDeposit;

    beforeEach(async function() {
      amountToDeposit = BigNumber.from(parseEther('5'));
      const feedSynth = await Feed.deploy(amount, 'Feed Coin');
      await minter.createSynth(
        'Test coin',
        'COIN',
        amount,
        200,
        300,
        feedSynth.address
      );

      tokenSynth = await minter.getSynth(0);
    });

    it('Should return error to deposit collateral if account has not collateral token to deposit', async function() {
      const account = contractAccounts[0];

      try {
        await minter
          .connect(account)
          .depositCollateral(tokenSynth, amountToDeposit);
      } catch (error) {
        expect(error.message).to.match(
          /ERC20: transfer amount exceeds balance/
        );
      }
    });

    it('Should return error to deposit collateral if is a invalid token', async function() {
      try {
        await minter.depositCollateral(token.address, amountToDeposit);
      } catch (error) {
        expect(error.message).to.match(/invalid token/);
      }
    });

    it('Should return success when deposit the collateral', async function() {
      await minter.depositCollateral(tokenSynth, amountToDeposit);

      expect(
        await checkDepositEvent(
          minter,
          contractCreatorOwner.address,
          tokenSynth,
          amountToDeposit
        )
      ).to.be.true;
    });
  });

  describe('Mint a token', async function() {
    let tokenSynth, amountToMint;

    beforeEach(async function() {
      amountToMint = BigNumber.from(parseEther('10'));
      const feedSynth = await Feed.deploy(amount, 'Feed Coin');
      await minter.createSynth(
        'Test coin',
        'COIN',
        amount,
        200,
        300,
        feedSynth.address
      );

      tokenSynth = await minter.getSynth(0);
    });

    it("Should return error to mint if account hasn't the collateral balance", async function() {
      try {
        await minter.mint(tokenSynth, amountToMint);
      } catch (error) {
        expect(error.message).to.match(/Without collateral deposit/);
      }
    });

    it('Should return error to mint if account has below cRatio', async function() {
      await minter.depositCollateral(tokenSynth, parseEther('10'));
      await feed.updatePrice(parseEther('5'));

      try {
        await minter.mint(tokenSynth, amountToMint);
      } catch (error) {
        expect(error.message).to.match(/below cRatio/);
      }
    });

    it('Should return error to mint if token minted is the same as collateral', async function() {
      await minter.depositCollateral(tokenSynth, parseEther('10'));

      try {
        await minter.mint(token.address, amountToMint);
      } catch (error) {
        expect(error.message).to.match(/invalid token/);
      }
    });

    it('Should return success when mint a synth', async function() {
      const value = BigNumber.from(parseEther('5'));
      await minter.depositCollateral(tokenSynth, parseEther('10'));
      await minter.mint(tokenSynth, value);

      expect(await checkMintEvent(minter, contractCreatorOwner.address, value))
        .to.be.true;
    });
  });
});
