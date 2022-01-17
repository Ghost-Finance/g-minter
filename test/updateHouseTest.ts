import { ethers, network } from 'hardhat';
import { expect } from 'chai';
import { BigNumber } from 'ethers';
import { parseEther } from 'ethers/lib/utils';
import {
  checkCreatePositionEvent,
  checkFinishPositionEvent,
} from './util/CheckEvent';
import setup from './util/setup';

let updateHouseContractLabel: string = 'UpdateHouse';
let debtPoolContractLabel: string = 'DebtPool';
let gSpotContractLabel: string = 'GSpot';
let ssmContractLabel: string = 'Ssm';
let medianTestContractLabel: string = 'GValueTest';

describe.only('#UpdateHouse', async function() {
  let UpdateHouse,
    DebtPool,
    GSpot,
    Median,
    Ssm,
    debtPool,
    gSpot,
    gSpacexKey,
    updateHouse,
    ssm,
    median,
    owner,
    accounts,
    alice,
    bob,
    josh,
    others,
    synthTokenAddress,
    state,
    initialPrice;

  beforeEach(async function() {
    state = await setup();
    [owner, ...accounts] = await ethers.getSigners();
    [alice, bob, josh, ...others] = accounts;

    const feedSynth = await state.Feed.deploy(
      parseEther('1'),
      'Feed Synth Coin'
    );
    await state.minter.createSynth(
      'GDAI',
      'GDAI',
      BigNumber.from(parseEther('200.0')),
      200,
      300,
      feedSynth.address
    );
    synthTokenAddress = await state.minter.getSynth(0);

    [alice, bob].map(async account => {
      await state.token
        .connect(account)
        .approve(state.minter.address, BigNumber.from(parseEther('180.0')));
      await state.minter
        .connect(account)
        .mint(
          synthTokenAddress,
          BigNumber.from(parseEther('180.0')),
          BigNumber.from(parseEther('20.0'))
        );
    });

    Ssm = await ethers.getContractFactory(ssmContractLabel);
    Median = await ethers.getContractFactory(medianTestContractLabel);
    GSpot = await ethers.getContractFactory(gSpotContractLabel);
    DebtPool = await ethers.getContractFactory(debtPoolContractLabel);
    UpdateHouse = await ethers.getContractFactory(updateHouseContractLabel);

    median = await Median.deploy();
    gSpot = await GSpot.deploy();
    debtPool = await DebtPool.deploy(synthTokenAddress, state.minter.address);
    updateHouse = await UpdateHouse.deploy(
      synthTokenAddress,
      gSpot.address,
      debtPool.address
    );
    await updateHouse.setVault();

    gSpacexKey = ethers.utils.formatBytes32String('GSPACEX');
    await gSpot.addSsm(gSpacexKey, median.address);
    // Simulate add a new current price for a synth
    await median.poke(BigNumber.from(parseEther('74')));
    // If return success when adds a new price, it will be possible to read.
    initialPrice = await gSpot.connect(alice).read(gSpacexKey);
    expect(initialPrice.toString()).to.be.equal(
      BigNumber.from(parseEther('74')).toString()
    );

    await debtPool.addUpdatedHouse(updateHouse.address);
    await state.minter.addDebtPool(debtPool.address);
  });

  describe('Add a new position', async function() {
    it('#createPosition validates amount is positive', async function() {
      console.log(updateHouse.Position);

      try {
        await updateHouse.createPosition(
          BigNumber.from(parseEther('0.0')),
          gSpacexKey,
          2
        );
      } catch (error) {
        expect(error.message).to.match(/Invalid amount/);
      }
    });

    it('#createPosition validates if position is LONG or SHORT', async function() {
      try {
        await updateHouse.createPosition(
          BigNumber.from(parseEther('20.0')),
          gSpacexKey,
          0
        );
      } catch (error) {
        expect(error.message).to.match(/Invalid position option/);
      }
    });

    it('#createPosition validates if account has enough balance to make a move', async function() {
      try {
        await updateHouse
          .connect(alice)
          .createPosition(BigNumber.from(parseEther('50.0')), gSpacexKey, 2);
      } catch (error) {
        expect(error.message).to.match(/transfer amount exceeds balance/);
      }
    });

    it('#createPosition should return success to add a SHORT/LONG positions', async function() {
      await state.token
        .attach(synthTokenAddress)
        .connect(alice)
        .approve(updateHouse.getVault(), BigNumber.from(parseEther('10.0')));
      await updateHouse
        .connect(alice)
        .createPosition(BigNumber.from(parseEther('10.0')), gSpacexKey, 1);
      expect(
        await checkCreatePositionEvent(
          updateHouse,
          alice.address,
          1,
          1,
          gSpacexKey,
          BigNumber.from(parseEther('10.0')).toString()
        )
      ).to.be.true;

      await state.token
        .attach(synthTokenAddress)
        .connect(bob)
        .approve(updateHouse.getVault(), BigNumber.from(parseEther('10.0')));
      await updateHouse
        .connect(bob)
        .createPosition(BigNumber.from(parseEther('10.0')), gSpacexKey, 2);

      expect(
        await checkCreatePositionEvent(
          updateHouse,
          bob.address,
          1,
          2,
          gSpacexKey,
          BigNumber.from(parseEther('10.0')).toString()
        )
      ).to.be.true;
    });
  });

  describe.only('#finish Alice postion', async function() {
    let amount, positionData, balanceOf, synthDebt;

    beforeEach(async function() {
      amount = BigNumber.from(parseEther('20.0'));
      await state.token
        .attach(synthTokenAddress)
        .connect(alice)
        .approve(await updateHouse.getVault(), amount);

      // Add new position with all gDai from Alice
      await updateHouse.connect(alice).createPosition(amount, gSpacexKey, 2);
      balanceOf = await state.token
        .attach(synthTokenAddress)
        .balanceOf(alice.address);
      synthDebt = await state.minter
        .connect(alice)
        .synthDebt(alice.address, synthTokenAddress);
      console.log(
        `Alice balanceOf after buy a synth position ${balanceOf.toString()}`
      );
      console.log(
        `Alice synthDebt after buy a synth position ${synthDebt.toString()}`
      );

      positionData = await updateHouse.data(1);
      console.log(positionData);
      expect(positionData.account).to.be.equal(alice.address);
      expect(positionData.direction).to.be.equal(2); // Long postion
      expect(positionData.initialPrice.toString()).to.be.equal(
        initialPrice.toString()
      );
      const synthTokenAmountResult =
        (amount.toString() / initialPrice.toString()) * 10 ** 18;
      expect(positionData.synthTokenAmount.toString() / 10 ** 18).to.be.equal(
        synthTokenAmountResult / 10 ** 18
      );
    });

    it('#finish should transfer 30 gDai if Alice purchase 20 gSpx before the price increase 10%', async function() {
      // Increse the price of gSpx in 10%
      await median.poke(BigNumber.from(parseEther('81.4')));
      let currentPrice = await gSpot.connect(alice).read(gSpacexKey);
      expect(currentPrice.toString()).to.be.equal(
        BigNumber.from(parseEther('81.4'))
      );

      // Alice call finish operation
      await updateHouse.connect(alice).finishPosition(1);

      // Check event Finish
      expect(
        await checkFinishPositionEvent(
          updateHouse,
          alice.address,
          BigNumber.from(parseEther('21.998')).toString(),
          1
        )
      );
    });
  });
});
