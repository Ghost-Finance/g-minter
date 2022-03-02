import { makeStyles } from '@material-ui/core';

export default makeStyles(theme => ({
  root: {
    marginTop: '10px',
    marginBottom: '20px',
    borderRadius: '100px',
    fontSize: '14px',
    color: theme.palette.secondary.contrastText,
    border: `4px solid #414141`,
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: theme.palette.primary.main,
  },
  label: {
    flex: 'none',
  },
  priceLabel: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'baseline',
    '&>p': {
      color: theme.palette.secondary.dark,
    }
  },
  center: {
    flexDirection: 'row',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerAvatar: {
    minWidth: 0,
    margin: '0px 8px',
  },
  avatar: {
    minWidth: '40px',
  },
  full: {
    backgroundColor: theme.palette.primary.light,
  },
}));
