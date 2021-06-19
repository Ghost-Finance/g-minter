import React from 'react';
import { Grid, Paper, Typography } from '@material-ui/core';
import useStyle from './style';
import arrowIcon from '../../assets/arrow-icon.png';

interface Props {
  text: string;
  active?: boolean;
}

const SwapCard = ({ text, active }: Props) => {
  const classes = useStyle();
  const imageProps = active ? { src: '' } : { src: arrowIcon };

  return (
    <div className={classes.root}>
      <Paper className={classes.content}>
        <Grid container spacing={2}>
          <Grid item>
            <div className={classes.image}>
              <img className={classes.img} alt="complex" {...imageProps} />
            </div>
          </Grid>
          <Grid item xs={12} sm container>
            <Grid item xs>
              <Typography component="h4" variant="h4" className={classes.title}>
                {text}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
};

export default SwapCard;
