import { makeStyles, createStyles, Theme } from '@material-ui/core';

const useStyle = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexFlow: 'column',
      alignItems: 'flex-start',
    },
    cardForm: {
      marginTop: 20,
      width: 'calc(60% - 40px)',
      backgroundColor: '#393939',
      border: 1,
      [theme.breakpoints.down(1800)]: {
        marginTop: 0,
      },
    },
    default: {
      marginTop: 0,
    },
    mint: {
      margin: '0 auto',
      width: '325px !important',
      maxWidth: '325px',
      height: '41px',
      backgroundColor: theme.palette.primary.dark,
      borderRadius: '0 0 40px 40px',
    },
    burn: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      '& > div:nth-child(n)': {
        width: 108,
        padding: 10,
        height: '40px',
        backgroundColor: theme.palette.primary.dark,
        borderRadius: '0 0 40px 40px',
      },
    },
  })
);

export default useStyle;
