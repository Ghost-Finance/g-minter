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
import setup from './util/setup';

const amount = BigNumber.from(parseEther('10'));

describe('Minter', async function() {
  let state;

  beforeEach(async function() {
    state = await setup();
  });

  describe('Create a Synths', async function() {
    it('Should return error to create a synth if is not a owner', async function() {
      const feedSynth = await state.Feed.deploy(amount, 'Feed Coin');
      const account = state.contractAccounts[0];

      try {
        await state.minter
          .connect(account)
          .createSynth('Test coin', 'COIN', 100, 200, feedSynth.address);
      } catch (error) {
        expect(error.message).to.match(/unauthorized/);
      }
    });

    it('Should return error if cRatioPassive is less or equal a cRatioActive', async function() {
      const feedSynth = await state.Feed.deploy(amount, 'Feed Coin');

      try {
        await state.minter.createSynth(
          'Test coin',
          'COIN',
          300,
          200,
          feedSynth.address
        );
      } catch (error) {
        expect(error.message).to.match(/Invalid cRatioActive/);
      }
    });

    it('Success on create a new Synth', async function() {
      const feedSynth = await state.Feed.deploy(amount, 'Feed GDAI');

      await state.minter.createSynth(
        'Test coin',
        'COIN',
        200,
        300,
        feedSynth.address
      );

      expect(
        await checkCreateSynthEvent(
          state.minter,
          'Test coin',
          'COIN',
          feedSynth.address
        )
      ).to.be.true;
      expect(await feedSynth.name()).to.equal('Feed GDAI');
      expect(await state.minter.getSynth(0)).to.exist;
    });
  });

  describe('Deposit Collateral', async function() {
    let tokenSynth, amountToDeposit;

    beforeEach(async function() {
      amountToDeposit = BigNumber.from(parseEther('5'));
      const feedSynth = await state.Feed.deploy(amount, 'Feed Coin');
      await state.minter.createSynth(
        'Test coin',
        'COIN',
        200,
        300,
        feedSynth.address
      );

      tokenSynth = await state.minter.getSynth(0);
    });

    it('Should return error to deposit collateral if account has not collateral token to deposit', async function() {
      const account = state.contractAccounts[0];

      try {
        await state.minter
          .connect(account)
          .depositCollateral(tokenSynth, amountToDeposit);
      } catch (error) {
        expect(error.message).to.match(/revert/);
      }
    });

    it('Should return error to deposit collateral if is a invalid token', async function() {
      try {
        await state.minter.depositCollateral(
          state.token.address,
          amountToDeposit
        );
      } catch (error) {
        expect(error.message).to.match(/invalid token/);
      }
    });

    it('Should return success when deposit the collateral', async function() {
      await state.minter.depositCollateral(tokenSynth, amountToDeposit);

      expect(
        await checkDepositEvent(
          state.minter,
          state.contractCreatorOwner.address,
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
      const feedSynth = await state.Feed.deploy(amount, 'Feed Coin');
      await state.minter.createSynth(
        'Test coin',
        'COIN',
        200,
        300,
        feedSynth.address
      );

      tokenSynth = await state.minter.getSynth(0);
    });

    it('Should return error to mint if account has deposit collareal', async function() {
      try {
        await state.minter.mint(tokenSynth, amountToMint);
      } catch (error) {
        expect(error.message).to.match(/Without collateral deposit/);
      }
    });

    it('Should return error to mint if account has below cRatio', async function() {
      await state.minter.depositCollateral(tokenSynth, parseEther('10'));
      await state.feed.updatePrice(parseEther('5'));

      try {
        await state.minter.mint(tokenSynth, amountToMint);
      } catch (error) {
        expect(error.message).to.match(/below cRatio/);
      }
    });

    it('Should return error to mint if token minted is the same as collateral', async function() {
      await state.minter.depositCollateral(tokenSynth, parseEther('10'));

      try {
        await state.minter.mint(state.token.address, amountToMint);
      } catch (error) {
        expect(error.message).to.match(/invalid token/);
      }
    });

    it('Should return success when mint a synth', async function() {
      const value = BigNumber.from(parseEther('5'));
      await state.minter.depositCollateral(tokenSynth, parseEther('10'));
      await state.minter.mint(tokenSynth, value);

      expect(
        await checkMintEvent(
          state.minter,
          state.contractCreatorOwner.address,
          value
        )
      ).to.be.true;
    });
  });
});
