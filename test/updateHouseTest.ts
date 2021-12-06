import { ethers, network } from 'hardhat';
import { expect } from 'chai';
import { BigNumber } from 'ethers';
import { parseEther } from 'ethers/lib/utils';
import setup from './util/setup';

let updateHouseContractLabel: string = 'UpdateHouse';
let debtPoolContractLabel: string = 'DebtPool';
let gSpotContractLabel: string = 'GSpot';
let ssmContractLabel: string = 'Ssm';
let medianTestContractLabel: string = 'GValueTest';

describe('#UpdateHouse', async function() {
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
    accountOne,
    accountTwo,
    accountThree,
    others,
    synthTokenAddress,
    state;

  beforeEach(async function() {
    state = await setup();
    [owner, ...accounts] = await ethers.getSigners();
    [accountOne, accountTwo, accountThree, ...others] = accounts;

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
    await state.token
      .connect(accountOne)
      .approve(state.minter.address, BigNumber.from(parseEther('180.0')));
    await state.minter
      .connect(accountOne)
      .depositCollateral(
        synthTokenAddress,
        BigNumber.from(parseEther('180.0'))
      );
    await state.minter
      .connect(accountOne)
      .mint(synthTokenAddress, BigNumber.from(parseEther('20.0')));

    Ssm = await ethers.getContractFactory(ssmContractLabel);
    Median = await ethers.getContractFactory(medianTestContractLabel);
    GSpot = await ethers.getContractFactory(gSpotContractLabel);
    DebtPool = await ethers.getContractFactory(debtPoolContractLabel);
    UpdateHouse = await ethers.getContractFactory(updateHouseContractLabel);

    median = await Median.deploy();
    ssm = await Ssm.deploy(median.address);
    gSpot = await GSpot.deploy();
    console.log('esta akkk');
    debtPool = await DebtPool.deploy(synthTokenAddress, state.minter.address);
    console.log('passouu aqui');
    updateHouse = await UpdateHouse.deploy(
      synthTokenAddress,
      gSpot.address,
      debtPool.address
    );

    gSpacexKey = ethers.utils.formatBytes32String('GSPACEX');
    // Add READER rule for accountOne and gSpot contract
    await ssm.grantRole(await ssm.READER_ROLE(), accountOne.address);
    await ssm.grantRole(await ssm.READER_ROLE(), gSpot.address);
    // Add contract ssm for gSpot
    await gSpot.addSsm(gSpacexKey, ssm.address);
    // Simulate add a new current price for a synth
    await median.poke(BigNumber.from(parseEther('3.0')));
    await network.provider.send('evm_increaseTime', [
      (await ssm.zzz()).toNumber() + 3600,
    ]);
    await ssm.connect(accountOne).poke();

    await median.poke(BigNumber.from(parseEther('3.0')));
    await network.provider.send('evm_increaseTime', [
      (await ssm.zzz()).toNumber() + 3600,
    ]);
    await ssm.connect(accountOne).poke();

    // If return success when adds a new price, it will be possible to read.
    const price = await gSpot.connect(accountOne).read(gSpacexKey);
    expect(price.toString()).to.be.equal(
      BigNumber.from(parseEther('3.0')).toString()
    );

    await debtPool.addUpdatedHouse(updateHouse.address);
  });

  describe('Add a new position', async function() {
    it('#add validates amount is positive', async function() {
      console.log(updateHouse.Position);

      try {
        await updateHouse.add(BigNumber.from(parseEther('0.0')), gSpacexKey, 2);
      } catch (error) {
        expect(error.message).to.match(/Invalid amount/);
      }
    });

    it('#add validates if position is LONG or SHORT', async function() {
      try {
        await updateHouse.add(
          BigNumber.from(parseEther('20.0')),
          gSpacexKey,
          0
        );
      } catch (error) {
        expect(error.message).to.match(/Invalid position option/);
      }
    });

    it('#add validates if account has enough balance to make a move', async function() {
      try {
        await updateHouse
          .connect(accountOne)
          .add(BigNumber.from(parseEther('50.0')), gSpacexKey, 2);
      } catch (error) {
        console.log(error.message);
        expect(error.message).to.match(/transfer amount exceeds balance/);
      }
    });
  });
});
