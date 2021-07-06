import React from 'react';
import { Box, makeStyles, Theme } from '@material-ui/core';
import ListSynths from '../../ListSynths';
import Token from '../../Token';
import {
  GhostIcon,
  DaiIcon,
  SynthsIcon,
  SpaceXIcon,
  EtherIcon,
} from '../../Icons';
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
            circleOneStroke="#333333"
            circleTwoStroke="#4BE29A"
            errorColorStroke="#F44336"
          />
        </div>
      </div>
    </Box>
  );
};

export default GhostRatioSimulation;
