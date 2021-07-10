import React from 'react';
import { Link } from 'react-router-dom';
import { Grid } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import useStyle from './style';

const MintPage = () => {
  const classes = useStyle();

  return (
    <div className="modal">
      <Grid container direction="row" className={classes.root}>
        <div>
          <Link to="/">
            <IconButton>
              <CloseIcon style={{ color: '#fff' }} />
            </IconButton>
          </Link>
        </div>
      </Grid>
    </div>
  );
};

export default MintPage;
