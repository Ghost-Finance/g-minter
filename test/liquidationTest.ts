import { ethers } from 'hardhat';
import * as chai from 'chai';
import { BigNumber } from 'ethers';
import { parseEther } from 'ethers/lib/utils';
import { checkFlagLiquidateEvent } from './util/CheckEvent';
import setup from './util/setup';

chai.use(require('chai-datetime'));
const { expect } = chai;

const amount = BigNumber.from(parseEther('10'));
const amountToDeposit = BigNumber.from(parseEther('10'));

describe('Liquidation', async function() {
  let state, synthTokenAddress;

  beforeEach(async function() {
    state = await setup();
    const feedSynth = await state.Feed.deploy(amount, 'Feed Synth Coin');
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
    it("Should revert if account hasn't collateral", async function() {
      const account = state.contractAccounts[0];

      try {
        await state.minter.flagLiquidate(account.address, synthTokenAddress);
      } catch (error) {
        expect(error.message).to.match(/User cannot be flagged for liquidate/);
      }
    });

    it('Should revert if account is above passive cRatio of 300%', async function() {
      const account = state.contractCreatorOwner;

      try {
        await state.minter.flagLiquidate(account.address, synthTokenAddress);
      } catch (error) {
        expect(error.message).to.match(/Abouve cRatioPassivo/);
      }
    });

    it('Should return success if account is below passive cRatio of 300%', async function() {
      const date = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000);
      const account = state.contractCreatorOwner;

      await state.feed.updatePrice(BigNumber.from(parseEther('0.7')));
      await state.minter.flagLiquidate(account.address, synthTokenAddress);
      expect(await checkFlagLiquidateEvent(state.minter, account.address, date))
        .to.be.true;
    });
  });
});
