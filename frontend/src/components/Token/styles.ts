import { makeStyles } from '@material-ui/core';

export default makeStyles(theme => ({
  root: {
    marginTop: '10px',
    marginBottom: '20px',
    borderRadius: '100px',
    border: `4px solid ${theme.palette.primary.light}`,
    fontSize: '14px',
    color: theme.palette.secondary.contrastText,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  value: {
    color: theme.palette.secondary.contrastText,
  },
  center: {
    flexDirection: 'row',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    minWidth: 0,
    margin: '0px 8px',
  },
}));
