import React from 'react';
import { Box, makeStyles, Theme } from '@material-ui/core';
import CircularProgressBar from './CircularProgressBar';
import ListSynths from '../ListSynths';
import Token from '../Token';
import {
  GhostIcon,
  DaiIcon,
  SynthsIcon,
  SpaceXIcon,
  EtherIcon,
} from '../Icons';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    flexGrow: 1,
    marginTop: '28px',
  },
  box: {
    display: 'flex',
    flexFlow: 'column',
    boxSizing: 'border-box',
    [theme.breakpoints.down('md')]: {
      width: '100%',
      height: '100%',
      float: 'none',
    },
  },
  content: {
    width: '100%',
    display: 'flex',
    flexFlow: 'column',
    padding: '25px',
  },
}));

const GhostRatio = () => {
  const classes = useStyles();
  return (
    <Box component="div" m={1} className={classes.root}>
      <div className={classes.box}>
        <div className={classes.content}>
          <CircularProgressBar
            size={200}
            progress={850}
            strokeWidth={2}
            circleOneStroke="#333333"
            circleTwoStroke="#4BE29A"
            errorColorStroke="#F44336"
          />
        </div>

        <ListSynths label="">
          <Token icon={<GhostIcon />} label="GHO" valueNumber={100.22} />
          <Token icon={<DaiIcon />} label="gDAI" valueNumber={15.25} />
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
