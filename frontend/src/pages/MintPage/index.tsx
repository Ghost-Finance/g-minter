import React from 'react';
import { Link } from 'react-router-dom';
import { Grid } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import GhostRationSimulation from '../../components/GhostRatioComponent/GhostRatioSimulation';
import useStyle from './style';

const MintPage = () => {
  const classes = useStyle();
  return (
    <div className="page">
      <Grid container direction="row" className={classes.root}>
        <div className={classes.paperTop}>
          <Link to="/">
            <IconButton>
              <CloseIcon />
            </IconButton>
          </Link>
        </div>
        <div className={classes.content}>
          <div className={classes.paperContent}>
            <GhostRationSimulation />
          </div>
        </div>
      </Grid>
    </div>
  );
};

export default MintPage;
