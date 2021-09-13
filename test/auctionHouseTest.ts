import { ethers } from 'hardhat';
import { expect } from 'chai';
import { BigNumber } from 'ethers';
import { parseEther } from 'ethers/lib/utils';
import { checkAuctionHouseTakeEvent } from './util/CheckEvent';
import setup from './util/setup';

describe('Auction House tests', async function() {
  let state, synthTokenAddress, accountOne, accountTwo;
  const amount = BigNumber.from(parseEther('500.0'));
  const amountToDeposit = BigNumber.from(parseEther('180.0'));

  beforeEach(async function() {
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
  });

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

  it('validates when call take function after finish the auction time', async function() {
    const id = 0;
    const amount = BigNumber.from(parseEther('1.0'));

    // setup
    const now = Date.now() + 11 * 24 * 60 * 60 * 1000;
    await ethers.provider.send('evm_increaseTime', [now]);
    await ethers.provider.send('evm_mine', []);

    try {
      await state.auctionHouse
        .connect(accountTwo)
        .take(id, amount, amount, accountTwo.address);
    } catch (error) {
      expect(error.message).to.match(/'Auction period invalid'/);
    }
  });

  it('Should return success when bidding an auction part', async function() {
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
        amount,
        BigNumber.from(parseEther('0.2'))
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

  it('Should decrease price when bidding an auction part', async function() {
    const id = 0;
    const amount = BigNumber.from(parseEther('20.0'));

    // Before 90s
    await state.auctionHouse
      .connect(accountTwo)
      .take(id, amount, BigNumber.from(parseEther('1')), accountTwo.address);
    expect(
      await checkAuctionHouseTakeEvent(
        state.auctionHouse,
        accountTwo.address,
        accountTwo.address,
        amount,
        BigNumber.from(parseEther('0.2'))
      )
    ).to.be.true;

    // After 90s
    setTimeout(() => {
      state.auctionHouse
        .connect(accountTwo)
        .take(id, amount, BigNumber.from(parseEther('1')), accountTwo.address)
        .then(_ => {
          checkAuctionHouseTakeEvent(
            state.auctionHouse,
            accountTwo.address,
            accountTwo.address,
            amount,
            BigNumber.from(parseEther('0.198'))
          ).then(result => expect(result).to.be.true);
        });
    }, 90000);
    // await expect(
    //   await checkAuctionHouseTakeEvent(
    //     state.auctionHouse,
    //     accountTwo.address,
    //     accountTwo.address,
    //     amount,
    //     BigNumber.from(parseEther('0.198'))
    //   )
    // ).to.be.true;
  });

  it('Should return success when chost is bigger than owe', async function() {
    const id = 0;
    const expectedAmount = BigNumber.from(parseEther('71.5'));
    const amount = BigNumber.from(parseEther('75.0'));

    const auctionBefore = await state.auctionHouse.getAuction(id);
    expect(auctionBefore.auctionTarget.toString()).to.be.equal(
      BigNumber.from(parseEther('25.3'))
    );

    await state.auctionHouse
      .connect(accountTwo)
      .take(id, amount, BigNumber.from(parseEther('0.2')), accountTwo.address);
    expect(
      await checkAuctionHouseTakeEvent(
        state.auctionHouse,
        accountTwo.address,
        accountTwo.address,
        expectedAmount,
        BigNumber.from(parseEther('0.2'))
      )
    ).to.be.true;

    const auctionAfter = await state.auctionHouse.getAuction(id);
    expect(auctionAfter.auctionTarget.toString()).to.be.equal(
      BigNumber.from(parseEther('11.0'))
    );

    const keeperBalanceOfGHO = await state.token.balanceOf(accountTwo.address);
    const keeperBalanceOfGDAI = await state.minter.balanceOfSynth(
      accountTwo.address,
      synthTokenAddress
    );
    expect(keeperBalanceOfGHO.toString()).to.be.equal(
      BigNumber.from(parseEther('71.5'))
    );
    expect(keeperBalanceOfGDAI.toString()).to.be.equal(
      BigNumber.from(parseEther('9.38'))
    );
  });

  it('Should return success when all auction is sold', function(done) {
    const id = 0;
    const amount = BigNumber.from(parseEther('190.0'));
    const expectedAmount = BigNumber.from(parseEther('119.8125'));

    state.auctionHouse
      .connect(accountTwo)
      .take(id, amount, BigNumber.from(parseEther('1.0')), accountTwo.address)
      .then(_ => {
        checkAuctionHouseTakeEvent(
          state.auctionHouse,
          accountTwo.address,
          accountTwo.address,
          expectedAmount,
          BigNumber.from(parseEther('0.2'))
        ).then(result => expect(result).to.be.true);

        state.auctionHouse
          .getAuction(0)
          .then(auction => {
            expect(auction.auctionTarget.toString()).to.be.equal(
              BigNumber.from(parseEther('0'))
            );
          })
          .catch(error => {
            throw error;
          });

        // GHO balance for accountTwo
        state.token
          .balanceOf(accountTwo.address)
          .then(balance => {
            expect(balance.toString()).to.be.equal(expectedAmount);
          })
          .catch(error => {
            throw error;
          });

        // GDAI balance for accountTwo
        state.minter
          .balanceOfSynth(accountTwo.address, synthTokenAddress)
          .then(balance => {
            expect(balance).to.be.equal(BigNumber.from(parseEther('0.4175')));
          })
          .catch(error => {
            throw error;
          });

        // GDAI balance for accountOne
        state.minter
          .balanceOfSynth(accountOne.address, synthTokenAddress)
          .then(balance => {
            expect(balance.toString()).to.be.equal(
              BigNumber.from(parseEther('25.3'))
            );
          })
          .catch(error => {
            throw error;
          });

        // Collateral balance for accountOne
        state.minter
          .collateralBalance(accountOne.address, synthTokenAddress)
          .then(balance => {
            expect(balance.toString()).to.be.equal(
              BigNumber.from(parseEther('60.1875'))
            );
          })
          .catch(error => {
            throw error;
          });
      })
      .then(done);
  });

  it('Should decrese price after time pass', async function() {
    let priceTimeHouse;
    const price = BigNumber.from(parseEther('10.0'));

    priceTimeHouse = await state.auctionHouse.price(price, 0);
    expect(priceTimeHouse.toString()).to.be.equal(price);

    priceTimeHouse = await state.auctionHouse.price(price, 89);
    expect(priceTimeHouse.toString()).to.be.equal(price);

    priceTimeHouse = await state.auctionHouse.price(price, 90);
    expect(priceTimeHouse.toString()).to.be.equal(
      BigNumber.from(parseEther('9.9'))
    );
  });
});