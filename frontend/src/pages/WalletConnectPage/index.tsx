import useStyles from './styles';
import theme from '../../theme';
import arrow from '../../assets/arrow.png';
import { Link } from 'react-router-dom';
import { Typography, Grid, Card } from '@material-ui/core';
import Providers from './Providers';
import hooks from '../../hooks/walletConnect';
import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

type T = {
  provider: any;
};

const RenderProvider = ({ provider }: T) => {
  const classes = useStyles(theme);
  const { image, label, onClick } = provider();
  return (
    <Grid item>
      <Card className={classes.providerRoot} variant="outlined">
        <a className={classes.providerAction} onClick={onClick}>
          <div className={classes.providerImgContainer}>
            <img className={classes.providerImg} src={image} />
          </div>
          <div className={classes.providerLabelContainer}>
            <Typography className={classes.providerLabel}>{label}</Typography>
          </div>
        </a>
      </Card>
    </Grid>
  );
};

export default () => {
  let history = useHistory();
  const classes = useStyles(theme);

  const { wallet } = hooks();
  const { connected } = wallet;

  useEffect(() => {
    if (connected) history.push('/');
  }, [connected]);

  return (
    <div className={`modal ${classes.page}`}>
      <div className={classes.side}>
        <Link to="/">
          <img className={classes.back} src={arrow} />
        </Link>
      </div>
      <div className={classes.content}>
        <Typography className={classes.title}>
          Choose
          <br />
          your wallet
        </Typography>
        <Grid container direction="row" spacing={2}>
          {Providers.map(p => (
            <RenderProvider provider={p} />
          ))}
        </Grid>
      </div>
    </div>
  );
};
