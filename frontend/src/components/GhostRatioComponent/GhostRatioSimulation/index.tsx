import React from 'react';
import { Box } from '@material-ui/core';
import ListSynths from '../../ListSynths';
import TokenLight from '../../TokenLight';
import TokenBorderLight from '../../TokenBorderLight';
import { GhostIcon, DaiIcon } from '../../Icons';
import CRatio from '../../CRatio';
import useStyles from './styles';
import theme from '../../../theme';

const GhostRatioSimulation = () => {
  const classes = useStyles(theme);
  return (
    <Box component="div" m={1} className={classes.root}>
      <div className={classes.box}>
        <div className={classes.content}>
          <CRatio
            size={200}
            progress={0}
            strokeWidth={4}
            circleTwoStroke="#4BE29A"
            errorColorStroke="#F44336"
          />
        </div>

        <ListSynths label="Position">
          <TokenLight icon={<DaiIcon />} label="gDAI" valueNumber={15.25} />
          <TokenLight icon={<GhostIcon />} label="GHO" valueNumber={100.22} />
        </ListSynths>

        <ListSynths label="Wallet">
          <TokenBorderLight
            icon={<GhostIcon />}
            label="GHO"
            valueNumber={100.22}
          />
        </ListSynths>
      </div>
    </Box>
  );
};

export default GhostRatioSimulation;
