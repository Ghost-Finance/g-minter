import React, { useRef } from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { Switch, Route, useLocation } from 'react-router-dom';
import { Grid } from '@material-ui/core';
import {
  MintCardIcon,
  BurnCardIcon,
  RewardCardIcon,
  SynthCardIcon,
} from '../../components/Icons';
import CssBaseline from '@material-ui/core/CssBaseline';
import NavElement from '../../components/NavElement';
import MintPage from '../MintPage';
import BurnPage from '../BurnPage';
import RewardPage from '../RewardPage';
import StakePage from '../StakePage';
import GcardLink from '../../components/GcardLink';
import GhostRatio from '../../components/GhostRatio';
import { LogoIcon } from '../../components/Icons';
import { useStyles } from './style';
import './style.css';
import WalletConnectPage from '../WalletConnectPage';
import ConnectWallet from '../../components/Button/ConnectWallet';

interface Props {
  account?: string;
  networkName?: string;
}

const MainPage = ({ account, networkName }: Props) => {
  const classes = useStyles();
  const location = useLocation();
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
      <NavElement>
        <LogoIcon />
        <GhostRatio />
      </NavElement>
      <main className={classes.main}>
        <Grid container direction="row" justify="flex-end" alignItems="center">
          <Grid item>
            <ConnectWallet />
          </Grid>
          <Grid item className={classes.columnFixed} justify-xs-center>
            <div className={classes.item}>
              {cardsData.map(props => (
                <GcardLink {...props} />
              ))}
            </div>
            <TransitionGroup>
              <CSSTransition timeout={300} key={location.key} classNames="fade">
                <Switch location={location}>
                  <Route path="/mint" children={<MintPage />} />
                  <Route path="/mint-burn" children={<BurnPage />} />
                  <Route path="/rewards" children={<RewardPage />} />
                  <Route path="/stake" children={<StakePage />} />
                  <Route
                    path="/wallet-connect"
                    children={<WalletConnectPage />}
                  />
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
