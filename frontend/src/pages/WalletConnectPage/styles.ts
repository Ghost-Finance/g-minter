import { makeStyles, Theme } from '@material-ui/core';

export default makeStyles((theme: Theme) => ({
  page: {
    backgroundColor: 'rgba(0,0,0,0.9)',
    display: 'flex',
    flexDirection: 'row',
    paddingTop: '88px',
  },
  content: {
    flex: 1,
    backgroundColor: theme.palette.primary.light,
    borderTop: `4px ${theme.palette.secondary.dark} solid`,
    padding: '10%',
    display: 'flex',
    flexDirection: 'column',
  },
  side: {
    width: '20%',
  },
  back: {
    padding: '0 15px',
    width: 48,
  },
  title: {
    color: theme.palette.secondary.main,
    fontSize: '36px',
    lineHeight: '44px',
  },
  providerRoot: {
    maxWidth: '170px',
    backgroundColor: 'transparent',
    border: `4px ${theme.palette.secondary.dark} solid`,
    borderRadius: '20px',
    marginTop: '10%',
  },
  providerImgContainer: {
    backgroundColor: theme.palette.primary.dark,
    borderBottom: `4px ${theme.palette.secondary.dark} solid`,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '40px 0',
  },
  providerImg: {
    width: '56px',
  },
  providerLabel: {
    color: theme.palette.secondary.main,
    fontSize: '16px',
    textAlign: 'center',
  },
  providerLabelContainer: {
    padding: '12px 0',
  },
  providerAction: {
    cursor: 'pointer',
  },
}));
