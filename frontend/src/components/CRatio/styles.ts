import { makeStyles, Theme } from '@material-ui/core';

export default makeStyles((theme: Theme) => ({
  root: {
    margin: 'auto',
    padding: 10,
    width: 200,
    height: 200,
    [theme.breakpoints.down('md')]: {
      width: '160px',
      height: '160px',
    },
  },
  svg: {
    display: 'block',
    width: '100%',
  },
  svgCircle: {
    fill: theme.palette.primary.main,
    fontSize: '2rem',
  },
  svgCircleText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: '1.7rem',
  },
  text: {
    color: theme.palette.secondary.dark,
    textTransform: 'uppercase',
    marginTop: 5,
    fontSize: '0.6rem',
  },
  infos: {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: 'calc(100% - 25px + 4px)',
    height: 'calc(100% - 25px + 4px)',
  },
}));
