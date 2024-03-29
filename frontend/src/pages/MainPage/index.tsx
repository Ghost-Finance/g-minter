import React, { useEffect, useState } from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { Switch, Route, useLocation } from 'react-router-dom';
import { Grid, Typography } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import { LogoIcon, SynthCardIcon } from '../../components/Icons';
import { useStyles } from './index.style';
import AppMenu from '../AppMenu';
import CssBaseline from '@material-ui/core/CssBaseline';
import NavElement from '../../components/NavElement';
import { ContentPage } from '../ContentPage';
import CardContent from '../../components/CardContent';
import MintPage from '../MintPage';
import MintAndBurnPage from '../MintAndBurnPage';
import RewardPage from '../RewardPage';
import StakePage from '../StakePage';
import ProgressBar from '../../components/ProgressBar';
import GcardLink from '../../components/GcardLink';
import GhostRatio from '../../components/GhostRatioComponent/GhostRatio';
import LinkCard from '../../components/LinkCard';
import GhostRatioMint from '../../components/GhostRatioComponent/GhostRatioMint';
import GhostRatioStake from '../../components/GhostRatioComponent/GhostRadioStake';
import { NetworkNames } from '../../config/enums';
import InvalidNetwork from '../../components/InvalidNetwork';
import cardsData from './cardsData';
import './main.css';
import WalletConnectPage from '../WalletConnectPage';
import ConnectWallet from '../../components/Button/ConnectWallet';
import {
  promiseAll,
  balanceOf,
  collateralBalance as collateralBalanceOf,
  getCRatio,
  synthDebtOf,
  feedPrice,
  filterByEvent,
} from '../../utils/calls';
import {
  useERC20,
  useMinter,
  useFeed,
  useUpdateHouse,
} from '../../hooks/useContract';
import { setCRatio, setBalanceOfGHO, setStatus } from '../../redux/app/actions';
import {
  ghoAddress,
  gDaiAddress,
  feedGdaiAddress,
  feedGhoAddress,
  updateHouseAddress,
} from '../../utils/constants';
import { useSelector } from '../../redux/hooks';
import { bigNumberToFloat, formatCurrency } from '../../utils/StringUtils';

const MainPage = () => {
  const pagesWithoutNavElement = ['/wallet-connect'];
  const classes = useStyles();
  const location = useLocation();
  const [rootPage, setRootPageChanged] = useState(true);
  const [stakePage, setStakePage] = useState(false);
  const [showDialogWrongNetwork, setDialogWrongNetWork] = useState<boolean>(
    false
  );
  const [cardsDataArray, setCardsDataArray] = useState(cardsData);
  const minterContract = useMinter();
  const updateHouseContract = useUpdateHouse(updateHouseAddress);
  const feedGhoContract = useFeed(feedGhoAddress);
  const feedGdaiContract = useFeed(feedGdaiAddress);
  const ghoContract = useERC20(ghoAddress);
  const gdaiContract = useERC20(gDaiAddress);
  const {
    balanceOfGdai,
    balanceOfGho,
    collateralBalance,
    synthDebt,
    status,
    networkName,
  } = useSelector(state => state.app);
  const { account, network } = useSelector(state => state.wallet);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    dispatch(setStatus('pending'));
    setRootPageChanged(location.pathname === '/');
    setStakePage(location.pathname === '/stake');

    setDialogWrongNetWork(network !== networkName);

    let intervalId: any;
    async function fetchGHOBalanceOf() {
      if ((balanceOfGho as string) !== '0') {
        clearInterval(intervalId);
        return;
      }

      const balanceValue = await balanceOf(ghoContract, account as string);
      balanceValue && dispatch(setBalanceOfGHO(balanceValue));
    }

    function organizeCardsData() {
      if (parseInt(balanceOfGdai || '') <= 0) return;

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
          filterByEvent(updateHouseContract, 'Create', account as string),
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
            dataPositions,
          ] = data;
          dispatch(
            setCRatio({
              cRatioValue: bigNumberToFloat(cRatio) * 100,
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
              dataPositions,
            })
          );
          dispatch(setStatus('success'));
        },
        (error: any) => {
          dispatch(setStatus('error'));
        }
      );
    }

    organizeCardsData();
    if (account && rootPage) {
      fetchData();
      intervalId = setInterval(fetchGHOBalanceOf, 3000);
    }
    setTimeout(() => dispatch(setStatus('idle')), 3000);

    return () => {
      clearInterval(intervalId);
    };
  }, [
    rootPage,
    location,
    ghoContract,
    gdaiContract,
    account,
    balanceOfGdai,
    balanceOfGho,
    collateralBalance,
    synthDebt,
    network,
    networkName,
    minterContract,
    feedGhoContract,
    feedGdaiContract,
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
          {rootPage || stakePage ? <GhostRatio /> : <GhostRatioMint />}
        </NavElement>
      )}
      {rootPage && status !== 'error' && status !== 'pending' && (
        <main className={classes.main}>
          <Grid
            container
            direction="column"
            justify="flex-start"
            alignContent="center"
          >
            <Grid
              item
              xs={8}
              sm
              spacing={2}
              style={{ marginTop: 40 }}
              className={classes.walletContainer}
            >
              <div className={classes.walletGrid}>
                <ConnectWallet />
              </div>
            </Grid>
            <Grid
              item
              xs={8}
              sm
              spacing={2}
              alignContent="center"
              className={classes.center}
            >
              <InvalidNetwork
                isOpen={showDialogWrongNetwork}
                targetNetwork={networkName}
              />
              {account &&
              balanceOfGho === '0' &&
              collateralBalance === '0' &&
              !showDialogWrongNetwork ? (
                <LinkCard
                  title="🦄 Swap GHO"
                  text="into your wallet"
                  link={`https://app.uniswap.org/#/swap?outputCurrency=${ghoAddress}&chain=${networkName.toLocaleLowerCase()}`}
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
                  {cardsDataArray.map((props, key) => (
                    <GcardLink
                      to={account && !showDialogWrongNetwork ? props.to : '#'}
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
            <Route
              path="/mint"
              children={
                <ContentPage showCancel={true}>
                  <CardContent typeCard="mint">
                    <MintPage title={'Mint your gDai'} />
                  </CardContent>
                </ContentPage>
              }
            />
            <Route path="/mint-burn" children={<MintAndBurnPage />} />
            <Route path="/rewards" children={<RewardPage />} />
            <Route path="/stake" children={<StakePage />} />
            <Route path="/wallet-connect" children={<WalletConnectPage />} />
          </Switch>
        </CSSTransition>
      </TransitionGroup>
      {status === 'pending' && <ProgressBar />}
    </Grid>
  );
};

export default MainPage;
