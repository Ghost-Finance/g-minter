import React, { useEffect, useState } from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { Switch, Route, useLocation } from 'react-router-dom';
import { Grid } from '@material-ui/core';
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
import GcardLink from '../../components/GcardLink';
import GhostRatio from '../../components/GhostRatioComponent/GhostRatio';
import LinkCard from '../../components/LinkCard';
import GhostRatioMint from '../../components/GhostRatioComponent/GhostRatioMint';
import cardsData from './cardsData';
import './style.css';
import WalletConnectPage from '../WalletConnectPage';
import ConnectWallet from '../../components/Button/ConnectWallet';
import AlertLeftBar from '../../components/AlertLeftBar';
import { balanceOf, getCRatio } from '../../utils/calls';
import { useERC20, useMinter } from '../../hooks/useContract';
import { setCRatio } from '../../redux/app/actions';
import { ghoAddress, gDaiAddress } from '../../utils/constants';
import { useSelector } from '../../redux/hooks';
import { bigNumberToFloat } from '../../utils/StringUtils';

interface Props {
  networkName?: string;
}

const MainPage = ({ networkName }: Props) => {
  const pathNameAlert = '/alert';
  const classes = useStyles();
  const location = useLocation();
  const [rootPage, setRootPageChanged] = useState(true);
  const [loading, setLoading] = useState(true);
  const [cardsDataArray, setCardsDataArray] = useState(cardsData);
  const minterContract = useMinter();
  const ghoContract = useERC20(ghoAddress);
  const gdaiContract = useERC20(gDaiAddress);
  const { balanceOfGDAI, balanceOfGHO } = useSelector(state => state.app);
  const { account } = useSelector(state => state.wallet);
  const dispatch = useDispatch();

  useEffect(() => {
    setLoading(true);
    setRootPageChanged(location.pathname === '/');

    function organizeCardsData() {
      if (balanceOfGHO === '0' && balanceOfGDAI === '0') return;

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
      let cRatioValue = await getCRatio(
        minterContract,
        gDaiAddress,
        account as string
      );
      let balanceOfGHOValue = await balanceOf(ghoContract, account as string);
      let balanceOfGDAIValue = await balanceOf(gdaiContract, account as string);

      dispatch(
        setCRatio(
          (bigNumberToFloat(cRatioValue) * 100).toString(),
          new BigNumber(balanceOfGHOValue)
            .dividedBy(new BigNumber(10).pow(18))
            .toString(),
          new BigNumber(balanceOfGDAIValue)
            .dividedBy(new BigNumber(10).pow(18))
            .toString()
        )
      );
    }

    account && fetchData();
    organizeCardsData();
    setLoading(false);
  }, [
    rootPage,
    location,
    ghoContract,
    gdaiContract,
    account,
    balanceOfGDAI,
    balanceOfGHO,
    minterContract,
    setLoading,
    dispatch,
  ]);

  return (
    <Grid
      container
      direction="row"
      className={
        rootPage
          ? classes.root
          : location.pathname === pathNameAlert
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
            location.pathname === pathNameAlert ? '' : classes.pageActivedTop
          }
        ></div>
      )}
      <NavElement styleWithBackgound={rootPage}>
        <div>
          <LogoIcon />
        </div>
        {rootPage ? (
          <GhostRatio />
        ) : location.pathname === pathNameAlert ? (
          <AlertLeftBar />
        ) : (
          <GhostRatioMint />
        )}
      </NavElement>
      {rootPage && (
        <main className={classes.main}>
          <Grid
            container
            direction="row"
            justify="flex-end"
            alignItems="center"
          >
            <Grid
              item
              style={{ marginTop: 40, marginRight: 30 }}
              justify-xs-center="true"
            >
              <ConnectWallet />
            </Grid>
            <Grid item className={classes.columnFixed} justify-xs-center="true">
              {account && balanceOfGHO === '0' ? (
                <LinkCard
                  title="🦄 Swap GHO"
                  text="into your wallet"
                  link={`https://app.uniswap.org/#/swap?outputCurrency=${ghoAddress}`}
                />
              ) : (
                <></>
              )}
              <div className={classes.item}>
                {loading ? (
                  <p>Loading...</p>
                ) : (
                  cardsDataArray.map((props, key) => (
                    <GcardLink
                      to={account ? props.to : '#'}
                      image={props.image}
                      title={props.title}
                      key={key}
                    />
                  ))
                )}
              </div>
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
    </Grid>
  );
};

export default MainPage;
