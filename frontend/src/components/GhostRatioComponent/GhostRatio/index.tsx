import React, { useEffect, useState } from 'react';
import { Box } from '@material-ui/core';
import ListSynths from '../../ListSynths';
import Token from '../../Token';
import TokenLight from '../../TokenLight';
import TokenBorderLight from '../../TokenBorderLight';
import { GhostIcon, DaiIcon, GdaiIcon, GhoIcon } from '../../Icons';
import { stakesData, SynthData } from '../../../config/synths';
import { useSelector } from '../../../redux/hooks';
import { getSynthAmount, filterByEvent } from '../../../utils/calls';
import { formatBalance, bigNumberToFloat } from '../../../utils/StringUtils';
import { SpaceXPulseIcon } from '../../Icons';
import CRatio from '../../CRatio';
import useStyles from './styles';
import theme from '../../../theme.style';
import { useGSpot, useUpdateHouse } from '../../../hooks/useContract';
import { gSpotAddress, updateHouseAddress } from '../../../utils/constants';
import { filterPositionByAccount } from '../../../utils/FilterUtils';
import Notification from '../../Notification';

const GhostRatio = () => {
  const classes = useStyles(theme);
  const [position, setPosition] = useState(0);
  const [dataPositionToAccount, setDataPositionToAccount] = useState<any>();
  const { account } = useSelector((state) => state.wallet);
  const app = useSelector((state) => state.app);
  const gSpotContract = useGSpot(gSpotAddress as string);
  const updateHouseContract = useUpdateHouse(updateHouseAddress);

  const {
    cRatioValue,
    balanceOfGho,
    balanceOfGdai,
    collateralBalance,
    synthDebt,
    collateralBalancePrice,
    synthDebtPrice,
    dataPositions,
  } = app;

  const getSynthAmountByKey = async (key: string) => {
    const amount = await getSynthAmount(gSpotContract, key, account as string);
    return bigNumberToFloat(amount.toString());
  };

  const listTokenSynth = (part: SynthData) => {
    getSynthAmountByKey(part.key).then((amount) => (part.amount = amount));

    return {
      ...part,
    };
  };

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

  const tokenLightValues = () => {
    return (
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
          {stakesData
            .map(listTokenSynth)
            .map((args: SynthData, key: number) => (
              <TokenBorderLight
                key={key}
                label={args.subtitle}
                icon={
                  <img
                    src={args.logo}
                    className={classes.logo}
                    alt={args.title}
                  />
                }
                amount={0}
                valueNumber={`${args.amount || ''} gDai`}
              />
            ))}
        </ListSynths>
        <Notification
          icon={<SpaceXPulseIcon />}
          message={`Welcome to Defi revolution`}
          severity="warning"
          color="info"
        />
      </>
    );
  };

  useEffect(() => {
    setPosition(
      parseInt(collateralBalance || '0') > 0 && parseInt(synthDebt || '0') > 0
        ? 1
        : 0
    );

    dataPositions &&
      setDataPositionToAccount(
        filterPositionByAccount(
          account as string,
          dataPositions,
          0,
          (dataPositions || []).length - 1
        )
      );
  }, [account, collateralBalance, dataPositions, synthDebt, cRatioValue]);

  return (
    <Box component="div" p={3} className={classes.box}>
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
