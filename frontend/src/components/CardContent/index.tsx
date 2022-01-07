import React from 'react';
import useStyle from './style';
import { Grid } from '@material-ui/core';

type Props = {
  children?: React.ReactNode;
};

const CardContent = ({ children }: Props) => {
  const classes = useStyle();

  return (
    <Grid className={classes.root} item>
      <div className={classes.cardForm}>{children}</div>
    </Grid>
  );
};

export default CardContent;
