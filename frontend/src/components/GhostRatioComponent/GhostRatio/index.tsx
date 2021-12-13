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
import { useSelector } from '../../../redux/hooks';
import { bigNumberToString } from '../../../utils/StringUtils';
import CRatio from '../../CRatio';
import useStyles from './styles';
import theme from '../../../theme';

const GhostRatio = () => {
  const classes = useStyles(theme);

  const app = useSelector(state => state.app);
  const { cRatioValue, balanceOfGHO, balanceOfGDAI } = app;
  return (
    <Box component="div" m={1} className={classes.root}>
      <div className={classes.box}>
        <div className={classes.content}>
          <CRatio
            size={200}
            progress={parseInt(cRatioValue || '')}
            strokeWidth={4}
            circleOneStroke="#333333"
            circleTwoStroke="#4BE29A"
            errorColorStroke="#F44336"
          />
        </div>

        <ListSynths label="">
          <Token
            icon={<GhostIcon />}
            label="GHO"
            valueNumber={bigNumberToString(balanceOfGHO || '0')}
          />
          <Token
            icon={<DaiIcon />}
            label="gDAI"
            valueNumber={bigNumberToString(balanceOfGDAI || '0')}
          />
          <Token icon={<SynthsIcon />} label="Synths" valueNumber={0.0} />
        </ListSynths>

        <ListSynths label="synths">
          <Token icon={<SpaceXIcon />} label="gSPX" valueNumber={0.0} />
        </ListSynths>

        <ListSynths label="ecosystem">
          <Token center icon={<SynthsIcon />} label="GHO" valueNumber={23.23} />
          <Token center icon={<EtherIcon />} label="ETH" valueNumber={0.0} />
        </ListSynths>
      </div>
    </Box>
  );
};

export default GhostRatio;
