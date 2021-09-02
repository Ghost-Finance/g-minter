import { ethers } from 'hardhat';
import * as chai from 'chai';
import { BigNumber } from 'ethers';
import { parseEther } from 'ethers/lib/utils';
import {
  checkFlagLiquidateEvent,
  checkLiquidateEvent,
} from './util/CheckEvent';
import setup from './util/setup';

chai.use(require('chai-datetime'));
const { expect } = chai;

const amount = BigNumber.from(parseEther('5'));
const amountToDeposit = BigNumber.from(parseEther('10'));

describe('Liquidation tests', async function() {
  let state, synthTokenAddress, account;

  beforeEach(async function() {
    state = await setup();
    account = state.contractAccounts[0];

    const feedSynth = await state.Feed.deploy(
      parseEther('1'),
      'Feed Synth Coin'
    );
    await state.minter.createSynth(
      'Test coin',
      'COIN',
      amount,
      200,
      300,
      feedSynth.address
    );

    synthTokenAddress = await state.minter.getSynth(0);
    await state.minter.depositCollateral(synthTokenAddress, amountToDeposit);
    await state.minter.mint(synthTokenAddress, BigNumber.from(parseEther('5')));
  });

  describe('Flag account to liquidate', async function() {
    it("Should revert if the account hasn't collateral", async function() {
      const owner = state.contractCreatorOwner.address;

      try {
        await state.minter
          .connect(account)
          .flagLiquidate(owner, synthTokenAddress);
      } catch (error) {
        expect(error.message).to.match(/User cannot be flagged for liquidate/);
      }
    });

    it('Should revert if the account is above passive C-Ratio of 300%', async function() {
      const owner = state.contractCreatorOwner.address;

      try {
        await state.minter
          .connect(account)
          .flagLiquidate(owner, synthTokenAddress);
      } catch (error) {
        expect(error.message).to.match(/Abouve cRatioPassivo/);
      }
    });

    it('Should return success if the account is below passive C-Ratio of 300%', async function() {
      const date = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000);
      const owner = state.contractCreatorOwner.address;
      await state.feed.updatePrice(BigNumber.from(parseEther('0.7')));

      await state.minter
        .connect(account)
        .flagLiquidate(owner, synthTokenAddress);

      expect(await checkFlagLiquidateEvent(state.minter, owner, date)).to.be
        .true;
    });
  });

  describe('Liquidate', async function() {
    it('Should revert if the account liquidated is the same calling the liquidate method', async function() {
      const accountOne = state.contractCreatorOwner.address;
      await state.feed.updatePrice(BigNumber.from(parseEther('0.7')));
      await state.minter
        .connect(account)
        .flagLiquidate(accountOne, synthTokenAddress);

      try {
        await state.minter.liquidate(accountOne, synthTokenAddress);
      } catch (error) {
        expect(error.message).to.match(/Sender cannot be the liquidated/);
      }
    });

    it('Should revert if the period of the account flagged is not end', async function() {
      const accountOne = state.contractCreatorOwner.address;
      await state.feed.updatePrice(BigNumber.from(parseEther('0.7')));
      await state.minter
        .connect(account)
        .flagLiquidate(accountOne, synthTokenAddress);

      try {
        await state.feed.updatePrice(BigNumber.from(parseEther('1')));
        await state.minter
          .connect(account)
          .liquidate(accountOne, synthTokenAddress);
      } catch (error) {
        expect(error.message).to.match(/above cRatio/);
      }
    });

    it('Should liquidate user if is below active C-Ratio 200%', async function() {
      const date = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      const accountOne = state.contractCreatorOwner.address;
      await state.feed.updatePrice(BigNumber.from(parseEther('0.7')));
      await state.minter
        .connect(account)
        .flagLiquidate(accountOne, synthTokenAddress);

      await state.minter
        .connect(account)
        .liquidate(accountOne, synthTokenAddress);
      const balance = await state.minter.balanceOfSynth(
        account.address,
        synthTokenAddress
      );

      expect(
        await checkLiquidateEvent(
          state.minter,
          state.auctionHouse,
          accountOne,
          account.address,
          synthTokenAddress,
          date
        )
      ).to.be.true;
      expect(balance.toString()).to.be.equal(parseEther('0.2').toString());
    });
  });
});
