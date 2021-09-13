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

describe('Minter', async function() {
  let state, amount;

  beforeEach(async function() {
    state = await setup();
    amount = BigNumber.from(parseEther('500.0'));
  });

  describe('Create a Synths', async function() {
    it('Should return error to create a synth if is not a owner', async function() {
      const feedSynth = await state.Feed.deploy(amount, 'Feed Coin');
      const account = state.contractAccounts[0];

      try {
        await state.minter
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
      const feedSynth = await state.Feed.deploy(amount, 'Feed Coin');

      try {
        await state.minter.createSynth(
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
      const feedSynth = await state.Feed.deploy(amount, 'Feed GDAI');

      await state.minter.createSynth(
        'Test coin',
        'COIN',
        amount,
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
    let synthTokenAddress, amountToDeposit, accountOne;

    beforeEach(async function() {
      accountOne = state.contractAccounts[0];
      amountToDeposit = BigNumber.from(parseEther('100.0'));
      const feedSynth = await state.Feed.deploy(amount, 'Feed Coin');
      await state.minter.createSynth(
        'Test coin',
        'COIN',
        amount,
        200,
        300,
        feedSynth.address
      );

      synthTokenAddress = await state.minter.getSynth(0);
      await state.token
        .connect(accountOne)
        .approve(state.minter.address, amountToDeposit);
    });

    it('Should return error to deposit collateral if account has not collateral token to deposit', async function() {
      try {
        await state.minter
          .connect(accountOne)
          .depositCollateral(
            synthTokenAddress,
            BigNumber.from(parseEther('1000.0'))
          );
      } catch (error) {
        expect(error.message).to.match(
          /ERC20: transfer amount exceeds balance/
        );
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
      await state.minter.depositCollateral(synthTokenAddress, amountToDeposit);

      expect(
        await checkDepositEvent(
          state.minter,
          state.contractCreatorOwner.address,
          synthTokenAddress,
          amountToDeposit
        )
      ).to.be.true;
    });
  });

  describe('Mint a token', async function() {
    let synthTokenAddress, amountToMint, amountToDeposit, accountOne;

    beforeEach(async function() {
      accountOne = state.contractAccounts[0];
      amountToDeposit = BigNumber.from(parseEther('100.0'));
      amountToMint = BigNumber.from(parseEther('1'));
      const feedSynth = await state.Feed.deploy(amountToMint, 'Feed Coin');
      await state.minter.createSynth(
        'Test coin',
        'COIN',
        amount,
        200,
        300,
        feedSynth.address
      );

      synthTokenAddress = await state.minter.getSynth(0);
      await state.token
        .connect(accountOne)
        .approve(state.minter.address, amountToDeposit);
    });

    it("Should return error to mint if account hasn't the collateral balance", async function() {
      try {
        await state.minter
          .connect(accountOne)
          .mint(synthTokenAddress, amountToMint);
      } catch (error) {
        expect(error.message).to.match(/Without collateral deposit/);
      }
    });

    it('Should return error to mint if account has below cRatio', async function() {
      await state.minter
        .connect(accountOne)
        .depositCollateral(synthTokenAddress, parseEther('100.0'));
      await state.feed.updatePrice(parseEther('50'));

      try {
        await state.minter
          .connect(accountOne)
          .mint(synthTokenAddress, amountToMint);
      } catch (error) {
        expect(error.message).to.match(/Below cRatio/);
      }
    });

    it('Should return error to mint if token minted is the same as collateral', async function() {
      await state.minter.depositCollateral(
        synthTokenAddress,
        parseEther('100')
      );

      try {
        await state.minter
          .connect(accountOne)
          .mint(state.token.address, amountToMint);
      } catch (error) {
        expect(error.message).to.match(/invalid token/);
      }
    });

    it.only('Should return success when mint a synth', async function() {
      const value = BigNumber.from(parseEther('20.0'));
      await state.minter
        .connect(accountOne)
        .depositCollateral(synthTokenAddress, amountToDeposit);

      await state.minter.mint(synthTokenAddress, value);

      // expect(
      //   await checkMintEvent(
      //     state.minter,
      //     state.contractCreatorOwner.address,
      //     value
      //   )
      // ).to.be.true;
    });
  });
});
