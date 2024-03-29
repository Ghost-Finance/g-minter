import { makeStyles, createStyles, Theme } from '@material-ui/core';

const useStyle = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexFlow: 'column',
      alignItems: 'flex-start',
    },
    cardForm: {
      margin: '100px auto',
      width: 'calc(100% - 40px)',
      position: 'relative',
      backgroundColor: theme?.palette?.primary?.light,
      border: 1,
      [theme.breakpoints.down('md')]: {
        marginTop: 0,
        width: '100%',
      },
    },
    default: {
      marginTop: 0,
    },
    mint: {
      margin: '0 auto',
      width: '100% !important',
      maxWidth: '320px !important',
      height: '40px',
      backgroundColor: theme.palette.primary.dark,
      borderRadius: '0 0 40px 40px',
    },
    burn: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      '& > div:nth-child(n)': {
        width: 70,
        height: 40,
        padding: 10,
        marginLeft: 12,
        marginRight: 12,
        backgroundColor: theme.palette.primary.dark,
        borderRadius: '0 0 40px 40px',
      },
    },
    stake: {
      margin: '0 auto',
      backgroundColor: theme?.palette?.primary?.light,
      borderTopLeftRadius: '48px',
      borderTopRightRadius: '48px',
      // content: '""',
      height: '3rem',
      position: 'relative',
      top: '-6%',
      width: '320px',
      [theme.breakpoints.down('sm')]: {
        top: '12%',
        width: '100%',
      },
    },
  })
);

export default useStyle;
