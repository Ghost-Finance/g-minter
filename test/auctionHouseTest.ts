import { ethers } from 'hardhat';
import { expect } from 'chai';
import * as sinon from 'sinon';
import { BigNumber } from 'ethers';
import { parseEther } from 'ethers/lib/utils';
import { checkAuctionHouseTakeEvent } from './util/CheckEvent';
import setup from './util/setup';

describe('Auction House tests', async function() {
  let state, synthTokenAddress, accountOne, accountTwo, clock;
  const amount = BigNumber.from(parseEther('500.0'));
  const amountToDeposit = BigNumber.from(parseEther('180.0'));

  beforeEach(async function() {
    // clock = await sinon.useFakeTimers();
    state = await setup();
    accountOne = state.contractAccounts[0];
    accountTwo = state.contractAccounts[1];

    const feedSynth = await state.Feed.deploy(
      parseEther('1'),
      'Feed Synth Coin'
    );
    await state.minter.createSynth(
      'GDAI',
      'GDAI',
      amount,
      200,
      300,
      feedSynth.address
    );

    synthTokenAddress = await state.minter.getSynth(0);
    await state.token
      .connect(accountOne)
      .approve(state.minter.address, amountToDeposit);
    await state.token
      .connect(accountTwo)
      .approve(state.minter.address, amountToDeposit);

    // account One - liquidated account
    await state.minter
      .connect(accountOne)
      .depositCollateral(synthTokenAddress, amountToDeposit);
    await state.minter
      .connect(accountOne)
      .mint(synthTokenAddress, BigNumber.from(parseEther('20.0')));

    // account Two - Keeper
    await state.minter
      .connect(accountTwo)
      .depositCollateral(synthTokenAddress, amountToDeposit);
    await state.minter
      .connect(accountTwo)
      .mint(synthTokenAddress, BigNumber.from(parseEther('20.0')));

    await state.feed.updatePrice(BigNumber.from(parseEther('0.2')));
    await state.minter
      .connect(accountTwo)
      .flagLiquidate(accountOne.address, synthTokenAddress);
    await state.minter
      .connect(accountTwo)
      .liquidate(accountOne.address, synthTokenAddress);

    // Total balance from keeper after receive the incentives from flag and liquidate.
    const balanceOfDAI = await state.minter.balanceOfSynth(
      accountTwo.address,
      synthTokenAddress
    );
    expect(balanceOfDAI.toString()).to.be.equal(
      BigNumber.from(parseEther('24.38'))
    );
  });

  // afterEach(async function(done) {
  //   await clock.restore();
  //   await done();
  // });

  it('validates when price of time house is bigger than collateral price', async function() {
    const id = 0;
    const amount = BigNumber.from(parseEther('190.0'));

    try {
      await state.auctionHouse
        .connect(accountTwo)
        .take(
          id,
          amount,
          BigNumber.from(parseEther('0.1')),
          accountTwo.address
        );
    } catch (error) {
      expect(error.message).to.match(
        /'price time house is bigger than collateral price'/
      );
    }
  });

  it('validates when amount is zero', async function() {
    const id = 0;
    const amount = BigNumber.from(parseEther('0.0'));

    try {
      await state.auctionHouse
        .connect(accountTwo)
        .take(id, amount, BigNumber.from(parseEther('1')), accountTwo.address);
    } catch (error) {
      expect(error.message).to.match(/'Invalid amount'/);
    }
  });

  // it.only('validates when call take function after finish the auction time', async function(done) {
  //   const id = 0;
  //   const amount = BigNumber.from(parseEther('1.0'));
  //   clock.tick(11 * 24 * 60 * 60 * 1000);
  //   setTimeout(done, 300);

  //   try {
  //     await state.auctionHouse
  //       .connect(accountTwo)
  //       .take(id, amount, amount, accountTwo.address);
  //   } catch (error) {
  //     expect(error.message).to.match(/'Auction period invalid'/);
  //   }
  // });

  it('Should return success when auction target is bided one part', async function() {
    const id = 0;
    const amount = BigNumber.from(parseEther('20.0'));

    await state.auctionHouse
      .connect(accountTwo)
      .take(id, amount, BigNumber.from(parseEther('1')), accountTwo.address);
    expect(
      await checkAuctionHouseTakeEvent(
        state.auctionHouse,
        accountTwo.address,
        accountTwo.address,
        amount
      )
    ).to.be.true;

    const auction = await state.auctionHouse.getAuction(0);
    expect(auction.auctionTarget.toString()).to.be.equal(
      BigNumber.from(parseEther('21.3'))
    );

    const keeperBalanceOfGHO = await state.token.balanceOf(accountTwo.address);
    const keeperBalanceOfGDAI = await state.minter.balanceOfSynth(
      accountTwo.address,
      synthTokenAddress
    );
    expect(keeperBalanceOfGHO.toString()).to.be.equal(
      BigNumber.from(parseEther('20.0'))
    );
    expect(keeperBalanceOfGDAI.toString()).to.be.equal(
      BigNumber.from(parseEther('20.38'))
    );
  });

  it('Should return success when chost is bigger than owe', async function() {
    const id = 0;
    const amount = BigNumber.from(parseEther('75.0'));

    await state.auctionHouse
      .connect(accountTwo)
      .take(id, amount, BigNumber.from(parseEther('0.2')), accountTwo.address);
    expect(
      await checkAuctionHouseTakeEvent(
        state.auctionHouse,
        accountTwo.address,
        accountTwo.address,
        BigNumber.from(parseEther('71.5'))
      )
    ).to.be.true;

    // const auction = await state.auctionHouse.getAuction(0);
    // expect(auction.auctionTarget.toString()).to.be.equal(
    //   BigNumber.from(parseEther('21.3'))
    // );

    // const keeperBalanceOfGHO = await state.token.balanceOf(accountTwo.address);
    // const keeperBalanceOfGDAI = await state.minter.balanceOfSynth(
    //   accountTwo.address,
    //   synthTokenAddress
    // );
    // expect(keeperBalanceOfGHO.toString()).to.be.equal(
    //   BigNumber.from(parseEther('20.0'))
    // );
    // expect(keeperBalanceOfGDAI.toString()).to.be.equal(
    //   BigNumber.from(parseEther('20.38'))
    // );
  });

  it('Should return success when all auction is sold', async function() {
    const id = 0;
    const amount = BigNumber.from(parseEther('190.0'));

    await state.auctionHouse
      .connect(accountTwo)
      .take(id, amount, BigNumber.from(parseEther('1.0')), accountTwo.address);
    expect(
      await checkAuctionHouseTakeEvent(
        state.auctionHouse,
        accountTwo.address,
        accountTwo.address,
        BigNumber.from(parseEther('119.8125'))
      )
    ).to.be.true;

    const auction = await state.auctionHouse.getAuction(0);
    expect(auction.auctionTarget.toString()).to.be.equal(
      BigNumber.from(parseEther('0'))
    );

    const keeperBalanceOfGHO = await state.token.balanceOf(accountTwo.address);
    const keeperBalanceOfGDAI = await state.minter.balanceOfSynth(
      accountTwo.address,
      synthTokenAddress
    );
    expect(keeperBalanceOfGHO.toString()).to.be.equal(
      BigNumber.from(parseEther('119.8125'))
    );
    expect(keeperBalanceOfGDAI.toString()).to.be.equal(
      BigNumber.from(parseEther('0.4175'))
    );
  });

  // it('')

  // it.only('Should decrese price in 1% when time pass 90s', async function() {
  //   const auction = await state.auctionHouse.getAuction(0);
  //   const startTime = auction.startTimestamp;

  //   const priceTimeHouse = await state.auctionHouse.price(
  //     BigNumber.from(parseEther('1')),
  //     Date.now() - startTime
  //   );

  //   console.log(priceTimeHouse);

  //   clock.tick(90);
  //   const priceTimeHouseTwo = await state.auctionHouse.price(
  //     BigNumber.from(parseEther('1')),
  //     Date.now() - startTime
  //   );
  //   console.log(priceTimeHouseTwo);
  // });
});
