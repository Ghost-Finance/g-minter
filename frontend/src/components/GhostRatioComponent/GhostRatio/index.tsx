import React, { useEffect, useState } from 'react';
import { Box } from '@material-ui/core';
import ListSynths from '../../ListSynths';
import Token from '../../Token';
import TokenLight from '../../TokenLight';
import {
  GhostIcon,
  DaiIcon,
  GdaiIcon,
  GhoIcon,
  SynthsIcon,
  SpaceXIcon,
  EtherIcon,
} from '../../Icons';
import { useSelector } from '../../../redux/hooks';
import CRatio from '../../CRatio';
import useStyles from './styles';
import theme from '../../../theme';

const GhostRatio = () => {
  const classes = useStyles(theme);
  const [position, setPosition] = useState(0);
  const { account } = useSelector(state => state.wallet);
  const app = useSelector(state => state.app);
  const {
    cRatioValue,
    balanceOfGho,
    balanceOfGdai,
    collateralBalance,
    synthDebt,
    collateralBalancePrice,
    synthDebtPrice,
  } = app;

  const tokenValues = (
    <>
      <Token
        icon={<DaiIcon />}
        label="gDAI"
        valueNumber={parseFloat(balanceOfGdai || '0')}
      />
      <Token
        icon={<GhostIcon />}
        label="GHO"
        valueNumber={parseFloat(balanceOfGho || '0')}
      />
    </>
  );

  const tokenLightValues = (
    <>
      <TokenLight
        icon={<GdaiIcon />}
        label="gDAI"
        amount={parseFloat(synthDebt || '0')}
        valueNumber={synthDebtPrice || '$ 0,00'}
      />
      <TokenLight
        icon={<GhoIcon />}
        label="GHO"
        amount={parseFloat(collateralBalance || '0')}
        valueNumber={collateralBalancePrice || '$ 0,00'}
      />
    </>
  );

  useEffect(() => {
    setPosition(
      parseInt(collateralBalance || '0') > 0 && parseInt(synthDebt || '0') > 0
        ? 1
        : 0
    );
  }, [collateralBalance, synthDebt]);

  return (
    <Box component="div" m={1} className={classes.root}>
      <div className={classes.box}>
        <div className={classes.content}>
          <CRatio
            size={200}
            progress={account ? parseInt(cRatioValue || '0') : 0}
            strokeWidth={4}
            circleOneStroke="#333333"
            circleTwoStroke="#4BE29A"
            errorColorStroke="#F44336"
          />
        </div>

        <ListSynths label={position ? 'position' : 'wallet'}>
          {position ? tokenLightValues : tokenValues}
        </ListSynths>

        <ListSynths label="synths">
          <Token icon={<SpaceXIcon />} label="gSPX" valueNumber={0.0} />
        </ListSynths>

        <ListSynths label="ecosystem">
          <Token center icon={<SynthsIcon />} label="GHO" valueNumber={0.0} />
          <Token center icon={<EtherIcon />} label="ETH" valueNumber={0.0} />
        </ListSynths>
      </div>
    </Box>
  );
};

export default GhostRatio;
