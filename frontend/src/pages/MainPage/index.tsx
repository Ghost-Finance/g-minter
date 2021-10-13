import React, { useEffect, useRef, useState } from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { Switch, Route, useLocation } from 'react-router-dom';
import { Grid } from '@material-ui/core';
import { LogoIcon } from '../../components/Icons';
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
import SwapCard from '../../components/SwapCard';
import GhostRatioSimulation from '../../components/GhostRatioComponent/GhostRatioSimulation';
import cardsData from './cardsData';
import './style.css';
import WalletConnectPage from '../WalletConnectPage';
import ConnectWallet from '../../components/Button/ConnectWallet';
import AlertLeftBar from '../../components/AlertLeftBar';

interface Props {
  account?: string;
  networkName?: string;
}

const MainPage = ({ account, networkName }: Props) => {
  const pathNameAlert = '/alert';
  const classes = useStyles();
  const location = useLocation();
  const [rootPage, setRootPageChanged] = useState(true);

  useEffect(() => {
    setRootPageChanged(location.pathname === '/');
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
        <div className={classes.marginLogo}>
          <LogoIcon />
        </div>
        {rootPage ? (
          <GhostRatio />
        ) : location.pathname === pathNameAlert ? (
          <AlertLeftBar />
        ) : (
          <GhostRatioSimulation />
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
            <Grid item>
              <ConnectWallet />
            </Grid>

            <Grid item className={classes.columnFixed} justify-xs-center="true">
              <div className={classes.item}>
                {cardsData.map((props, key) => (
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
