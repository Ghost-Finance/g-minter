import React, { useEffect, useState } from 'react';
import { Box } from '@material-ui/core';
import ListSynths from '../../ListSynths';
import Token from '../../Token';
import TokenLight from '../../TokenLight';
import { GhostIcon, DaiIcon, GdaiIcon, GhoIcon } from '../../Icons';
import { stakesData, SythData } from '../../../config/synths';
import { useSelector } from '../../../redux/hooks';
import { getSynthAmount } from '../../../utils/calls';
import { formatBalance } from '../../../utils/StringUtils';
import CRatio from '../../CRatio';
import useStyles from './styles';
import theme from '../../../theme.style';
import { useGSpot } from '../../../hooks/useContract';
import { gSpotAddress } from '../../../utils/constants';

const GhostRatio = () => {
  const classes = useStyles(theme);
  const [position, setPosition] = useState(0);
  const { account } = useSelector((state) => state.wallet);
  const app = useSelector((state) => state.app);
  const gSpotContract = useGSpot(gSpotAddress as string);
  const {
    cRatioValue,
    balanceOfGho,
    balanceOfGdai,
    collateralBalance,
    synthDebt,
    collateralBalancePrice,
    synthDebtPrice,
  } = app;

  async function synthAmount(key: string) {
    debugger;
    const result = await getSynthAmount(gSpotContract, key, account as string);

    return formatBalance(result);
  }

  const tokenValues = () => (
    <>
      <Token
        icon={<DaiIcon />}
        label="gDAI"
        valueNumber={formatBalance(Number(balanceOfGdai || '0'))}
      />
      <Token
        icon={<GhostIcon />}
        label="GHO"
        valueNumber={formatBalance(Number(balanceOfGho || '0'))}
      />
    </>
  );

  const tokenLightValues = () => (
    <>
      <TokenLight
        icon={<GdaiIcon />}
        label="gDAI"
        amount={formatBalance(Number(synthDebt || '0'))}
        valueNumber={synthDebtPrice || '$ 0,00'}
      />
      <TokenLight
        icon={<GhoIcon />}
        label="GHO"
        amount={formatBalance(Number(collateralBalance || '0'))}
        valueNumber={collateralBalancePrice || '$ 0,00'}
      />
      <ListSynths label={'Staking'} isSubtitle={true}>
        {stakesData.map((synth: SythData) => (
          <Token
            icon={synth.logo}
            label={synth.subtitle}
            valueNumber={synth.key ? Number(synthAmount(synth.key) || '0') : 0}
          />
        ))}
      </ListSynths>
    </>
  );

  useEffect(() => {
    setPosition(
      parseInt(collateralBalance || '0') > 0 && parseInt(synthDebt || '0') > 0
        ? 1
        : 0
    );
  }, [collateralBalance, synthDebt, cRatioValue]);

  return (
    <Box component="div" m={3}>
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
        {position ? tokenLightValues() : tokenValues()}
      </ListSynths>
    </Box>
  );
};

export default GhostRatio;
