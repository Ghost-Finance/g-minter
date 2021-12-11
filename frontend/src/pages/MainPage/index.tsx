import React, { useEffect, useRef, useState } from 'react';
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
import InfoCard from '../../components/InfoCard';
import GhostRatioMint from '../../components/GhostRatioComponent/GhostRatioMint';
import cardsData from './cardsData';
import './style.css';
import WalletConnectPage from '../WalletConnectPage';
import ConnectWallet from '../../components/Button/ConnectWallet';
import AlertLeftBar from '../../components/AlertLeftBar';
import { balanceOf, getCRatio } from '../../utils/calls';
import { useERC20, useMinter } from '../../hooks/useContract';
import { setBalanceOfGHO, setCRatio } from '../../redux/app/actions';
import { ghoAddress, gDaiAddress } from '../../utils/constants';
import { useSelector } from '../../redux/hooks';
import { bigNumberToFloat } from '../../utils/StringUtils';

interface Props {
  account?: string;
  networkName?: string;
}

const MainPage = ({ account, networkName }: Props) => {
  const pathNameAlert = '/alert';
  const classes = useStyles();
  const location = useLocation();
  const [rootPage, setRootPageChanged] = useState(true);
  const [cardsDataArray, setCardsDataArray] = useState(cardsData);
  const minterContract = useMinter();
  const ghoContract = useERC20(ghoAddress);
  const { balanceOfGDAI } = useSelector(state => state.app);

  const dispatch = useDispatch();

  useEffect(() => {
    setRootPageChanged(location.pathname === '/');

    function organizeCardsData() {
      if (balanceOfGDAI !== '0') {
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
    }

    async function fetchData() {
      let cRatioValue = await getCRatio(
        minterContract,
        gDaiAddress,
        account as string
      );
      debugger;
      dispatch(setCRatio((bigNumberToFloat(cRatioValue) * 100).toString()));

      let balanceOfGHOValue = await balanceOf(ghoContract, ghoAddress);
      dispatch(
        setBalanceOfGHO(
          new BigNumber(balanceOfGHOValue)
            .dividedBy(new BigNumber(10).pow(18))
            .toString()
        )
      );
    }
    fetchData();
    organizeCardsData();
  }, [rootPage, location]);

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
            <Grid item style={{ marginTop: 40, marginRight: 30 }}>
              <ConnectWallet />
            </Grid>

            <Grid item className={classes.columnFixed} justify-xs-center="true">
              <LinkCard
                title="🦄 Swap GHO"
                text="into your wallet"
                link={`https://app.uniswap.org/#/swap?outputCurrency=${ghoAddress}`}
              />

              <div className={classes.item}>
                {cardsDataArray.map((props, key) => (
                  <GcardLink {...props} key={key} />
                ))}
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
