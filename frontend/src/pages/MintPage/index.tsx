import React from 'react';
import { Link } from 'react-router-dom';
import { Grid } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import useStyle from './style';
import ButtonForm from '../../components/Button/ButtonForm';

const MintPage = () => {
  const classes = useStyle();

  return (
    <div className="modal">
      <Grid container direction="column" className={classes.root}>
        <Grid item>
          <Link to="/" className={classes.link}>
            <ButtonForm text="Cancel" className={classes.buttonCancel} />
          </Link>
        </Grid>
        <Grid className={classes.paperContent} item>
          <div className={classes.cardForm}>
            <Box className={classes.contentCard}>
              <ButtonForm text="Mint gDAI" />
            </Box>
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default MintPage;
