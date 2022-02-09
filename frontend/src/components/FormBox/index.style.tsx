import { makeStyles, Theme } from '@material-ui/core';

const useStyle = makeStyles((theme: Theme) => ({
  root: {
    display: 'flex',
    flexFlow: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  container: {
    alignItems: 'center',
  },
  title: {
    marginTop: '60px',
    fontSize: 36,
    textAlign: 'center',
    marginBottom: '90px',
    lineHeight: '37px',
    [theme.breakpoints.down(1800)]: {
      marginTop: '35px',
      marginBottom: '40px',
    },
  },
  label: {
    color: theme.palette.secondary.dark,
    fontWeight: 500,
    fontSize: '14px',
    lineHeight: '17px',
    marginBottom: '70px',
    textAlign: 'center',
    [theme.breakpoints.down(1800)]: {
      marginBottom: '42px',
    },
  },
  button: {
    width: '325px !important',
    maxWidth: '325px',
    fontWeight: 'bold',
    marginBottom: '90px',
    [theme.breakpoints.down(1800)]: {
      marginBottom: '54px',
    },
  },
  disableButton: {
    backgroundColor: `${theme.palette.secondary.dark} !important`,
  },
}));

export default useStyle;
