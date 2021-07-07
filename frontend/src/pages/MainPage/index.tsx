import React, { useRef, useState } from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { Switch, Route, useLocation } from 'react-router-dom';
import { Grid } from '@material-ui/core';
import {
  MintCardIcon,
  BurnCardIcon,
  RewardCardIcon,
  SynthCardIcon,
} from '../../components/Icons';
import AppMenu from '../AppMenu';
import CssBaseline from '@material-ui/core/CssBaseline';
import NavElement from '../../components/NavElement';
import MintPage from '../MintPage';
import BurnPage from '../BurnPage';
import RewardPage from '../RewardPage';
import StakePage from '../StakePage';
import GcardLink from '../../components/GcardLink';
import GhostRatio from '../../components/GhostRatioComponent/GhostRatio';
import SwapCard from '../../components/SwapCard';
import { LogoIcon } from '../../components/Icons';
import { useStyles } from './style';
import './style.css';
import GhostRatioSimulation from '../../components/GhostRatioComponent/GhostRatioSimulation';

interface Props {
  account?: string;
  networkName?: string;
}

const MainPage = ({ account, networkName }: Props) => {
  const classes = useStyles();
  const location = useLocation();
  const [stylePage, setStylePageChanged] = useState(true);

  const cardsData = [
    {
      to: '/mint',
      title: 'Mint gDAI',
      image: <MintCardIcon />,
    },
    {
      to: '/mint-burn',
      title: 'Mint and Burn',
      image: <BurnCardIcon />,
    },
    {
      to: '/rewards',
      title: 'Claim Rewards',
      image: <RewardCardIcon />,
    },
    {
      to: '/stake',
      title: 'Stake Synths',
      image: <SynthCardIcon />,
    },
  ];

  return (
    <Grid container direction="row" className={classes.root}>
      <CssBaseline />
      {stylePage && <AppMenu />}
      <NavElement styleWithBackgound={stylePage}>
        <LogoIcon />
        {stylePage ? <GhostRatio /> : <GhostRatioSimulation />}
      </NavElement>
      <main className={classes.main}>
        <Grid container direction="row" justify="flex-end" alignItems="center">
          <Grid item>
            <SwapCard text="Swap GHO into your wallet" />
          </Grid>
          <Grid item className={classes.columnFixed} justify-xs-center="true">
            <div className={classes.item}>
              {cardsData.map((props, key) => (
                <GcardLink {...props} key={key} />
              ))}
            </div>
            <TransitionGroup>
              <CSSTransition
                timeout={300}
                key={location.key}
                classNames="fade"
                onEnter={() => setStylePageChanged(false)}
                onExited={() => setStylePageChanged(true)}
              >
                <Switch location={location}>
                  <Route path="/mint" children={<MintPage />} />
                  <Route path="/mint-burn" children={<BurnPage />} />
                  <Route path="/rewards" children={<RewardPage />} />
                  <Route path="/stake" children={<StakePage />} />
                </Switch>
              </CSSTransition>
            </TransitionGroup>
          </Grid>
        </Grid>
      </main>
    </Grid>
  );
};

export default MainPage;
