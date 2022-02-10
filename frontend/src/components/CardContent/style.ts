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
      width: 'calc(60%)',
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
      margin: '0 auto',
      width: '325px !important',
      maxWidth: '325px',
      height: '41px',
      backgroundColor: theme.palette.primary.dark,
      border: '1px solid #F2F2F2',
      boxSizing: 'border-box',
      borderRadius: 200,
      transform: 'matrix(0, 1, 1, 0, 0, 0)',
    },
  })
);

export default useStyle;
