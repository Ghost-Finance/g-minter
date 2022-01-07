import React, { useEffect, useState } from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { Switch, Route, useLocation } from 'react-router-dom';
import { Grid, Typography } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import BigNumber from 'bignumber.js';
import { LogoIcon, SynthCardIcon } from '../../components/Icons';
import { useStyles } from './style';
import AppMenu from '../AppMenu';
import CssBaseline from '@material-ui/core/CssBaseline';
import NavElement from '../../components/NavElement';
import MintPage from '../MintPage';
import BurnPage from '../BurnPage';
import RewardPage from '../RewardPage';
import StakePage from '../StakePage';
import AlertPage from '../AlertPage';
import ProgressBar from '../../components/ProgressBar';
import GcardLink from '../../components/GcardLink';
import GhostRatio from '../../components/GhostRatioComponent/GhostRatio';
import LinkCard from '../../components/LinkCard';
import GhostRatioMint from '../../components/GhostRatioComponent/GhostRatioMint';
import cardsData from './cardsData';
import './style.css';
import WalletConnectPage from '../WalletConnectPage';
import ConnectWallet from '../../components/Button/ConnectWallet';
import {
  promiseAll,
  balanceOf,
  collateralBalance as collateralBalanceOf,
  getCRatio,
  synthDebtOf,
  feedPrice,
} from '../../utils/calls';
import { useERC20, useMinter, useFeed } from '../../hooks/useContract';
import { setCRatio, setStatus } from '../../redux/app/actions';
import {
  ghoAddress,
  gDaiAddress,
  feedGdaiAddress,
  feedGhoAddress,
} from '../../utils/constants';
import { useSelector } from '../../redux/hooks';
import { bigNumberToFloat, formatCurrency } from '../../utils/StringUtils';

interface Props {
  networkName?: string;
}

const MainPage = ({ networkName }: Props) => {
  const pagesWithoutNavElement = ['/alert', '/wallet-connect'];
  const classes = useStyles();
  const location = useLocation();
  const [rootPage, setRootPageChanged] = useState(true);
  const [cardsDataArray, setCardsDataArray] = useState(cardsData);
  const minterContract = useMinter();
  const feedGhoContract = useFeed(feedGhoAddress);
  const feedGdaiContract = useFeed(feedGdaiAddress);
  const ghoContract = useERC20(ghoAddress);
  const gdaiContract = useERC20(gDaiAddress);
  const {
    balanceOfGdai,
    balanceOfGho,
    collateralBalance,
    status,
  } = useSelector(state => state.app);
  const { account } = useSelector(state => state.wallet);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setStatus('pending'));
    setRootPageChanged(location.pathname === '/');

    function organizeCardsData() {
      debugger;
      if (balanceOfGdai === '0') return;

      let cardsDataArrayAfterMint = cardsData.filter(
        card => card.to !== '/mint' && card.to !== '/stake'
      );
      cardsDataArrayAfterMint.unshift({
        to: '/stake',
        title: 'Stake Synths',
        image: <SynthCardIcon />,
      });
      setCardsDataArray(cardsDataArrayAfterMint);
    }

    async function fetchData() {
      promiseAll(
        [
          getCRatio(minterContract, gDaiAddress, account as string),
          balanceOf(ghoContract, account as string),
          balanceOf(gdaiContract, account as string),
          collateralBalanceOf(minterContract, gDaiAddress, account as string),
          synthDebtOf(minterContract, gDaiAddress, account as string),
          feedPrice(feedGhoContract),
          feedPrice(feedGdaiContract),
        ],
        (data: any) => {
          const [
            cRatio,
            balanceGho,
            balanceGdai,
            collateralBalance,
            synthDebt,
            feedGhoPrice,
            feedGdaiPrice,
          ] = data;

          dispatch(
            setCRatio({
              cRatioValue: (bigNumberToFloat(cRatio) * 100).toString(),
              balanceOfGho: bigNumberToFloat(balanceGho).toString(),
              balanceOfGdai: bigNumberToFloat(balanceGdai).toString(),
              collateralBalance: bigNumberToFloat(collateralBalance).toString(),
              synthDebt: bigNumberToFloat(synthDebt).toString(),
              collateralBalancePrice: formatCurrency(
                bigNumberToFloat(collateralBalance) *
                  bigNumberToFloat(feedGhoPrice)
              ),
              synthDebtPrice: formatCurrency(
                bigNumberToFloat(synthDebt) * bigNumberToFloat(feedGdaiPrice)
              ),
            })
          );
          dispatch(setStatus('success'));
        },
        (error: any) => {
          console.log(error);
          dispatch(setStatus('error'));
        }
      );
    }

    account && fetchData();
    organizeCardsData();
    setTimeout(() => dispatch(setStatus('idle')), 6000);
  }, [
    rootPage,
    location,
    ghoContract,
    gdaiContract,
    account,
    balanceOfGdai,
    balanceOfGho,
    minterContract,
    dispatch,
  ]);

  return (
    <Grid
      container
      direction="row"
      className={
        rootPage
          ? classes.root
          : pagesWithoutNavElement.includes(location.pathname)
          ? ''
          : classes.pageActived
      }
    >
      <CssBaseline />
      {rootPage ? (
        <AppMenu />
      ) : (
        <div
          className={
            pagesWithoutNavElement.includes(location.pathname)
              ? ''
              : classes.pageActivedTop
          }
        ></div>
      )}
      {!pagesWithoutNavElement.includes(location.pathname) && (
        <NavElement styleWithBackgound={rootPage}>
          <div>
            <LogoIcon />
          </div>
          {rootPage ? <GhostRatio /> : <GhostRatioMint />}
        </NavElement>
      )}
      {rootPage && (
        <main className={classes.main}>
          <Grid
            container
            direction="row"
            justify="flex-end"
            alignItems="center"
          >
            <Grid item style={{ marginTop: 40 }} justify-xs-center="true">
              <ConnectWallet />
            </Grid>
            <Grid item className={classes.columnFixed} justify-xs-center="true">
              {account && balanceOfGho === '0' && collateralBalance === '0' ? (
                <LinkCard
                  title="🦄 Swap GHO"
                  text="into your wallet"
                  link={`https://app.uniswap.org/#/swap?outputCurrency=${ghoAddress}`}
                />
              ) : (
                <></>
              )}
              <Grid container item className={classes.item}>
                <Grid item xs={12} spacing={3}>
                  <Typography
                    variant="h6"
                    gutterBottom
                    className={classes.text}
                  >
                    Explore
                  </Typography>
                </Grid>
                <Grid item xs={12} spacing={3} className={classes.content}>
                  {status !== 'error' &&
                    status !== 'pending' &&
                    cardsDataArray.map((props, key) => (
                      <GcardLink
                        to={account ? props.to : '#'}
                        image={props.image}
                        title={props.title}
                        key={key}
                      />
                    ))}
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </main>
      )}
      <TransitionGroup>
        <CSSTransition
          in={rootPage}
          timeout={300}
          key={location.key}
          classNames="fade"
        >
          <Switch location={location}>
            <Route path="/mint" children={<MintPage />} />
            <Route path="/mint-burn" children={<BurnPage />} />
            <Route path="/rewards" children={<RewardPage />} />
            <Route path="/stake" children={<StakePage />} />
            <Route path="/wallet-connect" children={<WalletConnectPage />} />
            <Route path="/alert" children={<AlertPage />} />
          </Switch>
        </CSSTransition>
      </TransitionGroup>
      {status === 'pending' && <ProgressBar />}
    </Grid>
  );
};

export default MainPage;
