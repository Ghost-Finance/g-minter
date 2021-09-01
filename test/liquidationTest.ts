import { ethers } from 'hardhat';
import * as chai from 'chai';
import { BigNumber } from 'ethers';
import { parseEther } from 'ethers/lib/utils';
import { checkFlagLiquidateEvent } from './util/CheckEvent';
import setup from './util/setup';

chai.use(require('chai-datetime'));
const { expect } = chai;

const amount = BigNumber.from(parseEther('500'));
const amountToDeposit = BigNumber.from(parseEther('100'));

describe('Liquidation', async function() {
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
    await state.minter.mint(
      synthTokenAddress,
      BigNumber.from(parseEther('50'))
    );
  });

  describe('Flag account to liquidate', async function() {
    it("Should revert if account hasn't collateral", async function() {
      const owner = state.contractCreatorOwner.address;

      try {
        await state.minter
          .connect(account)
          .flagLiquidate(owner, synthTokenAddress);
      } catch (error) {
        expect(error.message).to.match(/User cannot be flagged for liquidate/);
      }
    });

    it('Should revert if account is above passive cRatio of 300%', async function() {
      const owner = state.contractCreatorOwner.address;

      try {
        await state.minter
          .connect(account)
          .flagLiquidate(owner, synthTokenAddress);
      } catch (error) {
        expect(error.message).to.match(/Abouve cRatioPassivo/);
      }
    });

    it('Should return success if account is below passive cRatio of 300%', async function() {
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

  describe('Liquidate', async function() {});
});
