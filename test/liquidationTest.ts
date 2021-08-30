import { ethers } from 'hardhat';
import { expect } from 'chai';
import { BigNumber } from 'ethers';
import { parseEther } from 'ethers/lib/utils';
import { checkDepositEvent, checkMintEvent } from './util/CheckEvent';
import setup from './util/setup';

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
    await state.minter.mint(
      synthTokenAddress,
      BigNumber.from(parseEther('10'))
    );
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

    it.only('Should revert if account is above cRatio passive of 300%', async function() {
      const value = BigNumber.from(parseEther('5'));
      const account = state.contractAccounts[1];
      await state.token.transfer(account.address, value);

      try {
        await state.minter
          .connect(account)
          .depositCollateral(synthTokenAddress, value);
        expect(
          await checkDepositEvent(
            state.minter,
            account.address,
            synthTokenAddress,
            amountToDeposit
          )
        ).to.be.true;

        await state.minter
          .connect(account)
          .mint(synthTokenAddress, BigNumber.from(parseEther('1')));
        expect(await checkMintEvent(state.minter, account.address, amount)).to
          .be.true;

        await state.minter.flagLiquidate(account.address, synthTokenAddress);
      } catch (error) {
        expect(error.message).to.match(/Abouve cRatioPassivo/);
      }
    });
  });
});
