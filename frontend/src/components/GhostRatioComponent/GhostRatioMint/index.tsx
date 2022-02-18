import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Box } from '@material-ui/core';
import ListSynths from '../../ListSynths';
import TokenLight from '../../TokenLight';
import TokenBorderLight from '../../TokenBorderLight';
import { GhostIcon, DaiIcon, SpaceXIcon } from '../../Icons';
import CRatio from '../../CRatio';
import useStyles from './styles';
import theme from '../../../theme.style';
import { useSelector } from '../../../redux/hooks';
import { formatBalance } from '../../../utils/StringUtils';

const GhostRatioMint = () => {
  const classes = useStyles(theme);
  const [stakePage, setStakePage] = useState<boolean>(false);
  const location = useLocation();

  const {
    cRatioSimulateValue,
    balanceOfGho,
    balanceOfGdai,
    collateralBalance,
    synthDebt,
  } = useSelector(state => state.app);

  useEffect(() => {
    setStakePage(location.pathname === '/stake');
  }, [location.pathname]);

  return (
    <Box component="div" m={1} className={classes.root}>
      <div className={classes.box}>
        <div className={classes.content}>
          <CRatio
            size={200}
            progress={parseInt(cRatioSimulateValue || '')}
            strokeWidth={4}
            circleTwoStroke="#4BE29A"
            errorColorStroke="#F44336"
          />
        </div>

        <ListSynths label="Position">
          <TokenLight
            icon={<GhostIcon />}
            label="GHO"
            valueNumber={formatBalance(Number(collateralBalance || '0'))}
          />
          <TokenLight
            icon={<DaiIcon />}
            label="gDAI"
            valueNumber={formatBalance(Number(synthDebt || '0'))}
          />
        </ListSynths>

        {stakePage ? (
          <>
            <ListSynths label="Staking">
              <TokenLight
                icon={<SpaceXIcon iconColor={`${theme?.brand.main}`} />}
                label="gSPX"
                valueNumber={'10'}
              />
            </ListSynths>
            <ListSynths label="Available">
              <TokenBorderLight
                icon={<DaiIcon />}
                label="gDai"
                valueNumber={formatBalance(Number(balanceOfGdai || '0'))}
              />
            </ListSynths>
          </>
        ) : (
          <ListSynths label="Wallet">
            <TokenBorderLight
              icon={<GhostIcon />}
              label="GHO"
              valueNumber={formatBalance(Number(balanceOfGho || '0'))}
            />
            <TokenBorderLight
              icon={<DaiIcon />}
              label="gDai"
              valueNumber={formatBalance(Number(balanceOfGdai || '0'))}
            />
          </ListSynths>
        )}
      </div>
    </Box>
  );
};

export default GhostRatioMint;
